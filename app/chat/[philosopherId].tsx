import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const triggerHaptic = () => {
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
};
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import { PHILOSOPHERS, WELCOME_MESSAGES, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Message, Conversation } from '@/types/chat';
import { streamPhilosopherResponse } from '@/services/anthropic';
import { saveConversation } from '@/services/storage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function ChatScreen() {
  const { philosopherId } = useLocalSearchParams<{ philosopherId: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const id = (philosopherId ?? 'socrates') as PhilosopherId;
  const philosopher = PHILOSOPHERS[id];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: WELCOME_MESSAGES[id],
      philosopherId: id,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const conversationIdRef = useRef(generateId());

  useEffect(() => {
    navigation.setOptions({
      title: philosopher.nameKo,
      headerStyle: { backgroundColor: Colors.surface },
      headerTintColor: philosopher.color,
    });
  }, [philosopher]);

  const scrollToBottom = () => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    triggerHaptic();

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const assistantMsgId = generateId();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      philosopherId: id,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreamingId(assistantMsgId);
    setIsLoading(true);
    scrollToBottom();

    try {
      const history = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
      let full = '';

      for await (const chunk of streamPhilosopherResponse(id, history, text)) {
        full += chunk;
        const captured = full;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: captured } : m)),
        );
        scrollToBottom();
      }

      setStreamingId(null);
      setIsLoading(false);

      const finalMessages = [
        ...messages,
        userMsg,
        { ...assistantMsg, content: full },
      ];
      const conv: Conversation = {
        id: conversationIdRef.current,
        philosopherId: id,
        messages: finalMessages,
        createdAt: finalMessages[0].timestamp,
        updatedAt: Date.now(),
      };
      await saveConversation(conv);
    } catch (err: any) {
      setStreamingId(null);
      setIsLoading(false);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      Alert.alert(
        '오류가 발생했습니다',
        err?.message ?? '잠시 후 다시 시도해주세요.',
        [{ text: '확인' }],
      );
    }
  }, [input, isLoading, messages, id]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        message={item}
        philosopherId={id}
        isStreaming={item.id === streamingId && item.content.length > 0}
      />
    ),
    [id, streamingId],
  );

  const ListFooter = () =>
    isLoading && streamingId === null ? (
      <View style={[styles.typingRow, { paddingLeft: Spacing.md + 36 + Spacing.sm }]}>
        <TypingIndicator color={philosopher.color} />
      </View>
    ) : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Philosopher header strip */}
      <View style={[styles.philosopherStrip, { borderBottomColor: philosopher.color + '40' }]}>
        <Text style={styles.philosopherEmoji}>{philosopher.avatar}</Text>
        <View>
          <Text style={[styles.stripName, { color: philosopher.color }]}>{philosopher.nameKo}</Text>
          <Text style={styles.stripEra}>{philosopher.era} · {philosopher.tagline}</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={<ListFooter />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      {/* Input bar */}
      <View
        style={[
          styles.inputBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md },
          { borderTopColor: Colors.border },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="오늘 어떤 고민이 있으신가요?"
          placeholderTextColor={Colors.text.muted}
          multiline
          maxLength={800}
          onSubmitEditing={Platform.OS === 'web' ? handleSend : undefined}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                input.trim() && !isLoading ? philosopher.color : Colors.surfaceElevated,
            },
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.text.secondary} />
          ) : (
            <Text style={styles.sendIcon}>↑</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  philosopherStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
  },
  philosopherEmoji: {
    fontSize: 28,
  },
  stripName: {
    fontSize: Typography.fontSizeMd,
    fontWeight: '700',
  },
  stripEra: {
    fontSize: Typography.fontSizeXs,
    color: Colors.text.muted,
    marginTop: 1,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 22,
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: Typography.fontSizeMd,
    color: Colors.text.primary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

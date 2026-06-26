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
  useWindowDimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ChatBackground from '@/components/ChatBackground';
import { PHILOSOPHERS, WELCOME_MESSAGES, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { Message, Conversation } from '@/types/chat';
import { streamPhilosopherResponse } from '@/services/anthropic';
import { saveConversation } from '@/services/storage';
import { saveKnowledgeEntry, findSimilarEntries } from '@/services/knowledge';
import { generateConversationSummary, saveSummary } from '@/services/summary';

const triggerHaptic = () => {
  if (Platform.OS === 'web') return;
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const PHILOSOPHER_IMAGES: Record<string, any> = {
  socrates: require('@/assets/socrates.png'),
  plato: require('@/assets/plato.png'),
  aristotle: require('@/assets/aristotle.png'),
};

function PhilosopherHeaderAvatar({ id, size }: { id: string; size: number }) {
  const img = PHILOSOPHER_IMAGES[id];
  const philosopher = PHILOSOPHERS[id as PhilosopherId];
  if (img) {
    return <Image source={img} style={{ width: size, height: size }} resizeMode="cover" />;
  }
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', backgroundColor: (philosopher?.color ?? '#888') + '20' }}>
      <Text style={{ fontSize: size * 0.5 }}>{philosopher?.avatar ?? '🏛️'}</Text>
    </View>
  );
}

export default function ChatScreen() {
  const { philosopherId } = useLocalSearchParams<{ philosopherId: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
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

    // 과거 유사 대화 참조 (지식 DB)
    const similarEntries = await findSimilarEntries(id, text, 2);
    const contextHint = similarEntries.length > 0
      ? `\n\n[참고 - 이전 유사 대화]\n` + similarEntries.map(e =>
          `Q: ${e.userQuestion.slice(0, 80)}\nA: ${e.philosopherAnswer.slice(0, 120)}`
        ).join('\n---\n')
      : '';

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

      for await (const chunk of streamPhilosopherResponse(id, history, text + contextHint)) {
        full += chunk;
        const captured = full;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: captured } : m)),
        );
        scrollToBottom();
      }

      setStreamingId(null);
      setIsLoading(false);

      // 지식 DB에 이번 Q&A 자동 저장
      await saveKnowledgeEntry(id, text, full);

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

      // 메시지가 4개 이상(첫 환영 + 2회 이상 대화)이면 요약 생성
      if (finalMessages.length >= 4) {
        const baseUrl = process.env.EXPO_PUBLIC_ANTHROPIC_BASE_URL ?? '';
        const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
        generateConversationSummary(conv, baseUrl, apiKey)
          .then(summary => { if (summary) saveSummary(summary); })
          .catch(() => {});
      }
    } catch (err: any) {
      setStreamingId(null);
      setIsLoading(false);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
      Alert.alert(
        '오류가 발생했습니다',
        err?.message ?? '잠시 후 다시 시도해주세요.',
        [{ text: '확인' }],
      );
      console.error('[Sophia] 채팅 오류:', err);
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
      {/* Philosopher header strip with SVG avatar */}
      <View style={[styles.philosopherStrip, { borderBottomColor: philosopher.color + '50' }]}>
        <View style={[styles.stripAvatarWrapper, { borderColor: philosopher.color }]}>
          <PhilosopherHeaderAvatar id={id} size={48} />
        </View>
        <View style={styles.stripTextBox}>
          <Text style={[styles.stripName, { color: philosopher.color }]}>{philosopher.nameKo}</Text>
          <Text style={styles.stripEra}>{philosopher.era} · {philosopher.tagline}</Text>
        </View>
        <View style={[styles.onlineDot, { backgroundColor: philosopher.color }]} />
      </View>

      {PHILOSOPHER_IMAGES[id] ? (
        <ImageBackground
          source={PHILOSOPHER_IMAGES[id]}
          style={styles.listWrapper}
          imageStyle={styles.listBgImage}
          resizeMode="cover"
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListFooterComponent={<ListFooter />}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </ImageBackground>
      ) : (
        <View style={styles.listWrapper}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListFooterComponent={<ListFooter />}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>
      )}

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
          disableFullscreenUI={true}
          autoCorrect={false}
          autoComplete="off"
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
            <Text style={[styles.sendIcon, { color: input.trim() ? '#fff' : Colors.text.muted }]}>↑</Text>
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
    borderBottomWidth: 1.5,
  },
  stripAvatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
  },
  stripTextBox: {
    flex: 1,
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
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  list: {
    backgroundColor: 'transparent',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listBgImage: {
    opacity: 0.5,
    resizeMode: 'cover',
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
    fontSize: 18,
    fontWeight: '700',
  },
});

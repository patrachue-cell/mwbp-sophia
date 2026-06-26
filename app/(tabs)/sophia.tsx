import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ImageBackground, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { SOPHIA_SYSTEM_PROMPT } from '@/constants/philosophers';
import { saveDailyCheckIn } from '@/services/summary';
import { isPremiumUser, PAYMENT_ENABLED } from '@/services/subscription';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const triggerHaptic = () => {
  if (Platform.OS === 'web') return;
  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
};

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '안녕하세요 ✨ 오늘 하루도 수고하셨어요.\nSophia입니다. 잠시 여기서 마음을 내려놓고 이야기 나눠봐요.\n\n오늘 하루 어떠셨나요?',
  timestamp: Date.now(),
};

// 무료 사용자에게 보여주는 구독 유도 화면
function PremiumGate({ insets }: { insets: ReturnType<typeof useSafeAreaInsets> }) {
  return (
    <View style={[gateStyles.container, { paddingTop: insets.top }]}>
      <View style={[gateStyles.header, { paddingTop: Spacing.sm }]}>
        <View style={gateStyles.headerAvatarWrap}>
          <Image source={require('@/assets/sophia.jpeg')} style={gateStyles.headerAvatar} resizeMode="cover" />
        </View>
        <View>
          <Text style={gateStyles.headerName}>Sophia</Text>
          <Text style={gateStyles.headerSub}>오늘의 멘탈 체크</Text>
        </View>
      </View>

      <View style={gateStyles.body}>
        <View style={gateStyles.lockIcon}>
          <Text style={gateStyles.lockEmoji}>✨</Text>
        </View>
        <Text style={gateStyles.title}>Sophia 프리미엄</Text>
        <Text style={gateStyles.desc}>
          Sophia와 무제한 대화하며{'\n'}마음을 돌보세요.
        </Text>

        <View style={gateStyles.featureList}>
          {[
            '💬 Sophia와 무제한 대화',
            '📊 감정 변화 분석',
            '🗂️ 지혜 카드 저장 & 공유',
            '🔔 매일 맞춤 알림',
          ].map((f, i) => (
            <View key={i} style={gateStyles.featureItem}>
              <Text style={gateStyles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={gateStyles.priceBox}>
          <Text style={gateStyles.priceLabel}>월 구독</Text>
          <Text style={gateStyles.price}>₩4,900</Text>
          <Text style={gateStyles.priceSub}>언제든지 취소 가능</Text>
        </View>

        <TouchableOpacity
          style={gateStyles.subscribeBtn}
          onPress={() => router.push('/payment')}
          activeOpacity={0.85}
        >
          <Text style={gateStyles.subscribeBtnText}>지금 시작하기</Text>
        </TouchableOpacity>

        <Text style={gateStyles.terms}>
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
        </Text>
      </View>
    </View>
  );
}

export default function SophiaScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const baseUrl = process.env.EXPO_PUBLIC_ANTHROPIC_BASE_URL ?? 'http://10.0.2.2:6655/anthropic/';
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

  useEffect(() => {
    isPremiumUser().then(setIsPremium);
  }, []);

  // 결제 화면에서 돌아올 때 구독 상태 재확인 (포커스 기반)
  useEffect(() => {
    const interval = setInterval(() => {
      isPremiumUser().then(setIsPremium);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    triggerHaptic();

    const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now() };
    const assistantId = generateId();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setStreamingId(assistantId);
    setIsLoading(true);
    scrollToBottom();

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .concat(userMsg)
        .map(m => ({ role: m.role, content: m.content }));

      const isAndroid = Platform.OS === 'android';
      const url = isAndroid
        ? `http://10.0.2.2:6655/anthropic/messages`
        : `${baseUrl}messages`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'interleaved-thinking-2025-05-14',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: SOPHIA_SYSTEM_PROMPT,
          messages: history,
          stream: true,
        }),
      });

      if (!res.ok) throw new Error(`API 오류 ${res.status}`);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const raw = line.slice(5).trim();
            if (raw === '[DONE]') break;
            try {
              const evt = JSON.parse(raw);
              const delta = evt?.delta?.text ?? evt?.delta?.thinking ?? '';
              if (delta && evt?.delta?.type === 'text_delta') {
                full += delta;
                const cap = full;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: cap } : m));
                scrollToBottom();
              }
            } catch {}
          }
        }
      }

      setStreamingId(null);
      setIsLoading(false);

      if (full) {
        await saveDailyCheckIn({
          date: getToday(),
          summary: full.slice(0, 200),
          emotion: '성찰',
          createdAt: Date.now(),
        });
      }
    } catch (err: any) {
      setStreamingId(null);
      setIsLoading(false);
      setMessages(prev => prev.filter(m => m.id !== assistantId));
      Alert.alert('오류', err?.message ?? '잠시 후 다시 시도해주세요.', [{ text: '확인' }]);
    }
  }, [input, isLoading, messages]);

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.userRow : styles.assistantRow]}>
        {!isUser && (
          <View style={styles.sophiaAvatar}>
            <Image source={require('@/assets/sophia.jpeg')} style={styles.sophiaAvatarImg} resizeMode="cover" />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          {!isUser && <Text style={styles.sophiaName}>Sophia</Text>}
          <Text style={[styles.msgText, isUser ? styles.userText : styles.assistantText]}>
            {item.content}
            {item.id === streamingId && item.content.length > 0 && (
              <Text style={{ color: Colors.sophia }}>▍</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };

  // 구독 상태 로딩 중
  if (isPremium === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={Colors.sophia} />
      </View>
    );
  }

  // 비구독 사용자 (결제 기능 활성화 시에만)
  if (PAYMENT_ENABLED && !isPremium) {
    return <PremiumGate insets={insets} />;
  }

  // 프리미엄 사용자 — 채팅 화면
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.headerAvatarWrap}>
          <Image source={require('@/assets/sophia.jpeg')} style={styles.headerAvatar} resizeMode="cover" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>Sophia</Text>
          <Text style={styles.headerSub}>오늘의 멘탈 체크</Text>
        </View>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>✨ 프리미엄</Text>
        </View>
      </View>

      <ImageBackground
        source={require('@/assets/sophia.jpeg')}
        style={styles.listWrapper}
        imageStyle={styles.listBg}
        resizeMode="cover"
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading && !streamingId
              ? <View style={styles.loadingRow}><ActivityIndicator color={Colors.sophia} /></View>
              : null
          }
        />
      </ImageBackground>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md }, { borderTopColor: Colors.border }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Sophia에게 마음을 전해보세요..."
          placeholderTextColor={Colors.text.muted}
          multiline
          maxLength={600}
          disableFullscreenUI
          autoCorrect={false}
          onSubmitEditing={Platform.OS === 'web' ? handleSend : undefined}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: input.trim() && !isLoading ? Colors.sophia : Colors.surfaceElevated }]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading
            ? <ActivityIndicator size="small" color={Colors.text.muted} />
            : <Text style={[styles.sendIcon, { color: input.trim() ? '#fff' : Colors.text.muted }]}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1.5, borderBottomColor: Colors.sophia + '50' },
  headerAvatarWrap: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: Colors.sophia },
  headerAvatar: { width: 48, height: 48 },
  headerName: { fontSize: Typography.fontSizeMd, fontWeight: '700', color: Colors.sophia },
  headerSub: { fontSize: Typography.fontSizeXs, color: Colors.text.muted },
  premiumBadge: { backgroundColor: Colors.sophia + '20', borderRadius: 12, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  premiumBadgeText: { fontSize: Typography.fontSizeXs, fontWeight: '700', color: Colors.sophia },
  listWrapper: { flex: 1, backgroundColor: Colors.background },
  listBg: { opacity: 0.5 },
  listContent: { paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  msgRow: { flexDirection: 'row', marginVertical: Spacing.xs, paddingHorizontal: Spacing.md, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  sophiaAvatar: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: Colors.sophia, marginRight: Spacing.sm, marginBottom: 2 },
  sophiaAvatarImg: { width: 36, height: 36 },
  bubble: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2 },
  userBubble: { backgroundColor: Colors.sophia, borderBottomRightRadius: 4 },
  assistantBubble: { backgroundColor: Colors.surface + 'E8', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.sophia + '40', elevation: 2, shadowColor: Colors.sophia, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  sophiaName: { fontSize: Typography.fontSizeXs, fontWeight: '700', color: Colors.sophia, marginBottom: 3 },
  msgText: { fontSize: Typography.fontSizeMd, lineHeight: Typography.lineHeightBody },
  userText: { color: '#fff' },
  assistantText: { color: Colors.text.primary },
  loadingRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, gap: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1 },
  input: { flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: 22, paddingHorizontal: Spacing.md, paddingTop: Platform.OS === 'ios' ? 10 : 8, paddingBottom: Platform.OS === 'ios' ? 10 : 8, fontSize: Typography.fontSizeMd, color: Colors.text.primary, maxHeight: 120, borderWidth: 1, borderColor: Colors.border },
  sendBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontSize: 18, fontWeight: '700' },
});

const gateStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1.5, borderBottomColor: Colors.sophia + '50' },
  headerAvatarWrap: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: Colors.sophia },
  headerAvatar: { width: 48, height: 48 },
  headerName: { fontSize: Typography.fontSizeMd, fontWeight: '700', color: Colors.sophia },
  headerSub: { fontSize: Typography.fontSizeXs, color: Colors.text.muted },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  lockIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.sophia + '20', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  lockEmoji: { fontSize: 36 },
  title: { fontSize: Typography.fontSizeXxl, fontWeight: '800', color: Colors.text.primary, marginBottom: Spacing.sm },
  desc: { fontSize: Typography.fontSizeMd, color: Colors.text.secondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  featureList: { width: '100%', marginBottom: Spacing.lg, gap: Spacing.sm },
  featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  featureText: { fontSize: Typography.fontSizeSm, color: Colors.text.primary, fontWeight: '500' },
  priceBox: { alignItems: 'center', marginBottom: Spacing.lg },
  priceLabel: { fontSize: Typography.fontSizeSm, color: Colors.text.muted, marginBottom: 2 },
  price: { fontSize: 36, fontWeight: '800', color: Colors.sophia },
  priceSub: { fontSize: Typography.fontSizeXs, color: Colors.text.muted, marginTop: 2 },
  subscribeBtn: { width: '100%', backgroundColor: Colors.sophia, borderRadius: 16, paddingVertical: Spacing.md + 2, alignItems: 'center', marginBottom: Spacing.md, elevation: 4, shadowColor: Colors.sophia, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  subscribeBtnText: { fontSize: Typography.fontSizeLg, fontWeight: '800', color: '#fff' },
  terms: { fontSize: Typography.fontSizeXs, color: Colors.text.muted, textAlign: 'center' },
});

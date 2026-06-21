import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhilosopherId } from '@/constants/philosophers';
import { Conversation } from '@/types/chat';

export interface ConversationSummary {
  id: string;
  conversationId: string;
  philosopherId: PhilosopherId;
  date: string;         // "2026-06-21"
  summary: string;      // 3줄 요약
  wisdoms: string[];    // 핵심 지혜 2-3개
  emotion: string;      // 감정 태그
  createdAt: number;
}

const KEY = '@sophia:summaries';

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateId(): string {
  return `sum-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Claude API로 대화 요약 생성
export async function generateConversationSummary(
  conversation: Conversation,
  baseUrl: string,
  apiKey: string,
): Promise<ConversationSummary | null> {
  try {
    const dialogText = conversation.messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => `${m.role === 'user' ? '사용자' : '철학자'}: ${m.content}`)
      .join('\n');

    const prompt = `다음 철학자 대화를 분석해서 JSON으로만 응답하세요. 다른 텍스트 없이 JSON만:

대화:
${dialogText.slice(0, 2000)}

응답 형식:
{
  "summary": "대화 핵심을 2-3문장으로 요약",
  "wisdoms": ["핵심 지혜 문장 1", "핵심 지혜 문장 2"],
  "emotion": "오늘의 감정 한 단어 (예: 불안, 성장, 혼란, 평온, 용기, 슬픔, 희망)"
}`;

    const res = await fetch(`${baseUrl}messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.content?.[0]?.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    const summary: ConversationSummary = {
      id: generateId(),
      conversationId: conversation.id,
      philosopherId: conversation.philosopherId,
      date: getToday(),
      summary: parsed.summary ?? '',
      wisdoms: Array.isArray(parsed.wisdoms) ? parsed.wisdoms : [],
      emotion: parsed.emotion ?? '성찰',
      createdAt: Date.now(),
    };
    return summary;
  } catch {
    return null;
  }
}

export async function saveSummary(summary: ConversationSummary): Promise<void> {
  try {
    const all = await loadAllSummaries();
    // 같은 conversationId 있으면 교체, 없으면 추가
    const filtered = all.filter(s => s.conversationId !== summary.conversationId);
    const updated = [summary, ...filtered];
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export async function loadAllSummaries(): Promise<ConversationSummary[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function loadTodaySummaries(): Promise<ConversationSummary[]> {
  const all = await loadAllSummaries();
  const today = getToday();
  return all.filter(s => s.date === today);
}

// 날짜별 그룹핑
export function groupSummariesByDate(
  summaries: ConversationSummary[],
): Record<string, ConversationSummary[]> {
  const groups: Record<string, ConversationSummary[]> = {};
  for (const s of summaries) {
    if (!groups[s.date]) groups[s.date] = [];
    groups[s.date].push(s);
  }
  return groups;
}

// Sophia 멘탈 체크 저장 (date 기준 덮어쓰기)
const SOPHIA_KEY = '@sophia:daily_checkin';

export interface DailyCheckIn {
  date: string;
  summary: string;
  emotion: string;
  createdAt: number;
}

export async function saveDailyCheckIn(checkin: DailyCheckIn): Promise<void> {
  try {
    const all = await loadAllCheckIns();
    const filtered = all.filter(c => c.date !== checkin.date);
    await AsyncStorage.setItem(SOPHIA_KEY, JSON.stringify([checkin, ...filtered]));
  } catch {}
}

export async function loadAllCheckIns(): Promise<DailyCheckIn[]> {
  try {
    const raw = await AsyncStorage.getItem(SOPHIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

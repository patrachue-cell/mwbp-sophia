import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhilosopherId } from '@/constants/philosophers';

// ──────────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────────

export interface KnowledgeEntry {
  id: string;
  philosopherId: PhilosopherId;
  type: 'wisdom' | 'qa' | 'insight';
  topic: string;           // 주제 태그 (예: "직업", "관계", "불안")
  userQuestion: string;
  philosopherAnswer: string;
  keywords: string[];
  createdAt: number;
  useCount: number;        // 유사 질문 참조 횟수
}

export interface PhilosopherStats {
  philosopherId: PhilosopherId;
  totalConversations: number;
  totalMessages: number;
  topTopics: string[];
  lastUpdated: number;
}

// ──────────────────────────────────────────────
// 스토리지 키
// ──────────────────────────────────────────────

const KEYS = {
  knowledge: (id: PhilosopherId) => `@sophia:knowledge:${id}`,
  stats: (id: PhilosopherId) => `@sophia:stats:${id}`,
  allEntries: '@sophia:knowledge:all',
};

// ──────────────────────────────────────────────
// 키워드 추출 — 질문에서 핵심 주제 자동 감지
// ──────────────────────────────────────────────

const TOPIC_MAP: Record<string, string[]> = {
  '직업/진로': ['직업', '일', '회사', '취업', '진로', '커리어', '직장', '사직', '퇴사', '이직', '업무', '성과'],
  '관계': ['친구', '관계', '사람', '갈등', '싸움', '오해', '소통', '대화', '연인', '부모', '가족'],
  '불안/두려움': ['불안', '두려움', '걱정', '무서', '공포', '긴장', '떨림', '고민', '힘들', '막막'],
  '자아/정체성': ['나', '자신', '정체성', '존재', '의미', '목적', '삶', '인생', '나다움', '자아'],
  '행복/만족': ['행복', '기쁨', '즐거움', '만족', '보람', '충만', '설렘', '좋다'],
  '윤리/도덕': ['옳', '그름', '도덕', '윤리', '가치', '선', '악', '정의', '불의', '양심'],
  '지식/학습': ['배움', '공부', '지식', '이해', '진리', '탐구', '학습', '깨달음'],
  '죽음/시간': ['죽음', '시간', '나이', '노화', '끝', '유한', '순간', '영원'],
};

function extractKeywords(text: string): string[] {
  const found: string[] = [];
  for (const [topic, words] of Object.entries(TOPIC_MAP)) {
    if (words.some(w => text.includes(w))) {
      found.push(topic);
    }
  }
  return found.length > 0 ? found : ['기타'];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ──────────────────────────────────────────────
// 지식 DB 저장
// ──────────────────────────────────────────────

export async function saveKnowledgeEntry(
  philosopherId: PhilosopherId,
  userQuestion: string,
  philosopherAnswer: string,
): Promise<void> {
  try {
    const keywords = extractKeywords(userQuestion + ' ' + philosopherAnswer);
    const topic = keywords[0];

    const entry: KnowledgeEntry = {
      id: generateId(),
      philosopherId,
      type: 'qa',
      topic,
      userQuestion: userQuestion.slice(0, 500),
      philosopherAnswer: philosopherAnswer.slice(0, 1000),
      keywords,
      createdAt: Date.now(),
      useCount: 0,
    };

    // 해당 철학자의 지식 목록에 추가
    const existing = await getKnowledgeEntries(philosopherId);
    const updated = [entry, ...existing].slice(0, 200); // 최대 200개
    await AsyncStorage.setItem(KEYS.knowledge(philosopherId), JSON.stringify(updated));

    // 통계 업데이트
    await updateStats(philosopherId, topic);
  } catch (e) {
    console.warn('[KnowledgeDB] 저장 실패:', e);
  }
}

// ──────────────────────────────────────────────
// 지식 DB 조회
// ──────────────────────────────────────────────

export async function getKnowledgeEntries(
  philosopherId: PhilosopherId,
): Promise<KnowledgeEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.knowledge(philosopherId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 유사 질문 검색 — 채팅 시 과거 답변 참조용
export async function findSimilarEntries(
  philosopherId: PhilosopherId,
  question: string,
  limit = 3,
): Promise<KnowledgeEntry[]> {
  try {
    const entries = await getKnowledgeEntries(philosopherId);
    const keywords = extractKeywords(question);

    const scored = entries
      .map(e => {
        const overlap = e.keywords.filter(k => keywords.includes(k)).length;
        const textMatch = e.userQuestion.split(' ').filter(w =>
          w.length > 1 && question.includes(w),
        ).length;
        return { entry: e, score: overlap * 3 + textMatch };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // 참조 횟수 증가
    if (scored.length > 0) {
      const entries2 = await getKnowledgeEntries(philosopherId);
      const ids = new Set(scored.map(x => x.entry.id));
      const updated = entries2.map(e =>
        ids.has(e.id) ? { ...e, useCount: e.useCount + 1 } : e,
      );
      await AsyncStorage.setItem(KEYS.knowledge(philosopherId), JSON.stringify(updated));
    }

    return scored.map(x => x.entry);
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────
// 통계
// ──────────────────────────────────────────────

async function updateStats(philosopherId: PhilosopherId, topic: string): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.stats(philosopherId));
    const stats: PhilosopherStats = raw
      ? JSON.parse(raw)
      : {
          philosopherId,
          totalConversations: 0,
          totalMessages: 0,
          topTopics: [],
          lastUpdated: Date.now(),
        };

    stats.totalMessages += 1;
    if (!stats.topTopics.includes(topic)) {
      stats.topTopics = [topic, ...stats.topTopics].slice(0, 10);
    }
    stats.lastUpdated = Date.now();

    await AsyncStorage.setItem(KEYS.stats(philosopherId), JSON.stringify(stats));
  } catch {}
}

export async function getStats(philosopherId: PhilosopherId): Promise<PhilosopherStats | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.stats(philosopherId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getAllStats(): Promise<PhilosopherStats[]> {
  const ids: PhilosopherId[] = ['socrates', 'plato', 'aristotle'];
  const results = await Promise.all(ids.map(getStats));
  return results.filter(Boolean) as PhilosopherStats[];
}

// ──────────────────────────────────────────────
// 지식 DB 내보내기 (전체 요약)
// ──────────────────────────────────────────────

export async function exportKnowledgeSummary(philosopherId: PhilosopherId): Promise<string> {
  const entries = await getKnowledgeEntries(philosopherId);
  if (entries.length === 0) return '아직 저장된 대화가 없습니다.';

  const byTopic: Record<string, KnowledgeEntry[]> = {};
  for (const e of entries) {
    if (!byTopic[e.topic]) byTopic[e.topic] = [];
    byTopic[e.topic].push(e);
  }

  const lines: string[] = [`[${philosopherId} 지식 데이터베이스 — 총 ${entries.length}개]\n`];
  for (const [topic, list] of Object.entries(byTopic)) {
    lines.push(`\n▸ ${topic} (${list.length}개)`);
    list.slice(0, 3).forEach(e => {
      lines.push(`  Q: ${e.userQuestion.slice(0, 60)}...`);
    });
  }
  return lines.join('\n');
}

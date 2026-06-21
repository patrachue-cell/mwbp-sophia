# Sophia — 고대 철학자 AI 상담 앱

> **MWBP via IT** 프로젝트  
> 소크라테스, 플라톤, 아리스토텔레스의 철학적 지혜로 일상의 고민을 탐구하는 모바일 앱

---

## 앱 소개

현대인의 일상 고민 — 직업, 관계, 불안, 자아 정체성 — 을 고대 그리스 철학자들의 사유 방식으로 함께 풀어나갑니다. 단순한 답을 주는 것이 아니라, 각 철학자 고유의 방법론으로 사용자 스스로 지혜를 발견하도록 돕습니다.

| 철학자 | 접근법 | 핵심 방법 |
|---|---|---|
| **소크라테스** | 질문을 통한 자기 성찰 유도 | 산파술(마이에우틱스) |
| **플라톤** | 이데아로 현실 너머의 본질 탐구 | 이데아론, 동굴의 비유 |
| **아리스토텔레스** | 현실 속 중용과 실천적 지혜 | 중용(메소테스), 에우다이모니아 |

---

## 주요 기능

### UI/UX
- 밝은 라벤더 라이트 테마
- Pixar풍 철학자 캐릭터 이미지 (홈 카드, 채팅 아이콘)
- 채팅 화면 배경에 철학자 이미지 50% 투명 오버레이
- 철학자 테마 컬러 (소크라테스=황금, 플라톤=파랑, 아리스토텔레스=초록)
- **Sophia** 대여신 캐릭터 (앱 상징)

### AI 채팅
- Anthropic Claude API 실시간 스트리밍 응답
- Hyperspace 프록시 경유 (SAP 내부망)
- 웹 배포 시 서버사이드 `/api/chat` 프록시로 CORS 해결
- 철학자별 상세 시스템 프롬프트 (200~350자 응답, 한국어)

### 지식 데이터베이스
- 매 대화 Q&A 자동 저장 (AsyncStorage)
- 10개 주제 카테고리 자동 태깅
- 다음 질문 시 유사 과거 대화 참조 → 맥락 누적
- 철학자별 대화 통계 및 인기 주제 추적

### 개인 기록 & 성찰 일기 (탭: 기록)
- 철학자와의 대화 완료 후 Claude가 자동으로 3줄 요약 + 핵심 지혜 추출
- 날짜별 대화 기록 타임라인 (감정 태그 포함)
- 지혜 카드 상세 모달 (얻은 지혜 목록 확인)
- 누적 통계: 총 대화 수, 자주 만난 철학자

### Sophia 매일 멘탈 체크 (탭: Sophia)
- 매일 오후 9시 로컬 푸시 알림: "Sophia가 오늘 하루를 물어보고 싶어해요 ✨"
- Sophia 전용 채팅 — 따뜻한 안부 + 멘탈 상태 탐색
- 대화 내용 자동 저장 → 기록 탭에 체크인으로 기록
- 알림 시간 자유 설정 (기록 탭에서 7시~22시 중 선택)

---

## 기술 스택

| 항목 | 기술 |
|---|---|
| 프레임워크 | Expo SDK 52 + Expo Router v4 |
| 언어 | TypeScript |
| UI | React Native, react-native-svg, LinearGradient |
| AI | Anthropic Claude (claude-sonnet / claude-haiku) |
| 스토리지 | AsyncStorage |
| 알림 | expo-notifications (로컬 푸시) |
| 플랫폼 | Android (에뮬레이터) / Web |

---

## 프로젝트 구조

```
MWBP-Sophia/
├── app/
│   ├── _layout.tsx              # 루트 레이아웃 (알림 권한 초기화)
│   ├── index.tsx                # 탭으로 리다이렉트
│   ├── (tabs)/
│   │   ├── _layout.tsx          # 하단 탭 레이아웃 (철학자 | Sophia | 기록)
│   │   ├── index.tsx            # 홈 화면 (Sophia + 철학자 카드)
│   │   ├── sophia.tsx           # Sophia 멘탈 체크 채팅
│   │   └── journal.tsx          # 개인 기록 + 지혜 카드 + 알림 설정
│   ├── chat/
│   │   └── [philosopherId].tsx  # 채팅 화면 (스트리밍 + 지식DB + 요약 트리거)
│   └── api/
│       └── chat+api.ts          # 웹 CORS 서버 프록시
├── components/
│   ├── MessageBubble.tsx        # 메시지 말풍선 (철학자 이미지 아이콘)
│   ├── PhilosopherCard.tsx      # 홈 철학자 선택 카드
│   ├── TypingIndicator.tsx      # 응답 대기 애니메이션
│   ├── ChatBackground.tsx       # 채팅 배경 컴포넌트
│   └── avatars/
│       ├── SocratesAvatar.tsx   # SVG 아바타 (RPG 카드풍)
│       ├── PlatoAvatar.tsx
│       ├── AristotleAvatar.tsx
│       └── SophiaAvatar.tsx
├── assets/
│   ├── socrates.png             # Pixar풍 소크라테스 이미지
│   ├── plato.png                # Pixar풍 플라톤 이미지
│   ├── aristotle.png            # Pixar풍 아리스토텔레스 이미지
│   └── sophia.jpeg              # Sophia 대여신 이미지
├── constants/
│   ├── philosophers.ts          # 철학자 정의 + 시스템 프롬프트 + Sophia 프롬프트
│   └── theme.ts                 # 라이트 테마 컬러/타이포
├── services/
│   ├── anthropic.ts             # Claude API 스트리밍 클라이언트
│   ├── storage.ts               # 대화 기록 저장
│   ├── knowledge.ts             # 지식 데이터베이스
│   ├── summary.ts               # 대화 요약 + 성찰 일기
│   └── notifications.ts         # 로컬 푸시 알림 스케줄링
└── types/
    └── chat.ts                  # Message, Conversation 타입
```

---

## 설치 및 실행

### 사전 요구사항
- Node.js 18+
- Expo Go 앱 (Android/iOS) 또는 Android 에뮬레이터
- SAP Hyperspace MCP 실행 중 (`localhost:6655`)

### 설치

```bash
git clone https://github.com/patrachue-cell/mwbp-sophia.git
cd mwbp-sophia
npm install
```

### 환경 변수

`.env` 파일 생성:

```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-...
EXPO_PUBLIC_ANTHROPIC_BASE_URL=http://192.168.0.104:6655/anthropic/
```

> 에뮬레이터에서 PC를 가리킬 때는 `localhost` 대신 `10.0.2.2` 사용

### 실행

```bash
# 웹 (localhost:8081)
npx expo start --web

# Android 에뮬레이터 (캐시 클리어)
npx expo start --clear

# Expo Go로 직접 연결
npx expo start --go --clear
```

---

## 지식 데이터베이스

대화가 쌓일수록 철학자가 더 깊은 맥락의 조언을 제공합니다.

### 주제 카테고리
`직업/진로` · `관계` · `불안/두려움` · `자아/정체성` · `행복/만족` · `윤리/도덕` · `지식/학습` · `죽음/시간`

### 데이터 구조

```typescript
KnowledgeEntry {
  id: string
  philosopherId: 'socrates' | 'plato' | 'aristotle'
  topic: string           // 자동 분류된 주제
  userQuestion: string
  philosopherAnswer: string
  keywords: string[]
  createdAt: number
  useCount: number        // 유사 질문 참조 횟수
}
```

---

## 개발 이력

| 버전 | 주요 내용 |
|---|---|
| v1.0 | 초기 앱 구조, Claude API 연동, 3명 철학자 기본 채팅 |
| v1.1 | 웹 CORS 해결 (`/api/chat` 프록시), 에뮬레이터 환경 설정 |
| v2.0 | 라이트 테마, Sophia 대여신 캐릭터, SVG 아바타 시스템 |
| v2.1 | RPG 카드풍 SVG 아바타 (황금/파랑/초록 빛 테두리) |
| v2.2 | Pixar풍 실제 이미지 적용 (카드, 채팅 배경, 아이콘) |
| v2.3 | 지식 데이터베이스 (자동 저장, 유사 대화 참조, 통계) |
| v3.0 | 하단 탭 네비게이션, 개인 기록 화면, Sophia 멘탈 체크, 로컬 푸시 알림 |

---

## 라이선스

Internal use — MWBP via IT

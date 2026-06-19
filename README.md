# Sophia — 철학AI 상담 앱 (MWBP via IT)

소크라테스, 플라톤, 아리스토텔레스의 사고방식으로 일상의 고민을 함께 탐구하는 모바일 앱입니다.

## 기술 스택

- **Expo** (SDK 51) + **Expo Router** v3 — 파일 기반 네비게이션
- **React Native** 0.74
- **TypeScript**
- **Anthropic Claude** (claude-sonnet-4-6) — 철학자 페르소나 스트리밍 응답
- **AsyncStorage** — 대화 기록 로컬 저장

## 시작하기

### 1. 의존성 설치

```bash
cd "AI in SAP/MWBP-Sophia"
npm install
```

### 2. Anthropic API 키 설정

[Anthropic Console](https://console.anthropic.com)에서 API 키를 발급받은 후:

```bash
# .env.example을 복사해서 .env 파일 생성
cp .env.example .env
```

`.env` 파일을 열어 API 키를 입력하세요:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-...실제키...
```

### 3. 앱 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

> Expo Go 앱을 스마트폰에 설치하면 QR 코드 스캔으로 바로 실행됩니다.

## 프로젝트 구조

```
MWBP-Sophia/
├── app/
│   ├── _layout.tsx              # 루트 레이아웃 (Stack 네비게이터)
│   ├── index.tsx                # 홈 화면 — 철학자 선택
│   └── chat/
│       └── [philosopherId].tsx  # 채팅 화면 — 스트리밍 대화
├── components/
│   ├── MessageBubble.tsx        # 말풍선 컴포넌트
│   ├── TypingIndicator.tsx      # 응답 대기 애니메이션
│   └── PhilosopherCard.tsx      # 철학자 선택 카드
├── constants/
│   ├── philosophers.ts          # 철학자 정의 + 시스템 프롬프트
│   └── theme.ts                 # 색상·여백·폰트 상수
├── services/
│   ├── anthropic.ts             # Claude API 스트리밍 호출
│   └── storage.ts               # AsyncStorage 대화 저장
└── types/
    └── chat.ts                  # Message, Conversation 타입
```

## 철학자별 특징

| 철학자 | 접근법 | 핵심 기법 |
|--------|--------|-----------|
| 🦉 소크라테스 | 질문을 통한 자기 성찰 유도 | 산파술(마이에우틱스), 문답법 |
| 🏛️ 플라톤 | 이데아로 본질 탐구 | 이데아론, 동굴의 비유, 삼혼설 |
| 🌿 아리스토텔레스 | 현실적 중용과 실천 지혜 | 중용, 에우다이모니아, 프로네시스 |

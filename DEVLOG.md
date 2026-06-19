# Sophia 개발 일지

## 프로젝트 정보
- **프로젝트명:** Sophia (MWBP via IT)
- **목적:** 소크라테스·플라톤·아리스토텔레스의 철학적 사고방식으로 일상의 고민에 답하는 모바일 AI 상담 앱
- **시작일:** 2026-06-19

---

## 2026-06-19 — 프로젝트 초기 구축

### 작업 내용

#### 기술 스택 확정
- **프레임워크:** Expo SDK 51 + Expo Router v3 (파일 기반 라우팅)
- **언어:** TypeScript
- **AI 엔진:** Anthropic Claude (claude-sonnet-4-6) — 스트리밍 응답
- **로컬 저장:** AsyncStorage (대화 기록)
- **UI:** React Native + expo-linear-gradient, expo-haptics

#### 생성 파일 목록

| 파일 | 역할 |
|------|------|
| `app/_layout.tsx` | 루트 Stack 네비게이터, 다크 테마 적용 |
| `app/index.tsx` | 홈 화면 — 철학자 선택 카드, 명언, 사용법 |
| `app/chat/[philosopherId].tsx` | 채팅 화면 — 스트리밍 대화, 에러 처리 |
| `components/MessageBubble.tsx` | 사용자/철학자 말풍선 컴포넌트 |
| `components/PhilosopherCard.tsx` | 철학자 선택 카드 (그라디언트) |
| `components/TypingIndicator.tsx` | 응답 대기 애니메이션 (3-dot bounce) |
| `constants/philosophers.ts` | 철학자 정의 + 시스템 프롬프트 |
| `constants/theme.ts` | 색상·여백·타이포그래피 상수 |
| `services/anthropic.ts` | Claude API 스트리밍 호출 |
| `services/storage.ts` | AsyncStorage 대화 저장/로드 |
| `types/chat.ts` | Message, Conversation 타입 |

#### 철학자별 시스템 프롬프트 설계

**소크라테스 🦉**
- 산파술(마이에우틱스): 직접 답 대신 연속 질문으로 자기 발견 유도
- 무지의 지: 겸손한 태도로 함께 탐구
- 응답 길이: 200~350자

**플라톤 🏛️**
- 이데아론: 현실 문제를 이상(본질) 차원에서 재해석
- 동굴의 비유, 삼혼설(이성·기개·욕망) 활용
- 응답 길이: 200~350자

**아리스토텔레스 🌿**
- 중용(메소테스): 극단 사이 균형점 제시
- 에우다이모니아: 실천 가능한 현실적 조언
- 응답 길이: 200~350자

### 버그 수정
- **`expo-haptics` 웹 호환성 버그:** 웹 환경에서 `Haptics.impactAsync()` 호출 시 `UnavailabilityError` throw → `triggerHaptic()` 래퍼 함수에 `try/catch` 추가로 수정

### 검증 결과 (Playwright 브라우저 테스트)
- ✅ 홈 화면: 철학자 카드 3개, 명언, 사용법 섹션 정상 렌더링
- ✅ 소크라테스 채팅: 웰컴 메시지, 말풍선, 입력창 정상
- ✅ 플라톤 채팅: 파란 계열 테마, 이데아 웰컴 메시지 정상
- ✅ 아리스토텔레스 채팅: 초록 계열 테마, 실천 웰컴 메시지 정상
- ✅ 메시지 전송 → 사용자 말풍선 오른쪽 렌더링 정상
- ✅ API 키 오류 시 Alert → 빈 버블 제거 → 재입력 가능

### 미해결 과제
- [ ] 홈 화면 철학자 카드 웹 클릭 이벤트 전파 문제 (모바일에서는 정상)
- [ ] 존재하지 않는 philosopherId 접근 시 fallback 처리
- [ ] `triggerHaptic`에 `Platform.OS !== 'web'` 가드 추가 (현재 try/catch로 우회)

---

## 실행 방법

```bash
# 의존성 설치
npm install

# .env 파일 생성 후 Anthropic API 키 입력
cp .env.example .env

# 개발 서버 시작
npm start        # Expo Go 앱으로 실제 폰 테스트
npm run web      # 웹 브라우저 테스트
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
```

---

## 향후 계획

- [ ] 대화 기록 목록 화면 추가
- [ ] 철학자 변경 없이 대화 내 관점 전환 기능
- [ ] 오늘의 철학 명언 푸시 알림
- [ ] 다국어 지원 (한국어 우선)
- [ ] 앱 아이콘 및 스플래시 스크린 디자인

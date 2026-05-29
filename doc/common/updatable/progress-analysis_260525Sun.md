# 전체 구현 현황 분석 (260525Sun)

> 기준: todo_260417Fri.md / feature-spec_260330Mon.md / tech-stack_260414Tue.md 대조
> 작성일: 2026-05-25 (Phase 2 말 ~ Phase 3 초입)

---

## 1. 요약 — 현재 어느 단계인가

| 구분 | 총 항목 | 완료 | 미완성/미착수 |
|------|--------|------|-------------|
| Must 기능 (F-01~F-08) | 8 | 7 | 1 (F-08 랜딩 차트) |
| Should 기능 (S-1~S-7) | 7 | 4~5 | 2~3 |
| 백엔드 API (Must 17개) | 17 | ~15 | 2 |
| 프론트 Mock→실연동 교체 | 전체 | 부분 | 과반 미교체 |
| DB (H2 → Supabase) | - | H2 현재 | 미이전 |
| UI/디자인 시스템 | - | 거의 없음 | 전체 미착수 |

**한줄 요약: 기능 로직은 70~80% 완성, 연동/마감 품질은 40~50%**

---

## 2. 프론트엔드 페이지별 구현 현황

### 2-1. 라우팅 / 레이아웃

| 파일 | 상태 | 비고 |
|------|------|------|
| `App.jsx` | ✅ 완성 | 15개 라우트 모두 연결됨 |
| `Layout.jsx` | 🟡 기능만 존재 | Navbar + Footer + Searchbar 구조는 있으나 스타일 없음 |
| `Navbar.jsx` | 🟡 기능만 존재 | 로그인 분기 처리 되어있으나 `Link to="#"` (입양하기, 지도, 통계) 빈링크 3개 |
| `Footer.jsx` | ❓ 미확인 | 컴포넌트 파일만 있음 |
| `Searchbar.jsx` | ❓ 기능 미상 | Layout에 있으나 실제 기능 연결 여부 불명 |

**문제:** Navbar의 "입양하기", "지도", "통계" 링크가 아직 `#`(빈 링크)라 클릭해도 이동 불가.

---

### 2-2. Must 기능 (F-01~F-08)

#### F-01 구조동물 카드 피드 (AnimalFeedPage.jsx) — 🟡 **Mock 미교체**
- 구현 수준: `applyFilter` Array.filter 체이닝 완성, 카드 그리드 UI 구성됨
- **문제: `api/animals.js`가 전부 `/mock/*.json` 호출 중. 실 API로 교체 안 됨**
- `FilterBar`, `AnimalCard` 컴포넌트 연결 완료

#### F-02 다중 조건 필터링 (FilterBar.jsx) — ✅ **거의 완성**
- 시도→시군구→보호소 연쇄 드롭다운 완성
- 300ms debounce 적용됨
- `onlySocialized`, `onlyHealthy` 후처리 필터도 있음

#### F-03 카드 스와이프 UI (AnimalSwipepage.jsx) — 🟠 **Mock 미교체, 실연동 없음**
- framer-motion 기반 스와이프 애니메이션 완성
- LocalStorage 좋아요 저장 로직 있음
- **문제: `/mock/animals.json` 직접 fetch, 실 API 미연동**
- **문제: 하트(좋아요) → `/api/likes` API 연동 안 됨. LocalStorage로만 동작**

#### F-04 동물 상세 + 관심 저장 (AnimalDetailpage.jsx) — 🟡 **실 API 연동됨, 일부 미완**
- `/api/animals/:id` 실제 API 연동 완성
- `AnimalInfoBox`에서 favorites API 연동됨
- **문제: AnimalCard에서 상세 페이지 링크 없음** (카드 클릭 → 상세 이동 구현 필요)

#### F-05 5문항 설문 기반 매칭 (Survey.jsx) — ✅ **완성**
- 5문항 드롭다운 폼 구현 완성
- `buildMatchParams` 변환 로직 + `matchQuiz` API 호출 완성
- `saveSurvey`로 설문 결과 백엔드 저장 완성
- 결과 페이지(MatchResult.jsx)로 navigate 전달 완성

#### F-06 카카오맵 보호소 지도 (ShelterMapPage.jsx) — 🟠 **더미 데이터, 실 API 미연동**
- KakaoMap 컴포넌트 존재, 더미 보호소 마커 렌더링 동작
- **문제: `sheltersDummy.js` 하드코딩 더미, `/api/shelters` 실 API 미연동**
- **문제: Navbar에서 "지도" 링크가 `#`으로 되어있어 진입 불가**

#### F-07 이메일 회원가입/로그인 (Login.jsx, Register.jsx) — 🟡 **실 API 연동, UI 미완**
- 백엔드 AuthController, AuthService, BCrypt 인증 완성
- 프론트 `login()`, `logout()` API 함수 완성
- `AuthContext`로 전역 세션 상태 관리 완성
- **문제: Login.jsx UI가 아무 스타일 없는 bare HTML (`<div><form>...`)**
- **문제: 순수 JS 정규식 유효성 검사가 Register에 있는지 불명확**

#### F-08 랜딩 CountUp + 요약 차트 — 🟠 **이원화 문제 + 미완성**
- **이원화 문제:** 랜딩 역할을 하는 파일이 2개 존재
  - `Home.jsx` (현재 `/` 라우트): 통계 + CountUp + Doughnut 차트 **실 API 연동 완성**
  - `LandingPage.jsx` (현재 `/landing` 라우트): ShowValue + 버튼들, **미완성 상태**
- `ShowValue.jsx`: `setLoading`이 선언되지 않았는데 호출하는 버그 있음
- `ChartData.jsx`: 파일 내용이 `import` 한 줄만 있는 **미완성 파일**
- **결론: F-08은 Home.jsx 버전이 실질적으로 동작 중이나, LandingPage는 미완성**

---

### 2-3. Should 기능 (S-1~S-7)

| ID | 기능 | 상태 | 비고 |
|----|------|------|------|
| S-1 | 상세 통계 차트 | ❌ 미구현 | 페이지/컴포넌트 없음, todo에도 미완으로 표시 |
| S-2 | 분실동물 탭 | 🟡 기능 구현, Mock 미교체 | LostAnimalPage.jsx 완성, F-01 코드 재활용. 단, Mock JSON 의존 |
| S-3 | Gemini AI 1인칭 소개글 | ✅ 백엔드 완성 | GeminiIntroService, GeminiDebugController 구현됨. 프론트 연동은 AnimalInfoTab에서 표시 |
| S-4 | 관심 동물 목록 탭 | ❌ 미구현 | MyPage에 탭 구조는 있으나 favorites 탭 없음, `survey` 탭만 존재 |
| S-5 | 커뮤니티 게시판 | ✅ 거의 완성 | CommunityListPage/DetailPage/FormPage + 댓글 CRUD 완성. posts.js에 Mock/실API 분기 처리 |
| S-6 | 비슷한 아이들 추천 | ❌ 미구현 | 계획만 있음 |
| S-7 | 마이페이지 설문 기록 탭 | ✅ 완성 | MyPage.jsx에 survey 탭 + 설문 기록 조회 완성 |

---

## 3. 백엔드 API 구현 현황

### 구현 완료된 컨트롤러/서비스 목록

| 도메인 | 컨트롤러 | 서비스 | 상태 |
|--------|---------|--------|------|
| 동물 목록/상세 | AnimalController | AnimalService | ✅ JPQL 다중 필터 쿼리 완성 |
| 인증 | AuthController | AuthService | ✅ BCrypt + HttpSession 완성 |
| 지역/보호소 코드 | CodeController | CodeCacheService | ✅ 서버 시작 시 1회 캐싱 완성 |
| 보호소 지도 | ShelterController | ShelterService | ✅ 완성 |
| 관심 동물 | FavoriteController | FavoriteService | ✅ CRUD 완성 |
| 게시글 | PostController | PostService | ✅ CRUD 완성 |
| 댓글 | CommentController | CommentService | ✅ CRUD 완성 |
| 설문 | SurveyController | SurveyService | ✅ 저장/조회 완성 |
| 매칭 | MatchController | (AnimalService 재활용) | ✅ 완성 |
| 통계 | StatsController | StatsService | ✅ summary + chart 완성 |
| 공공 API 동기화 | AdminSyncController | OpenApiSyncService | ✅ 완성 |
| Gemini AI | GeminiDebugController | GeminiIntroService | ✅ 완성 (최근 개선) |

### 엔티티 (domain/)
- `Animal`, `Shelter`, `User`, `Favorite`, `Post`, `Comment`, `SurveyResult`, `RescueStatsCache` — 8개 전부 구현 완성
- `BaseTimeEntity` 상속 구조 있음

### DB 설정 현황
- **현재: H2 파일 모드** (`jdbc:h2:file:./data/petcare`)
- `application.yaml`: `ddl-auto: update`, `sql.init.mode: never`
- `data.sql` 파일 존재 (더미 데이터 INSERT 스크립트)
- **Supabase 이전: 미착수**

---

## 4. 프론트-백 연동 현황 (Mock vs 실API)

### 실 API 연동 완료
- `/api/animals/:id` (상세 조회)
- `/api/likes` (관심 동물 CRUD)
- `/api/auth/*` (로그인/회원가입/로그아웃)
- `/api/match/quiz` (설문 매칭)
- `/api/survey` (설문 저장/조회)
- `/api/stats/summary`, `/api/stats/chart` (통계)
- `/api/posts`, `/api/posts/:id`, `/api/comments/*` (커뮤니티, USE_MOCK 분기)

### Mock JSON 의존 (교체 필요)
| API 함수 | 현재 | 교체 목표 |
|---------|------|----------|
| `fetchAnimals()` | `/mock/animals.json` | `/api/animals` |
| `fetchSido()` | `/mock/codes_sido.json` | `/api/codes/sido` |
| `fetchSigungu()` | `/mock/codes_sigungu.json` | `/api/codes/sigungu` |
| `fetchShelters()` | `/mock/shelters.json` | `/api/codes/shelters` |
| `fetchLostAnimals()` | `/mock/lost_animals.json` | `/api/animals?status=lost` 또는 별도 |
| `ShelterMapPage` | `sheltersDummy.js` 하드코딩 | `/api/shelters` |
| `AnimalSwipepage` | `/mock/animals.json` | `/api/animals` |

---

## 5. 버그 / 이슈 목록

### 크리티컬

| # | 위치 | 내용 |
|---|------|------|
| B-1 | `ShowValue.jsx` L22 | `setLoading(false)` 호출하는데 `setLoading` 선언 없음 → **런타임 에러** |
| B-2 | `ChartData.jsx` | `import` 한 줄만 있는 미완성 파일. import하면 빌드 에러 가능성 |
| B-3 | `Navbar.jsx` | "입양하기", "지도", "통계" 링크가 `to="#"` → UX 단절 |
| B-4 | `AnimalCard.jsx` | 카드 클릭 시 상세 페이지로 이동하는 링크 없음 |

### 중간 우선순위

| # | 위치 | 내용 |
|---|------|------|
| M-1 | `AnimalSwipepage.jsx` | 하트 버튼이 LocalStorage에만 저장. `/api/likes` 미연동 |
| M-2 | `ShelterMapPage.jsx` | 더미 데이터 사용 중, 실 API 미연동 |
| M-3 | `MyPage.jsx` | 'survey' 탭만 있음. S-4 관심 동물 목록 탭(favorites) 미구현 |
| M-4 | `LandingPage.jsx` | `/landing` 경로에 미완성 파일. `/` 홈(Home.jsx)과 역할 혼재 |
| M-5 | `animals.js` API | 동물 피드/분실동물이 전부 Mock JSON 의존 |
| M-6 | `Login.jsx` / `Register.jsx` | UI 스타일 없음 (bare HTML 수준) |

### 낮은 우선순위

| # | 위치 | 내용 |
|---|------|------|
| L-1 | 전체 | `console.log`, `console.error` 영어 메시지 다수 — 교수 감점 포인트 |
| L-2 | 전체 | 인라인 `style={{}}` 사용 다수 (AnimalDetailpage, AnimalSwipepage 등) |
| L-3 | `application.yaml` | `show-sql: true` — 배포/발표 시 off 필요 |

---

## 6. 페이지별 연결 흐름 점검

```
/ (Home)         → 통계 CountUp + Doughnut 차트 ✅ 실연동
/landing         → LandingPage.jsx 미완성 ⚠️
/animals         → 구조동물 피드 🟠 Mock
/animal/:id      → 상세 페이지 ✅ 실연동
/animalswipe/:id → 스와이프 🟠 Mock + LocalStorage
/survey          → 5문항 설문 ✅ 실연동
/match-result    → 설문 결과 ✅ 실연동
/login           → 로그인 ✅ 실연동 (UI 없음)
/register        → 회원가입 ✅ 실연동 (UI 없음)
/map             → 보호소 지도 🟠 더미
/lost-animals    → 분실동물 🟠 Mock
/community       → 커뮤니티 목록 🟡 Mock/실API 분기
/community/:id   → 게시글 상세 🟡 Mock/실API 분기
/community/new   → 글 작성 🟡 Mock/실API 분기
/mypage          → 설문 기록 탭만 ✅ 실연동, favorites 탭 없음
```

---

## 7. 남은 작업 우선순위 (Phase 3 기준)

### 🔴 즉시 해야 할 것 (버그 수정)
1. `ShowValue.jsx` `setLoading` 선언 버그 수정
2. `ChartData.jsx` 미완성 파일 처리 (임시 빈 컴포넌트 or 삭제)
3. `Navbar.jsx` 빈 링크 3개 실제 경로 연결

### 🟠 핵심 연동 작업 (Must 완성 기준)
4. `api/animals.js` → `/api/animals`, `/api/codes/*` 실 API 교체
5. `ShelterMapPage.jsx` → `/api/shelters` 실 API 교체
6. `AnimalSwipepage.jsx` → 실 API 교체 + 하트 버튼 `/api/likes` 연동
7. `AnimalCard.jsx` → 상세 페이지 링크 추가 (`/animal/:id`)
8. `LandingPage.jsx` 역할 정리 (Home.jsx 통합 or 완전 분리)

### 🟡 Should 완성 작업
9. `MyPage.jsx` → S-4 관심 동물 탭 추가 (`/api/likes` 재활용)
10. S-1 상세 통계 페이지 신규 구현 (Chart.js 가로 막대 + 지역별 도넛)
11. Login.jsx / Register.jsx UI 스타일 추가

### 🔵 마감 전 품질 점검
12. 공공 API 응답 실패/빈값 대응 로직 추가
13. CORS 설정 최종 확인
14. console.log 영어 메시지 → 한국어 or 제거
15. 인라인 `style={{}}` → Tailwind 클래스로 교체

---

## 8. 기술스택 적용 현황

| 기술 | 계획 | 현황 |
|------|------|------|
| React + Vite + JSX | ✅ | ✅ 적용 완료 |
| Tailwind CSS v4 | ✅ | 🟡 일부 페이지만 적용 (AnimalFeed, Survey, Community 등) |
| Chart.js (react-chartjs-2) | ✅ | 🟡 Home.jsx Doughnut만 구현, S-1 미구현 |
| CountUp.js (react-countup) | ✅ | 🟡 Home.jsx 에서만 동작, ShowValue 버그 |
| Swiper.js | ✅ | 🟠 미사용? (SwipeCard는 framer-motion 사용) |
| Kakao Maps SDK | ✅ | 🟡 더미 데이터로 마커 렌더링만 |
| Spring Boot 4.0.5 / Java 21 | ✅ | ✅ 완성 |
| JPA + @Query JPQL | ✅ | ✅ 완성 |
| HttpSession 인증 | ✅ | ✅ 완성 |
| H2 → Supabase | 예정 | ❌ H2 단계 유지 중 |
| framer-motion | ❌ 미계획 | 🔵 실제 사용 중 (스와이프 애니메이션) |

> **메모:** Swiper.js가 package.json에 설치됐으나 실제로는 framer-motion으로 스와이프를 구현. Swiper.js 미사용 가능성.

---

## 9. 디자인/스타일 현황 분석

### 현황
- **Tailwind CSS v4**: `@import "tailwindcss"` + `@theme` 토큰 일부 정의됨
- **일관성 없음**: 페이지마다 스타일 방식이 다름
  - Survey, Community, LostAnimal, MyPage → Tailwind 클래스 사용
  - Home.jsx, AnimalDetail, AnimalSwipe → 인라인 `style={{}}` 혼용
  - Login.jsx, LandingPage.jsx → 스타일 거의 없음 (plain HTML)
- **컴포넌트 이중화**: `Navbar.jsx` vs `nav.jsx`, `login.jsx` vs `Login.jsx`, `signup.jsx` vs `Register.jsx` — src/components 안에 중복 파일들이 있음
- **공통 디자인 토큰**: `index.css`의 `@theme`에 accent(보라), text, border 색상만 있고 실제 페이지에서 거의 안 씀
- **반응형**: Layout.jsx에 `min-w-[375px] max-w-[1200px]` 있으나 각 페이지 내부 반응형은 미완

### 다음 섹션(10번)에서 디자인 시스템 도입 여부에 대한 분석 제공

---

## 10. 디자인 시스템 도입 여부 — 판단 근거

### 현재 도입하면 좋은 이유

1. **지금이 타이밍**: 기능 로직이 70~80% 완성된 지금이 레이아웃 잡기 최적 시점. 이 이후에 기능이 추가될수록 스타일을 일괄 적용하기 더 어려워짐
2. **일관성 문제 해결**: 현재 Tailwind 사용/인라인 style/plain HTML이 뒤섞여 있어 교수님 코드 검수 시 감점 요소
3. **공수가 생각보다 안 큼**: "큰 레이아웃 + 배치 + 색상 토큰" 수준이면 `index.css` 토큰 정리 + 공통 컴포넌트(Navbar, Footer, 버튼, 카드) 스타일 고정으로 하루~이틀이면 가능
4. **Mock→실API 교체 작업과 병행 가능**: 연동 교체는 JS 로직이라 디자인 작업과 충돌 없이 병행 가능

### 추천 접근법 (최소 공수)

```
1단계: index.css @theme 토큰 확정
   - 색상: primary(amber/orange 계열 → 따뜻한 펫케어 톤), text, bg, border
   - 폰트: Google Fonts Noto Sans KR (한국어) 적용

2단계: Layout 컴포넌트 정리
   - Layout.jsx: Navbar 상단 고정, main 패딩, footer 구조
   - Navbar.jsx: 로고 + 메뉴 + 인증 버튼 배치, 모바일 햄버거 메뉴 고려

3단계: 공통 컴포넌트 스타일 통일
   - AnimalCard: 카드 hover 효과, 상세 이동 링크
   - 버튼: primary/secondary 스타일 일관화
   - 폼 인풋: Login, Register, Survey 공통 스타일

4단계: 페이지별 스타일 일괄 적용
   - 인라인 style={{}} → Tailwind 클래스로 교체
```

### 결론

**지금 디자인 시스템을 간단하게라도 잡는 것을 권장.**  
단, "디테일한 디자인"이 아니라 **"레이아웃 구조 + 색상 토큰 + 공통 컴포넌트 스타일 통일"** 수준으로만 해도 발표 인상이 크게 달라짐. 디자인에 과도하게 시간 투자하기보다는, 남은 Mock→실API 교체, 버그 수정, S-1/S-4 미구현 기능 완성과 병행하는 것이 전략적으로 맞음.

---

## 11. 중복/정리 필요한 파일

| 중복 파일 | 위치 | 권장 조치 |
|-----------|------|-----------|
| `nav.jsx` vs `Navbar.jsx` | `src/components/` | nav.jsx 삭제 or 통합 |
| `login.jsx` vs `Login.jsx` | `src/components/` vs `src/pages/` | src/components/login.jsx 삭제 |
| `signup.jsx` vs `Register.jsx` | `src/components/` vs `src/pages/` | src/components/signup.jsx 삭제 |
| `cardclide.jsx` (2개) | `src/` + `src/components/` | 중복 파일 정리 |
| `LandingPage.jsx` vs `Home.jsx` | `src/pages/` | 역할 명확히 분리 필요 |

---

## 12. 프로젝트 일정 대비 현재 상태

```
Phase 0 (4/17~5/4) ✅ 완료
Phase 1 (5/5~5/18) ✅ 완료 (Mock 기반 데모 가능 수준)
Phase 2 (5/19~6/1) 🟡 진행 중 (현재 5/25)
  - Must API 연동: 약 60% 완료
  - Mock→실API 교체: 약 40% 완료
Phase 3 (6/2~6/8) 아직 시작 전
```

**현재 5/25 기준으로 Phase 2 기간 중 후반부. 남은 기간 약 2주.**

### 우선순위를 고려한 잔여 작업량 추정

| 작업 | 난이도 | 예상 공수 |
|------|--------|-----------|
| Mock→실API 교체 (animals, codes, shelters) | 低 | 0.5일 |
| AnimalCard 링크 추가 | 低 | 0.5h |
| ShowValue 버그 수정 | 低 | 0.5h |
| Navbar 링크 연결 | 低 | 1h |
| S-4 관심 동물 탭 (MyPage) | 中 | 0.5일 |
| S-1 상세 통계 페이지 | 中 | 1일 |
| 스와이프 하트→API 연동 | 中 | 0.5일 |
| Login/Register UI 스타일 | 低 | 0.5일 |
| 공통 레이아웃/디자인 | 中 | 1~2일 |
| 최종 품질 점검 | 中 | 1일 |

**총합 약 7~10일 분량. 2주 내 충분히 완료 가능하나 우선순위 관리 필요.**

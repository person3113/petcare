# 전체 프로젝트 To-Do 목록 (260417Fri - Updated)

**기준:** 
- `기능명세_260330Mon.md`, `기술스택_260414Tue.md`, `ERD_260331Tue.md`, `API 목록_Must_260330Mon.md`, `통계시각화_260327Fri.md`, `프로젝트 개요 및 교수 성향.md` 종합
- 교수님 평가 기준: UI 완성도(Tailwind 반응형), JavaScript 비중(기능 다수/Array.filter 등 직접 구현), 직접 짠 코드 선호
- 변경 비용 최소화: 핵심 도메인 분리, Mock Data 우선 개발, H2 -> Supabase 점진적 마이그레이션

---

## 📅 주차별 목표 및 마일스톤 (4/17 ~ 6/10)

- **[Phase 0] 시험 기간 (4/17 ~ 5/4): 최소 작업 및 환경 세팅**
  - 프론트/백 초기 세팅 및 **Mock JSON API 스펙 100% 사전 합의 (가장 중요)**
- **[Phase 1] 1~2주차 (5/5 ~ 5/18): 핵심 UI 구현 (Mock) 및 백엔드 기반 설계 병행**
  - 프론트(2명): 백엔드 없이 완벽한 데모가 가능한 상태 구축 (1주차: 로직/레이아웃, 2주차: UI 완성)
  - 백엔드(1명): 엔티티 매핑, JPQL 초안, 인증 로직 등 API 구현을 위한 사전 작업 진행
  - **🚩 2주차 말 체크포인트:** Mock 데이터만으로 프론트엔드 데모 완료 및 백엔드 로컬 DB/엔티티 검증 완료
- **[Phase 2] 3~4주차 (5/19 ~ 6/1): 핵심 백엔드 API 완료 및 프론트-백 연동**
  - 프론트/백엔드: 17개 필수(Must) API 구현 완료 및 실제 데이터 연동 (`/mock/data.json` → `/api/...` 교체)
  - **🚩 4주차 말 체크포인트:** Must API 17개 전체 동작 + 프론트 연동 완료
- **[Phase 3] 5주차 (6/2 ~ 6/8): 고도화 (Should/Optional) 및 최종 품질 점검**
  - 목표: Supabase 이전, Should 기능 순차 구현(완성도 가산점), UI/코드 퀄리티 점검

---

## 📝 상세 To-Do List

### 🛠️ Phase 0: 공통 / 환경 설정 (시험 기간)
- [x] **Git Repository 설정**
  - [x] 모노레포 폴더 구조(`backend/`, `frontend/`) 구성 및 브랜치 룰 설정
- [x] **프로젝트 초기화 (Frontend)**
  - [x] Vite + React + **JavaScript(JSX)** 환경 구성 (TypeScript는 일정상 보류/제외)
  - [x] **Tailwind CSS** 설치 및 설정 (테마, 폰트 위계, 기본 여백 등 세팅)
  - [x] 필수 라이브러리(Chart.js, CountUp.js, Swiper.js) 설치
- [x] **프로젝트 초기화 (Backend)**
  - [x] Spring Boot 4.0.5 + Java 21 + Gradle (Groovy) 생성 및 의존성 추가
  - [x] `application.yml` (H2 로컬) 및 `.env` 파일 구성 (API 키)
- [x] **[핵심] API 통신 스펙 합의 (공공 API 불일치 방어)**
  - [x] Bruno 설치 및 모노레포 내 `bruno/` 폴더 초기화 (팀원 간 API 테스트 이력 Git 공유용)
  - [x] Bruno로 **공공 API(구조동물, 보호소, 통계)를 실제 호출하여 실제 응답 JSON 확인** (명세서 맹신 금지)
  - [x] 지저분한 공공 데이터를 백엔드에서 정제/변환하여 프론트에 내려줄 깔끔한 API 규격 설계
  - [x] 확인한 실제 응답 및 규격에 맞춰 프론트엔드용 Mock JSON 필드 구조 확정 및 합의

### 🎨 Phase 1: Frontend UI 완성 & Backend 사전 작업 (1~2주차)

**[Frontend]**
- [ ] 김은솔) **공통 UI/UX**
  - [ ] Tailwind CSS 반응형 레이아웃 적용 (**모바일 375px 해상도 기준 먼저 설계**)
- [ ] 김은솔) **F-08 랜딩 페이지**
  - [x] 랜딩 상단 KPI 요약 영역 (CountUp.js 적용)
  - [ ] `chart1` 데이터 연동 대비용 도넛 차트 구현 (Chart.js)
- [x] 정성오) **F-01, F-02 구조동물 피드 & 필터링**
  - [x] 다중 조건 필터링 드롭다운 UI (시도/시군구/보호소 연쇄, **300ms debounce 적용**)
  - [x] 프론트엔드 `Array.filter` 체이닝 로직 완벽 구현 (sfeSoci, sfeHealth 등 후처리)
- [ ] 곽선아) **F-03 카드 스와이프 UI**
  - [X] Swiper.js 활용 인터랙션 카드 뷰 구현
-  **F-04, F-06 동물 상세 및 지도**
  - [X] 곽선아) 동물 상세 모달/페이지 및 하트 버튼 (API 연동 전 LocalStorage 임시 처리)
  - [x] 정성오) Kakao Maps SDK 연동 (앱키 발급) 및 더미 보호소 마커 렌더링

- [x] **F-05 설문 기반 매칭 & F-07 인증 폼**
  - [x] 정성오) 5문항 설문 UI 및 응답 데이터 -> 필터 파라미터 변환 JS 작성
  - [x] 김은솔) 회원가입/로그인 폼 UI 및 **순수 JS 정규식 유효성 검사** 로직

**[Backend 병행] Phase 1 기간 내 선행 작업**
- [x] **DB 설계 및 엔티티 구현:** `USERS`, `ANIMALS`, `SHELTERS`, `FAVORITES` 엔티티 클래스 및 Repository 작성
- [x] **인증 로직 뼈대:** BCrypt + `HttpSession` 인증 로직 구조 설계 및 로컬 테스트
- [x] **쿼리 초안:** A-1 구조동물 목록 조회용 JPQL 다중 필터 쿼리 초안 작성
- [x] **DB 설정:** H2 로컬 DB 연결 확인 및 초기 테스트용 더미 데이터 INSERT 스크립트(`data.sql`) 준비

### ⚙️ Phase 2: Backend API 완성 및 프론트 연동 (3~4주차)

- [x] **인증 API 연동 (F-07)**
  - [x] F-1~F-4 회원가입/로그인 등 인증 API 구현 완료
  - [x] 프론트: Mock 데이터 제거 및 실제 회원가입/로그인 통신 교체 (세션 기반)
- [x] **[A, C, D] 구조동물 및 드롭다운/지도 API (F-01,02,06)**
  - [x] A-1 목록 조회 API(JPQL 필터 적용), A-2 단건 상세 API 구현
  - [x] C-1~C-3 지역/보호소 코드 API (**서버 시작 시 1회 캐싱 적용**)
  - [x] D-1 전국 보호소 목록+위경도 API 구현
- [x] **[공공 API 연동] 실제 데이터 호출/동기화**
  - [x] C-1~C-3 코드 캐시를 공공 API로 실제 채우기 (serviceKey 주입 포함)
  - [x] A-3 공공 구조동물 동기화 엔드포인트 구현 (`POST /api/admin/sync`)
  - [x] 보호소 정보 동기화 또는 갱신 로직 정리 (데이터 출처 기준 명확화)
  - [ ] 공공 API 응답 실패/빈값 대응 로직 추가 (재시도/기본값)
- [x] **[B, E, G] 관심동물, 설문, 통계 및 동기화 (F-04,05,08)**
  - [x] B-1~B-3 관심 동물 CRUD API 구현 및 프론트 하트 버튼 실연동
  - [x] E-1 설문 파라미터 -> 동물 목록 쿼리 변환 레이어 (A-1 재활용)
  - [x] G-1, G-2 통계 API 및 프론트 랜딩 차트 실연동
  - [x] 수동 공공 API 동기화 엔드포인트 (`POST /api/admin/sync`) 개발 (페이지네이션 처리 포함)
- [ ] **전역 연동 및 예외 처리**
  - [ ] 모든 Mock JSON fetch를 실제 API 엔드포인트로 교체
  - [ ] CORS 설정 완비 및 API 응답 NULL 예외 핸들링 (프론트/백 공통)

### ✨ Phase 3: 고도화 (Should) 및 코드 품질 점검 (5주차)

- [ ] **Should 기능 고도화 (시간 여유 순으로 우선순위 적용)**
  - [ ] 김은솔) 1순위:  `S-1` 상세 통계 화면 막대그래프 추가
  - [ ] 곽선아) 2순위: `S-4` 관심 동물 목록 탭 (기존 API 재활용, UI만)
  - [x] 정성오) 3순위: `S-2` 분실동물 탭
  - [x] 정성오) 4순위: `S-7` 설문 기록 탭
  - [x] 정성오) 5순위: `S-5` 커뮤니티 게시판 (POSTS, COMMENTS 테이블 CRUD - 공수 가장 큼)
  - [x] 정성오) 6순위: `S-3` Gemini AI 추천 1줄 (API 불안정성 고려 후순위)
- [ ] **최종 점검 및 배포 준비**
  - [ ] 모바일/데스크탑 크로스 브라우징 및 UI 깨짐 꼼꼼히 점검
  - [ ] **교수님 감점 방지용 코드 검수 (AI스러운 코드 수정, 영어 log도 학생이 쓴 듯한 로그로, 인라인 CSS 제거, 폰트/여백 위계 점검)**

---

# 🆕 추가 To-Do (260525Sun — progress-analysis 기반)

> 기존 todo에서 누락됐거나 새로 발견된 버그·미완성 작업 목록  
> 우선순위: 🔴 즉시 → 🟠 핵심 연동 → 🟡 Should 완성 → 🔵 마감 품질

---

## 🔴 즉시 수정 — 버그 / UX 단절

- [x] `ShowValue.jsx` — `setLoading` 미선언 상태로 호출 → **런타임 에러** 수정
- [x] `ChartData.jsx` — `import` 한 줄만 있는 미완성 파일 처리 (빈 컴포넌트 or 파일 삭제)
- [x] `Navbar.jsx` — "입양하기" `to="#"` → `/animals` 경로 연결
- [x] `Navbar.jsx` — "지도" `to="#"` → `/map` 경로 연결
- [x] `Navbar.jsx` — "통계" `to="#"` → 통계 페이지 경로 연결 (S-1 완성 전까지 임시 처리)
- [x] `AnimalCard.jsx` — 카드 클릭 시 `/animal/:id` 상세 페이지로 이동하는 링크 없음 → `<Link>` 감싸기

---

## 🟠 핵심 연동 — Mock JSON → 실 API 교체

- [ ] `api/animals.js` — `fetchAnimals()` → `/api/animals` 실 API 교체
- [ ] `api/animals.js` — `fetchSido()` → `/api/codes/sido` 실 API 교체
- [ ] `api/animals.js` — `fetchSigungu()` → `/api/codes/sigungu` 실 API 교체
- [ ] `api/animals.js` — `fetchShelters()` → `/api/codes/shelters` 실 API 교체
- [ ] `api/animals.js` — `fetchLostAnimals()` → 분실동물 실 API 교체 (엔드포인트 확인 필요)
- [ ] `ShelterMapPage.jsx` — `sheltersDummy.js` 하드코딩 → `/api/shelters` 실 API 교체
- [ ] `AnimalSwipepage.jsx` — `/mock/animals.json` 직접 fetch → `/api/animals` 실 API 교체
- [ ] `AnimalSwipepage.jsx` — 하트(좋아요) 버튼 → LocalStorage 전용에서 `/api/likes` 실 API 연동으로 교체

---

## 🟡 Should 기능 완성

- [ ] `MyPage.jsx` — **S-4 관심 동물 탭** 추가 (`/api/likes` 기존 API 재활용, 탭 UI만 추가)
- [ ] **S-1 상세 통계 페이지** 신규 구현
  - [ ] 페이지/라우트 신규 추가 (`/stats` 등)
  - [ ] `chart1` 기반 가로 막대그래프 (처분 유형별)
  - [ ] `chart2` 기반 도넛 또는 막대그래프 (지역별)
  - [ ] Navbar "통계" 링크를 해당 경로로 연결
- [x] `LandingPage.jsx` vs `Home.jsx` 역할 정리
  - [x] `/` 홈(Home.jsx)을 실질적 랜딩으로 확정하거나, LandingPage를 완성하거나 결정 후 정리
- [ ] **Login.jsx / Register.jsx UI 스타일** 추가 (현재 bare HTML 수준)

---

## 🔵 마감 전 품질 점검

- [x] **중복 파일 정리**
  - [x] `src/components/nav.jsx` 삭제 (Navbar.jsx와 중복)
  - [x] `src/components/login.jsx` 삭제 (pages/Login.jsx와 중복)
  - [x] `src/components/signup.jsx` 삭제 (pages/Register.jsx와 중복)
  - [x] `src/cardclide.jsx` 삭제 (src/components/cardclide.jsx와 중복)
- [x] **인라인 `style={{}}` → Tailwind 클래스 교체**
  - [x] `AnimalDetailpage.jsx` 인라인 style 제거
  - [x] `AnimalSwipepage.jsx` 인라인 style 제거
  - [x] `Home.jsx` 인라인 style 제거
  - [x] `ShelterMapPage.jsx` 인라인 style 제거
- [x] **console.log / console.error 영어 메시지 → 한국어 변경 또는 제거**
  - [x] `AnimalSwipepage.jsx` ("데이터 로딩 실패", "이미 찜한 동물" 등)
  - [x] `AnimalDetailpage.jsx` ("err:데이터로드 실패")
  - [x] 백엔드 로그 메시지 확인 및 정리
- [ ] **공공 API 응답 실패/빈값 대응 로직 추가** (재시도 or 기본값 fallback)
- [ ] **CORS 설정 최종 확인** (배포 환경 도메인 포함)
- [ ] **`application.yaml` `show-sql: true` → 발표 전 false 변경**
- [ ] 모바일(375px) / 데스크탑 크로스 브라우징 최종 확인

---

## 📐 디자인 시스템 (공통 레이아웃/스타일 정비)

- [ ] **`index.css` `@theme` 색상 토큰 확정** (펫케어 톤 — amber/orange 따뜻한 계열 정리)
- [ ] **Google Fonts Noto Sans KR 적용** (한국어 최적화 폰트)
- [ ] **Navbar 스타일 정비** — 로고 자리 + 메뉴 배치 + 인증 버튼 위치
- [ ] **Footer 스타일 정비**
- [ ] **공통 버튼 스타일 통일** (primary / secondary / danger)
- [ ] **공통 폼 인풋 스타일 통일** (Login, Register, Survey 동일 스타일)
- [ ] **AnimalCard hover 효과** 추가 (cursor-pointer + 그림자 강조)


# F-05 설문 기반 매칭 — 설문 UI 개선 & 응답 → 필터 파라미터 변환 JS 워크플로우

> 담당: 정성오  
> 관련 todo: `todo_260417Fri.md` > Phase 1 > F-05  
> 작성일: 2026-05-24 (Sun)

---

## 📋 전체 흐름 요약

```
사용자가 설문 5문항 선택
  → 각 선택값을 JS 변환 함수로 필터 파라미터 객체로 변환
    → matchQuiz(payload) POST 호출 (/api/match/quiz)
      → 응답 데이터 받아 MatchResult 페이지로 navigate
        → MatchResult에서 동물 카드 목록 렌더링
```

---

## 📌 현재 상태 파악 (작업 전)

- `Survey.jsx` — 파일 있음. 단, UI가 인라인 스타일 + 기본 `<select>` 수준으로 미완성
  - 문항: 축종 / 성별 / 중성화 / 지역(텍스트 직접 입력) / 상태 — 총 5문항 구조는 잡혀 있음
  - ⚠️ `uprCd` 항목이 텍스트 `<input>`으로 되어 있음 → `<select>` 드롭다운으로 교체 필요
  - ⚠️ Tailwind 미적용, 인라인 스타일만 사용 → Tailwind 반응형으로 전면 교체 필요
- `MatchResult.jsx` — 파일 있음. 마찬가지로 인라인 스타일, 기능만 있고 UI 미완성
- `frontend/src/api/match.js` — `matchQuiz(payload)` 함수 있음 (POST `/api/match/quiz`)
- `App.jsx` — `/survey` 및 `/match-result` 라우트 이미 연결됨

---

## ✅ Task 목록

### 1단계: 현재 코드 구조 최종 확인

- [x] `Survey.jsx` 전체 코드 읽기 — 폼 필드명(`upkind`, `sexCd`, `neuterYn`, `uprCd`, `state`) 확인
- [x] `match.js` 확인 — payload 형태 및 API 엔드포인트 확인
- [x] `MatchResult.jsx` 확인 — `items`, `pagination` 등 응답 구조 확인
- [x] `App.jsx` 라우트 확인 — `/survey`, `/match-result` 연결 여부 확인 (이미 연결됨)

---

### 2단계: 시도 드롭다운용 Mock 데이터 확인

- [x] `public/mock/codes_sido.json` 존재 확인
  - 이미 `animals.js`에서 `fetchSido()` 함수가 이 파일을 쓰고 있음
  - 필드 형식: `{ code, name }` 배열
- [x] `Survey.jsx` 안에서 `fetchSido()` 로 시도 목록 불러와 `<select>` 옵션으로 렌더링 예정
  - ⚠️ 현재 `uprCd`는 텍스트 `<input>` → `<select>`로 교체해야 함

---

### 3단계: 설문 UI 개선 (Survey.jsx 수정)

> **핵심 목표**: 5개 `<select>` 폼으로 정리 + Tailwind 반응형 스타일 적용

- [x] **인라인 스타일 전부 제거** → Tailwind 클래스로 교체
  - 모바일 375px 기준 우선 설계
  - 전체 컨테이너: `max-w-lg mx-auto px-4 py-6` 등
- [x] **`uprCd` 항목 교체**: 텍스트 `<input>` → `<select>` 드롭다운
  - `useEffect`로 마운트 시 `fetchSido()` 호출해 시도 목록 로드
  - `useState`로 `sidoList` 상태 관리
  - `<option value="">선택 안함</option>` 포함
  - 선택 시 해당 시도 코드(`code`)가 `uprCd` 값으로 들어가야 함
- [x] **5문항 구성 최종 확인**:
  1. 축종 (`upkind`): 개 / 고양이 / 기타 / 선택 안함
  2. 성별 (`sexCd`): 수컷 / 암컷 / 미상 / 선택 안함
  3. 중성화 (`neuterYn`): 예 / 아니오 / 미상 / 선택 안함
  4. 지역 (`uprCd`): 시도 드롭다운 (Mock JSON에서 로드)
  5. 상태 (`state`): 공고중 / 보호중 / 선택 안함
- [x] **로딩/에러 UI 개선**
  - 기존 `{error && <p>...}` 텍스트 → Tailwind 스타일 에러 메시지로 교체
  - 버튼 로딩 중 시각적 피드백 추가 (예: 버튼 비활성화 + 텍스트 변경)
- [x] **코드 내 주석 한국어로 작성** (교수님 감점 방지)

---

### 4단계: 응답 데이터 → 필터 파라미터 변환 JS 작성

> **핵심 목표**: 설문 응답 객체를 API payload로 변환하는 함수를 별도로 분리해서 작성

- [x] `frontend/src/api/match.js` 안에 (또는 신규 `utils/surveyToParams.js`) **`buildMatchParams(form)` 함수 작성**
  - 역할: `form` 상태 객체 → API에 보낼 payload 객체로 변환
  - **빈 값(`''`) 제거**: 선택 안함으로 남긴 필드는 payload에 포함하지 않음
  - `page`, `limit` 고정값 추가 (`page: 1`, `limit: 20`)
  - 예시 코드 뼈대:
    ```js
    // 설문 폼 응답을 API 파라미터 객체로 변환하는 함수
    function buildMatchParams(form) {
      const params = {};

      // 빈 값은 서버에 보내지 않음 (선택 안함 처리)
      if (form.upkind)   params.upkind   = form.upkind;
      if (form.sexCd)    params.sexCd    = form.sexCd;
      if (form.neuterYn) params.neuterYn = form.neuterYn;
      if (form.uprCd)    params.uprCd    = form.uprCd;
      if (form.state)    params.state    = form.state;

      // 페이지네이션 고정값
      params.page  = 1;
      params.limit = 20;

      return params;
    }

    export { buildMatchParams };
    ```
- [x] `Survey.jsx`의 `handleSubmit` 안에서 `buildMatchParams(form)` 호출로 payload 생성
  - 기존: `const payload = { ...form, page: 1, limit: 20 };`
  - 변경 후: `const payload = buildMatchParams(form);`

---

### 5단계: MatchResult.jsx UI 개선

> **핵심 목표**: 결과 카드 목록을 Tailwind 반응형으로 개선

- [x] **인라인 스타일 전부 제거** → Tailwind 클래스로 교체
- [x] 동물 카드 각각을 `AnimalCard.jsx` 컴포넌트 재활용 (이미 존재)
  - `<AnimalCard key={animal.id} animal={animal} />`
  - 단, `AnimalCard`의 props 형식이 맞지 않으면 MatchResult용 인라인 카드로 간단히 처리해도 됨
- [x] 결과 없을 때: `"조건에 맞는 동물이 없습니다."` 텍스트 표시 (기존 로직 유지, 스타일만 개선)
- [x] 페이지네이션 정보 (`totalCount`, `page / totalPages`) 표시 (기존 로직 유지)
- [x] 상단에 "설문 다시하기" 링크 (기존 `<Link to="/survey">` 유지)
- [x] **코드 내 주석 한국어로 작성**

---

### 6단계: Phase 2 연동 대비 확인

- [x] `match.js`의 `matchQuiz`가 POST `/api/match/quiz`를 호출하는 구조 확인
  - Phase 1(Mock): 백엔드 없이 동작 불가 → **Mock 대응 방식 결정 필요**
    - 방법 A: 백엔드 E-1 API가 이미 구현됐으면 그냥 실 API 호출
    - 방법 B: 아직이면 `Survey.jsx` 제출 시 Mock 동물 JSON을 직접 `Array.filter`로 필터링해서 `navigate('/match-result', { state: ... })` 처리
  - ⚠️ **현재 백엔드 E-1이 이미 `[x]` 완료 상태** (todo 기준) → 실 API 호출 가능 여부 먼저 확인
- [x] Phase 2 연동 시 별도 작업 없어도 되도록, `buildMatchParams`의 key 이름이 백엔드 API 스펙과 일치하는지 확인
  - 백엔드 E-1 API 파라미터 스펙: `upkind`, `sexCd`, `neuterYn`, `uprCd`, `state`, `page`, `limit`

---

## 📁 최종 파일 변경 목록

| 상태 | 파일 경로 | 설명 |
|------|-----------|------|
| 🔧 수정 | `frontend/src/pages/Survey.jsx` | 설문 UI Tailwind 개선 + `uprCd` 드롭다운 교체 |
| 🔧 수정 | `frontend/src/pages/MatchResult.jsx` | 결과 UI Tailwind 개선 + AnimalCard 재활용 |
| 🔧 수정 | `frontend/src/api/match.js` | `buildMatchParams(form)` 함수 추가 |
| ❓ 확인 | `public/mock/codes_sido.json` | `uprCd` 드롭다운에 사용할 시도 목록 (이미 존재 예상) |

---

## ⚠️ 주의사항 & 참고

- `uprCd`는 시도 코드 숫자 문자열 (예: `"6110000"`) → `<select>`의 `value`가 이 코드여야 함
- `buildMatchParams`에서 빈 값 필드를 payload에서 제외하는 것이 핵심 — 안 그러면 백엔드가 빈 문자열을 필터 조건으로 잡을 수 있음
- 현재 백엔드 E-1 API(`/api/match/quiz`)는 todo 기준 완료 상태 → 실제 연동 가능한지 백엔드 팀원과 먼저 확인
  - 연동 안 되는 상황이면 Mock 필터링(`Array.filter`) 임시 처리로 진행
- `.env` 관련 작업은 사용자가 직접 처리
- Tailwind 반응형 기준: **모바일 375px 우선**

---

## 🔗 관련 문서

- [todo_260417Fri.md](../../common/updatable/todo_260417Fri.md)
- [tech-stack_260414Tue.md](../../common/updatable/tech-stack_260414Tue.md)
- [AGENTS.md](../../common/constant/AGENTS.md)

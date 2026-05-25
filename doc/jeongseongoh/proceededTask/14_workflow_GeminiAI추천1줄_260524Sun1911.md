# S-3 Gemini AI 추천 1줄 워크플로우

> 담당: 정성오  
> 관련 todo: `todo_260417Fri.md` > Phase 3 > S-3  
> 작성일: 2026-05-24 (Sun)  
> 최종 수정: 2026-05-25 (Sun)

---

## 📋 전체 흐름 요약

```
동물 상세 조회 시 gemini_intro 필드 확인
  → 값이 있고 12자 이상이면 그대로 반환
  → 값이 없거나 12자 미만이면 Gemini API 호출
    → 1줄 자기소개 문장 생성 (15~40자)
      → 유효하면 DB에 gemini_intro 저장
        → 프론트에 1줄 문장 표시
```

---

## 📌 현재 상태 파악 (작업 전)

- [x] `feature-spec_260330Mon.md`에서 S-3 목적 재확인 (AI 활용 1줄 소개)
- [x] `tech-stack_260414Tue.md`에서 Gemini API 호출 위치 확인 (백엔드만 호출)
- [x] 동물 상세 API 경로와 응답 필드 구조 확인 (`gemini_intro` 포함 여부)
- [x] `animals` 테이블에 `gemini_intro` 컬럼 존재 여부 확인
- [x] `.env`에서 Gemini API 키 보관 방식 확인 (없으면 사용자에게 안내)

---

## ✅ Task 목록

### 1단계: DB 컬럼 준비

- [x] `animals` 테이블에 `gemini_intro` 컬럼 추가
  - 타입: `VARCHAR` (JPA `ddl-auto: update`로 자동 생성)
  - `gemini_intro_updated_at` 컬럼도 함께 추가 (최근 생성 시각 기록)

---

### 2단계: Gemini API 호출 유틸 및 프롬프트 작성

- [x] 백엔드에 Gemini 호출 서비스 파일 추가 (`GeminiIntroService.java`)
  - 입력: 동물 기본 정보(종, 성별, 나이, 체중, 색상, 특징, 사회성, 건강상태, 발견 장소)
  - 출력: 한국어 1줄 소개 문장 (15~40자)
  - 실패 시: `null` 반환 → 프론트에서 기본 문구 표시
- [x] 프롬프트 고도화
  - 1인칭 의인화 시점으로 1문장만 요청
  - 성격 후보(발랄함/소심함/애교많음/느긋함/호기심/의젓함/장난꾸러기/수줍음) 중 랜덤 1~2개 반영
  - 종/성격/특징 중 최소 1개 포함 강제
  - 번호나 부연 설명 없이 문장만 출력하도록 명시
- [x] 모델: `gemini-2.5-flash-lite` (`application.yaml`의 `gemini.model` 설정)
- [x] `maxOutputTokens`: 200 (한국어 1문장 충분히 수용)
- [x] 1회 실패 시 `strict=true` 조건으로 자동 재시도 (최대 2회 호출)
- ~~여러 버전 출력 요구: 1회 호출에 3줄 생성 → 후보 저장~~ → **폐기**: 1문장만 요청하는 방식으로 단순화

---

### 3단계: 동물 상세 API에 캐시 로직 추가

- [x] 동물 상세 조회 시 `gemini_intro` 확인
  - 값이 있고 **12자 이상**이면 API 호출 없이 바로 반환
  - 값이 없거나 12자 미만이면 Gemini 호출 (기존에 짧게 저장된 값도 재생성)
- [x] Gemini 결과를 `animals.gemini_intro`에 저장 (12자 이상일 때만)
- [x] 응답 JSON에 `geminiIntro` 필드로 포함

---

### 4단계: 프론트 표시 추가

- [x] 동물 상세 화면(`AnimalInfoBox.jsx`)에 1줄 소개 영역 추가
  - 값이 없을 경우 기본 문구 표시 ("이 아이의 소개글을 준비 중이에요 🐾")
- ~~후보 문장 여러 개 표시~~ → **폐기**: `geminiIntroCandidates` 필드 및 관련 렌더링 전부 제거

---

### 5단계: 에러 및 안정성 처리

- [x] Gemini 호출 실패 시에도 상세 조회는 정상 응답되도록 처리
- [x] 응답 줄 정리: 번호/불릿 prefix 제거 (`cleanupLine()`)
- [x] DB 캐시로 Gemini 호출 횟수 최소화
- [x] API 키 미설정 시 조용히 skip (`warn` 로그만 출력)
- [x] Gemini 503(과부하) 발생 시 모델을 `gemini-2.5-flash-lite`로 대체 운용

---

### 6단계: 동작 확인 (로컬 테스트)

- [x] 동물 상세 조회 첫 호출에서 1줄이 생성되는지 확인
- [x] 두 번째 호출에서 Gemini를 다시 호출하지 않는지 확인 (캐시 확인)
- [x] Gemini API 실패 상황에서도 상세 화면이 깨지지 않는지 확인
- [x] 디버그 엔드포인트(`POST /api/debug/gemini`)로 단독 API 테스트 가능 확인

---

## 📁 최종 파일 변경 목록

| 상태 | 파일 경로 | 설명 |
|------|-----------|------|
| 🆕 추가 | `backend/.../service/GeminiIntroService.java` | Gemini API 호출, 프롬프트 생성, 재시도 로직 |
| 🔧 수정 | `backend/.../service/AnimalService.java` | `ensureGeminiIntro()` 캐시 체크에 12자 조건 추가 |
| 🔧 수정 | `backend/.../web/dto/AnimalDetailResponse.java` | `geminiIntro` 필드 추가, `geminiIntroCandidates` 제거 |
| 🆕 추가 | `backend/.../web/GeminiDebugController.java` | 디버그용 `POST /api/debug/gemini` 엔드포인트 |
| 🆕 추가 | `backend/.../web/dto/GeminiDebugRequest.java` | 디버그 요청 DTO |
| 🆕 추가 | `backend/.../web/dto/GeminiDebugResponse.java` | 디버그 응답 DTO (prompt, intro, 토큰 사용량) |
| 🔧 수정 | `backend/src/main/resources/application.yaml` | `gemini.model`, `gemini.api-key` 설정 추가 |
| 🔧 수정 | `frontend/.../animaldetail/AnimalInfoBox.jsx` | `geminiIntro` 렌더링 추가, candidates 블록 제거 |

---

## ⚠️ 주의사항 & 참고

- Gemini API는 불안정할 수 있으므로 캐시 우선 전략 유지
- `gemini-2.5-flash`가 503 과부하 시 `gemini-2.5-flash-lite`로 모델 변경하여 운용
- 기존 DB에 12자 미만으로 저장된 소개글이 있으면 직접 초기화 필요:
  ```sql
  UPDATE animals SET gemini_intro = NULL WHERE LENGTH(gemini_intro) < 12;
  ```
- `.env` 관련 작업 필요 시 사용자가 직접 처리
- 공공 API/외부 API 실패 시에도 핵심 기능이 중단되지 않게 처리

---

## 🔗 관련 문서

- [todo_260417Fri.md](../../common/updatable/todo_260417Fri.md)
- [feature-spec_260330Mon.md](../../common/updatable/feature-spec_260330Mon.md)
- [tech-stack_260414Tue.md](../../common/updatable/tech-stack_260414Tue.md)
- [AGENTS.md](../../common/constant/AGENTS.md)

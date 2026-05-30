# 17. Mock JSON → 실 API 교체 워크플로우

> 작성일: 2026-05-30 (Sat) 01:06  
> 수정일: 2026-05-30 (Sat) 01:29 — openapi-core-v2.md 반영  
> 담당: 정성오  
> 목표: 프론트엔드 Mock JSON 하드코딩을 모두 실 백엔드 API 호출로 교체

---

## 사전 확인 (코드베이스 현황)

### 백엔드 엔드포인트 현황 (이미 구현됨 ✅)

| 엔드포인트 | 컨트롤러 파일 | 비고 |
|---|---|---|
| `GET /api/animals` | `AnimalController.java` | 쿼리파라미터: upkind, upr_cd, org_cd, state, page, limit |
| `GET /api/animals/{desertionNo}` | `AnimalController.java` | 상세 조회 |
| `GET /api/codes/sido` | `CodeController.java` | 시도 목록 |
| `GET /api/codes/sigungu?uprCd=` | `CodeController.java` | 시군구 목록 |
| `GET /api/codes/shelters?uprCd=&orgCd=` | `CodeController.java` | 보호소 필터 코드 목록 |
| `GET /api/shelters` | `ShelterController.java` | 전체 보호소 목록 (지도용) |
| `GET /api/likes` | `FavoriteController.java` | 찜 목록 조회 (로그인 필요) |
| `POST /api/likes/{desertionNo}` | `FavoriteController.java` | 찜 추가 (로그인 필요) |
| `DELETE /api/likes/{desertionNo}` | `FavoriteController.java` | 찜 삭제 (로그인 필요) |

> ⚠️ **분실동물 전용 백엔드 엔드포인트 없음**  
> 공공API에는 분실동물 전용 서비스(`/lossInfoService`)가 별도 존재함.  
> 구조동물 `/api/animals?state=lost`로는 불가 — 공공API `state` 값은 `notice`/`protect` 뿐, `lost` 없음.  
> → 백엔드에 `/api/lost-animals` 신규 엔드포인트 추가가 필요한지 팀에 확인 필요

### 공공API 주요 응답 필드 구조 (openapi-core-v2.md 기준)

#### 구조동물 `/abandonmentPublic_v2` 응답 핵심 필드
| 필드명 | 설명 |
|---|---|
| `desertionNo` | 유기번호 (PK) |
| `kindFullNm` | 품종명 (예: `[개] 믹스견`) |
| `upKindNm` | 축종명 |
| `age` / `weight` | 나이 / 체중 |
| `popfile1` ~ `popfile8` | 이미지 URL (1~8장) |
| `processState` | 상태 (예: 보호중, 종료) |
| `sexCd` | 성별 (M/F/Q) |
| `neuterYn` | 중성화 여부 (Y/N/U) |
| `careNm` / `careTel` / `careAddr` | 보호소명 / 전화 / 주소 |
| `specialMark` | 특징 |
| `noticeSdt` / `noticeEdt` | 공고 시작/종료일 |

#### 시도/시군구 응답 필드 (공공API 원본 기준)
| API | 응답 필드명 |
|---|---|
| 시도 조회 | `orgCd`(시도코드), `orgdownNm`(시도명) |
| 시군구 조회 | `uprCd`(상위시도코드), `orgCd`(시군구코드), `orgdownNm`(시군구명) |
| 보호소 조회(필터용) | `careRegNo`(보호소번호), `careNm`(보호소명) |

> ⚠️ 백엔드 `CodeResponse` DTO가 위 공공API 필드명을 그대로 내려주는지, 아니면 카멜케이스로 변환해서 내려주는지 확인 필요  
> 예: `orgdownNm` → `orgdownNm` 유지? vs `orgDownNm` 변환?

#### 분실동물 `/lossInfo` 응답 핵심 필드 (구조동물과 다름!)
| 필드명 | 설명 |
|---|---|
| `happenDt` | 분실 일시 (형식: `YYYY-MM-DD HH:mm:ss.S`) |
| `happenAddr` | 분실 장소 |
| `happenAddrDtl` | 분실 장소 상세 |
| `kindCd` | 품종명 |
| `colorCd` | 색상 |
| `sexCd` | 성별 |
| `age` | 나이 |
| `specialMark` | 특징 |
| `popfile` | 이미지 URL (단수, 구조동물과 다름) |
| `callName` / `callTel` | 신고자 이름 / 연락처 |
| `orgNm` | 관할기관명 |

> ⚠️ 구조동물은 이미지 `popfile1~8`(복수), 분실동물은 `popfile`(단수) — 프론트에서 다르게 처리해야 함

#### 보호소 지도용 `/shelterInfo_v2` 응답 핵심 필드
| 필드명 | 설명 |
|---|---|
| `careRegNo` | 보호소번호 |
| `careNm` | 보호소명 |
| `careAddr` | 주소 |
| `careTel` | 전화번호 |
| `lat` / `lng` | 위도 / 경도 |
| `weekOprStime` / `weekOprEtime` | 평일 운영시간 |
| `closeDay` | 휴무일 |
| `saveTrgtAnimal` | 구조대상동물 |

> 백엔드 `ShelterResponse` DTO 필드: `{ id, name, address, tel, lat, lng, weekStartTime, weekEndTime, closedDays, targetAnimals }`  
> → 공공API 필드명과 백엔드 DTO 필드명이 다름 (백엔드에서 이미 변환해서 내려줌) — 프론트는 DTO 필드명 기준으로 작성

### 프론트엔드 현황 (교체 대상)

- `src/api/animals.js` — 전부 `/mock/*.json` 직접 fetch 중
- `src/pages/AnimalSwipepage.jsx` — `fetch('/mock/animals.json')` 직접 사용, 찜은 LocalStorage만 사용
- `src/pages/ShelterMapPage.jsx` — `sheltersDummy.js` import 하드코딩

### 공통 HTTP 클라이언트

- `src/api/http.js` — `request()` 함수 이미 구현됨  
  → 모든 실 API 호출은 이 `request()`를 사용하면 됨  
  → `VITE_API_BASE_URL` 환경변수 또는 기본값 `http://localhost:8080` 사용

---

## Task 목록

### Task A. `api/animals.js` — `fetchAnimals()` 실 API 교체

- [x] **A-1.** `http.js`의 `request()` import 추가
- [x] **A-2.** `fetchAnimals()` 함수 본문을 `request('/api/animals')` 로 교체
  - 현재: `fetch('/mock/animals.json')` → `data?.data?.items` 반환
  - 교체 후: `request('/api/animals')` → 백엔드 `ApiResponse` 래퍼 구조 `{ data: { items: [...] } }` 에 맞춰 `data.data.items` 또는 `data.items` 반환값 확인
  - 필터 파라미터(`upkind`, `upr_cd`, `org_cd`, `state` 등) 필요 시 파라미터 객체 받아서 URLSearchParams로 붙이기
  - > ⚠️ 공공API `state` 값 범위: `notice`(공고중), `protect`(보호중) — `lost`는 없음

---

### Task B. `api/animals.js` — `fetchSido()` 실 API 교체

- [x] **B-1.** `fetchSido()` 함수 본문을 `request('/api/codes/sido')` 로 교체
  - 현재: `fetch('/mock/codes_sido.json')` → `data?.data` 반환
  - 교체 후: 백엔드 응답 구조 확인 후 반환값 맞추기
  - > ⚠️ 응답 필드명 확인 필요: 공공API 원본은 `orgCd`, `orgdownNm` — 백엔드 DTO가 그대로 내려주는지 확인

---

### Task C. `api/animals.js` — `fetchSigungu()` 실 API 교체

- [x] **C-1.** `fetchSigungu(sidoCode)` 함수 본문을 `request('/api/codes/sigungu?uprCd=' + sidoCode)` 로 교체
  - 현재: 전체 목록 fetch 후 프론트에서 `item.sidoCode`로 `filter()` → 비효율
  - 교체 후: 백엔드에서 `uprCd` 파라미터로 필터링된 결과 바로 수신
  - > ⚠️ 기존 프론트 코드의 `item.sidoCode` 필드 → 백엔드 응답 필드명이 `uprCd`인지 다른 이름인지 확인 후 호출 측 코드도 수정 필요
  - > ⚠️ 공공API 원본 응답: `uprCd`(시도코드), `orgCd`(시군구코드), `orgdownNm`(시군구명) — 이 중 백엔드 DTO가 어떤 필드명으로 내려주는지 확인

---

### Task D. `api/animals.js` — `fetchShelters()` 실 API 교체

- [x] **D-1.** `fetchShelters(sigunguCode)` 함수 본문을 `request('/api/codes/shelters?orgCd=' + sigunguCode)` 로 교체
  - 현재: 전체 목록 fetch 후 프론트 `filter()`
  - 교체 후: 백엔드에서 필터링 결과 수신
  - > ⚠️ 이 엔드포인트(`/api/codes/shelters`)는 **필터 드롭다운용** — 응답 필드는 `careRegNo`, `careNm` 정도의 간단한 코드 목록 (지도 마커용 `/api/shelters`와 다름)
  - > ⚠️ `CodeController.java` 기준 파라미터: `uprCd`(시도코드), `orgCd`(시군구코드) — 둘 다 또는 하나만 넘길 수 있음, 호출 측에서 어떤 값을 넘기는지 확인

---

### Task E. `api/animals.js` — `fetchLostAnimals()` 실 API 교체

> 방향 확정: **구조동물과 동일하게 sync-to-DB 방식** 사용  
> 백엔드 개발자가 `POST /api/admin/sync` 방식으로 수동 트리거 → 공공API 데이터를 DB에 저장 → 프론트는 `GET /api/lost-animals` 만 호출

- [x] **E-1.** 백엔드 팀원에게 다음 작업 요청
  - 분실동물 DB 테이블(`lost_animals`) 생성 또는 기존 테이블에 통합 여부 결정
  - 공공API `GET /lossInfoService/lossInfo` 호출해서 DB에 sync하는 로직 추가
  - `GET /api/lost-animals` 엔드포인트 신규 추가
  - `LostAnimalResponse` DTO 정의 (구조동물과 필드가 다름 — 아래 참고)

- [x] **E-2.** 백엔드 엔드포인트 생기면 `fetchLostAnimals()` 교체
  - `fetch('/mock/lost_animals.json')` → `request('/api/lost-animals')` 로 교체
  - > ⚠️ 분실동물 응답 필드는 구조동물과 다름 — `LostAnimalPage.jsx`에서 사용하는 필드명 함께 점검  
  - > ⚠️ 이미지 필드: 구조동물 `popfile1~8`(복수) vs 분실동물 `popfile`(단수)

---

### Task F. `ShelterMapPage.jsx` — `sheltersDummy` → `/api/shelters` 실 API 교체

- [x] **F-1.** `useState`, `useEffect` import 추가
- [x] **F-2.** `sheltersDummy` import 제거
- [x] **F-3.** `shelters` state 선언: `const [shelters, setShelters] = useState([])`
- [x] **F-4.** `useEffect` 안에서 `request('/api/shelters')` 호출 후 결과를 `setShelters()`에 저장
  ```js
  import { request } from '../api/http.js';

  useEffect(() => {
    request('/api/shelters')
      .then((res) => setShelters(res.data || []))
      .catch((err) => console.log('보호소 데이터 로딩 실패', err));
  }, []);
  ```
- [x] **F-5.** `<KakaoMap shelters={shelters} />` 로 props 연결
  - 백엔드 `ShelterResponse` DTO 필드: `{ id, name, address, tel, lat, lng, weekStartTime, weekEndTime, closedDays, targetAnimals }`
  - 더미 데이터는 `{ id, name, lat, lng }` 4개 필드만 있었음
  - > ⚠️ `KakaoMap` 컴포넌트가 `name`, `lat`, `lng` 외 다른 필드를 사용하고 있다면 필드명 맞춰줄 것  
  - > ⚠️ 공공API 원본 `careNm`, `lat`, `lng`을 백엔드가 `name`, `lat`, `lng`으로 이미 변환해서 내려주므로 프론트에서 추가 변환 불필요

---

### Task G. `AnimalSwipepage.jsx` — `/mock/animals.json` → `/api/animals` 실 API 교체

- [x] **G-1.** `fetch('/mock/animals.json')` 직접 호출 부분 제거
- [x] **G-2.** `api/animals.js` 의 `fetchAnimals()` import
- [x] **G-3.** `useEffect` 안에서 `fetchAnimals()` 호출로 교체
  ```js
  useEffect(() => {
      fetchAnimals()
          .then((items) => setAnimals(items))
          .catch((err) => console.log("데이터 로딩 실패", err));
  }, []);
  ```
  - 기존 코드: `mockData.success && mockData.data.items` 체크 → 교체 후 `fetchAnimals()` 자체가 items 배열 반환하므로 불필요
  - > ⚠️ 실 API 응답의 동물 이미지 필드는 `popfile1`~`popfile8` (복수) — 기존 mock에서 쓰던 이미지 필드명이 다를 수 있으니 `SwipeCard.jsx`에서 사용하는 필드명 확인

---

### Task H. `AnimalSwipepage.jsx` — 하트(좋아요) → `/api/likes` 실 API 연동

- [x] **H-1.** 현재 구조 파악
  - `likeAnimal` state: LocalStorage 기반으로 찜한 id 배열 저장/복원
  - `LikeCnt(Id)`: id를 배열에 추가 후 LocalStorage에 저장
  - 찜 기준 id: `desertionNo` (공공API 유기번호, 문자열)
- [x] **H-2.** `api/favorites.js` 의 `addFavorite`, `getFavorites` import
- [x] **H-3.** `LikeCnt(Id)` 함수 내부에 `addFavorite(Id)` API 호출 추가
  - 로그인 필요 API이므로 → 미로그인 시 401 에러 → catch에서 조용히 처리 (또는 로그인 유도 메시지)
  - LocalStorage 업데이트는 API 성공 콜백 안에서 수행 (실패 시 LocalStorage만 변하는 문제 방지)
- [x] **H-4.** 컴포넌트 마운트 시 `getFavorites()` 호출해서 서버의 찜 목록으로 `likeAnimal` 초기값 설정
  - 로그인 안 된 상태면 API 에러 → catch에서 LocalStorage fallback 유지
  - > ⚠️ `getFavorites()` 응답 필드 확인 필요: `FavoriteResponse` DTO에서 `desertionNo` 필드로 내려오는지 확인 (`favorites.js`는 이미 구현되어 있음)
  - > ⚠️ 로그인 여부 확인 방법: `AuthContext` 또는 세션 상태 확인 후 로그인 상태일 때만 API 호출
- [x] **H-5.** 날짜 기반 LocalStorage 초기화 로직 (`liked_date`) 제거 여부 결정
  - API 연동 후에는 서버가 source of truth → LocalStorage는 캐시/fallback 용도만

---

## 작업 순서 권장

```
E (분실동물 방향 확인) — 먼저 팀에 확인, 기다리는 동안 아래 진행

A (fetchAnimals) → G (AnimalSwipePage fetch 교체) → H (하트 API)
B (fetchSido) → C (fetchSigungu) → D (fetchShelters)
F (ShelterMapPage) : 독립적이므로 언제든 가능
```

---

## 주의사항 / 체크포인트

1. **`.env` 파일**: `VITE_API_BASE_URL=http://localhost:8080` 설정 여부 직접 확인  
   (AI가 `.env` 접근/인지 불가)

2. **백엔드 서버 실행 중 여부**: Spring Boot 백엔드가 실행 중인지 확인 후 API 테스트

3. **CORS 설정**: 프론트(`http://localhost:5173`) → 백엔드(`http://localhost:8080`) 호출 시 CORS 허용 여부 확인

4. **로그인 필요 API (`/api/likes`)**: 미로그인 상태에서 하트 클릭 시 401 에러 → 로그인 후 테스트

5. **`state` 파라미터 값 범위**: 공공API 구조동물 `state`는 `notice`(공고중) / `protect`(보호중) 뿐 — `lost` 없음

6. **분실동물 이미지 필드**: 구조동물은 `popfile1`~`popfile8`(복수), 분실동물은 `popfile`(단수) — 각각 다르게 처리

7. **DTO 필드명 vs 공공API 필드명**: 백엔드가 공공API 응답을 자체 DTO로 변환해서 내려주므로, 프론트는 항상 백엔드 DTO 필드명 기준으로 작성

8. **`SwipeCard.jsx` 이미지 필드 확인**: 실 API는 `popfile1`~`popfile8` 복수 — 현재 Swipe 컴포넌트가 어떤 필드명을 참조하는지 교체 전 확인

---

## 완료 기준

- [ ] 브라우저에서 동물 피드(`/animals`) 실 데이터 표시 확인
- [ ] 시도/시군구/보호소 필터 드롭다운이 실 API 데이터로 채워짐 확인
- [ ] 스와이프 페이지(`/swipe`) 실 데이터 카드 표시 확인
- [ ] 스와이프 하트 클릭 시 `/api/likes` POST 요청 네트워크탭에서 확인
- [ ] 보호소 지도 페이지(`/shelter-map`) 실 DB 보호소 마커 표시 확인
- [ ] 분실동물 탭 실 데이터 표시 확인 (엔드포인트 확정 후)

---

## 2026-05-30 로컬 실행 이슈 정리

### 관찰된 증상
1) `/animals` 목록에서 카드당 품종 텍스트가 2번 출력됨 (예: `[개] 믹스견`이 연속 표시)
2) `/lost-animals`에서 총 0건
3) `/match-result` 결과에 종료 상태 동물도 포함되어 다수 표시됨 (조건 미선택 시 전부 노출)

### 원인 추정
- (1) `AnimalCard` 렌더링 구조 또는 데이터 바인딩에서 같은 필드가 두 번 출력될 가능성
  - 카드 UI에서 `kind`를 2번 출력하거나, `shelterName`이 `kind`로 잘못 매핑된 경우
- (2) 분실동물 데이터 sync 미실행 또는 공공API 키 미설정
  - `POST /api/admin/sync?type=lost` 미호출
  - `.env`의 `PUBLIC_DATA_API_KEY` 미설정 또는 잘못된 키
- (3) 설문 결과는 조건 미선택 시 전체 결과를 반환하도록 설계됨
  - `state` 미선택 시 `processState` 필터 없이 전체 조회

### TODO
- [ ] (1) `frontend/src/components/AnimalCard.jsx`와 `/api/animals` 응답을 확인해 중복 표시 원인 파악
  - `AnimalCard`에서 `kind` 출력 위치 1회만 유지
  - `/api/animals` 응답의 `shelterName`이 정상 값인지 확인
- [x] (2) 분실동물 sync 확인
  - `.env`에 `PUBLIC_DATA_API_KEY` 설정 확인
  - `POST /api/admin/sync?type=lost&numOfRows=200` 실행
  - `GET /api/lost-animals` 응답에 데이터 있는지 확인
- [ ] (3) 설문 결과 정책 결정
  - `state` 미선택 시 기본값을 `protect`로 둘지, 전체 노출 유지할지 결정
  - 필요 시 `buildMatchParams()`에 기본 `state` 적용

---

## 2026-05-30 추가 이슈 정리

### 관찰된 증상 (정정)
1) DB `animals`는 7,662건인데 `/animals` 화면에는 20마리만 표시됨
2) `/match-result`는 API는 호출되는 듯 보이나 결과 수가 20마리로 제한된 느낌
3) `lost_animals` 테이블 0건 → `/lost-animals` 0건 표시

### 원인 추정
- (1) `/api/animals`는 기본적으로 페이지네이션이 적용됨
  - 백엔드 `AnimalService.getAnimalList()` 기본 `limit=20`
  - 프론트 `AnimalFeedPage.jsx`는 현재 첫 페이지(20건)만 렌더링
- (2) `/api/match/quiz`는 `buildMatchParams()`에서 `limit=20` 고정
  - `match-result` 페이지는 요청된 20건만 표시
- (3) 분실동물 데이터는 수동 sync 미실행
  - `POST /api/admin/sync?type=lost` 호출 전까지 DB에 저장되지 않음

### TODO
- [x] (1) `/animals` 페이지네이션 처리 방식 결정
  - 결정: 프론트에서 페이지네이션 UI 추가
- [x] (2) 설문 매칭 결과 표시 정책 결정
  - 결정: 설문 결과 페이지에 페이지네이션 UI 추가
- [x] (3) 분실동물 데이터 수동 sync 수행
  - `POST /api/admin/sync?type=lost&numOfRows=200` 실행 후 `GET /api/lost-animals` 확인

### 분실동물 수동 sync 실행 방법 (간단)
1) 백엔드 서버 실행 상태 확인
2) 아래 요청 1회 실행 (기간을 넓게 잡아서 전체 row 확보)
   - 방법 A: Bruno에서 새 Request 생성
     - Method: `POST`
     - URL: `http://localhost:8080/api/admin/sync?type=lost&bgnde=20240101&endde=20261231&numOfRows=200`
     - Body 없음 → Send
   - 방법 B: 터미널에서 cURL 실행
     - `curl -X POST "http://localhost:8080/api/admin/sync?type=lost&bgnde=20240101&endde=20261231&numOfRows=200"`
3) 완료 후 확인
   - `GET http://localhost:8080/api/lost-animals`

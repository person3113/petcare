# 6_workflow_animal-shelter-api-implementation_260517Sun.md

## 1. 개요
- **목표:** 구조동물 목록/상세 조회, 필터용 코드(시도/시군구/보호소) 조회, 그리고 지도용 보호소 목록 API를 구현하여 프론트엔드의 핵심 기능(F-01, F-02, F-06)을 지원한다.
- **주요 작업:**
  - JPQL 필터가 적용된 구조동물 목록 조회 API(A-1) 및 상세 조회 API(A-2) 구현.
  - 서버 시작 시 공공 API로부터 지역 및 보호소 코드를 조회하여 메모리에 캐싱하고, 이를 제공하는 API(C-1~C-3) 구현.
  - 전국 보호소의 위치(위경도) 및 운영 정보를 제공하는 지도용 API(D-1) 구현.
  - 프론트엔드 API 명세(Clean DTO)에 맞춘 응답 구조 설계.

---

## 2. 사전 체크 및 준비 사항
- [x] `AnimalRepository`의 `findAllWithFilters` 메서드 동작 확인 및 페이징 로직 검증.
- [x] `ShelterRepository`의 `findAll` 메서드 동작 확인.
- [x] **환경 변수 설정:**
  - [x] `application.yaml`에 `public-data.service-key: ${PUBLIC_DATA_API_KEY}` 추가 (사용자가 `.env`에 등록한 키 연동).
  - [ ] Spring의 `@Value("${public-data.service-key}")`를 사용하여 API 호출 시 활용.
- [ ] 공공 API 호출을 위한 `ServiceKey` (인코딩/디코딩) 설정 확인.
- [x] 프론트엔드 명세서(`api-spec-frontend_260417Fri.md`)의 필드명과 일치하는 DTO 클래스 준비.

---

## 3. 상세 작업 To-Do

### 3.1. 구조동물 API 구현 (A-1, A-2)
- [x] **DTO 생성 및 데이터 정제 (ERD 기반):**
  - `AnimalResponse`: 목록용 (id, kind, color, age, status, shelterName 등 포함).
    - `dDay`: `noticeEndDate` 기준 D-Day 계산 필드 추가.
  - `AnimalDetailResponse`: 상세용 (socialization, healthStatus 등 상세 필드 및 `isLiked` 포함).
    - `images`: 공공 API의 여러 이미지를 리스트 형식으로 변환 (ERD의 JSON popfiles 컨셉 반영).
    - `shelterInfo`: `Animal.careRegNo`로 조회한 `Shelter` 엔티티 정보를 포함 (소프트 참조 연동).
  - `AnimalSearchRequest`: 검색 파라미터 (upkind, upr_cd, org_cd, state 등).
- [x] **AnimalService 구현:**
  - `getAnimalList`: `AnimalRepository.findAllWithFilters` 호출 및 DTO 변환, 페이징 처리.
  - `getAnimalDetail`: 
    - `AnimalRepository.findById`로 동물 정보 조회.
    - `ShelterRepository.findById`로 연관 보호소 정보 조회 및 결합.
    - 로그인 유저인 경우 `FavoriteRepository.existsBy...`로 관심 여부(`isLiked`) 체크.
- [x] **AnimalController 구현:**
  - `GET /api/animals`: 목록 조회 엔드포인트.
  - `GET /api/animals/{desertionNo}`: 상세 조회 엔드포인트.

### 3.2. 필터 드롭다운용 코드 API 및 캐싱 구현 (C-1 ~ C-3)
- [x] **CodeCacheService 구현:**
  - 서버 시작 시(`@PostConstruct`) 공공 API(시도/시군구/보호소 코드)를 호출하여 `Map` 또는 전용 객체에 저장.
  - 데이터가 변경되지 않으므로 1회 호출 후 메모리 캐시 유지.
- [x] **CodeController 구현:**
  - `GET /api/codes/sido`: 시도 목록 반환.
  - `GET /api/codes/sigungu?uprCd=`: 시군구 목록 반환.
  - `GET /api/codes/shelters?uprCd=&orgCd=`: 보호소 목록 반환.

### 3.3. 보호소 지도 API 구현 (D-1)
- [x] **DTO 생성:**
  - `ShelterResponse`: 지도 마커용 필드 (id, name, address, lat, lng, tel 등).
- [x] **ShelterService 구현:**
  - `getShelterList`: `ShelterRepository.findAll` 호출 및 DTO 변환.
- [x] **ShelterController 구현:**
  - `GET /api/shelters`: 전체 보호소 목록 반환.

### 3.4. 공공 API 연동 To-Do (실제 데이터 호출/동기화)
- [x] **공공 API 요청 공통부 구성:**
  - Base URL: `abandonmentPublicService_v2`(코드/구조동물), `animalShelterSrvc_v2`(보호소 상세)
  - 공통 파라미터: `serviceKey`, `returnType=json`, `numOfRows`, `pageNo`
  - 실패 코드 대응: Unauthorized/Forbidden/Quota/Invalid Parameter
- [x] **C-1~C-3 코드 캐시 실제 연동:**
  - `/sido_v2` → `code/name` 변환 후 캐시
  - `/sigungu_v2`(uprCd) → `code/name/parentCode` 처리
  - `/shelter_v2`(uprCd/orgCd) → 보호소 코드 캐시
- [x] **A-3 구조동물 동기화 엔드포인트:**
  - `POST /api/admin/sync`에서 `/abandonmentPublic_v2` 페이지네이션 동기화
  - 기존 데이터 upsert(동일 `desertion_no` 기준)
  - 이미지 필드(popfile1, popfile2...) → `popfiles` 문자열 저장 규칙 정의
- [x] **보호소 정보 동기화/갱신:**
  - `/shelterInfo_v2`로 위경도/운영정보 보강
  - `care_reg_no` 기준 매칭, 누락 시 기본값 처리
- [ ] **빈값/실패 대응 로직:**
  - 공공 API 응답이 비어 있으면 캐시 유지 또는 빈 배열 반환
  - 호출 실패 시 재시도 1회 + 로깅

---

## 4. 로컬 테스트 및 통합 검증
- [ ] **API 응답 검증:** Bruno를 사용하여 각 API의 응답 필드가 프론트엔드 명세와 일치하는지 확인.
- [ ] **필터링 테스트:** 시도/시군구/축종 등 다양한 조건으로 검색 시 데이터가 정확히 필터링되는지 확인.
- [ ] **캐싱 테스트:** 서버 재시작 시 코드 API가 정상적으로 데이터를 로드하고 응답하는지 확인.
- [ ] **지도 연동 테스트:** 프론트엔드 카카오맵에서 `/api/shelters` 데이터를 받아 마커가 정상적으로 표시되는지 확인.

# Task 4: 쿼리 초안 및 DB 설정 워크플로우

## 🎯 목표
- A-1 구조동물 목록 조회를 위한 다중 필터 JPQL 쿼리 초안 작성
- H2 로컬 DB 연결 검증 및 테스트용 더미 데이터(`data.sql`) 확충

---

## 🧐 현재 상태 파악 (Context)
- [x] **Animal 엔티티:** ERD에 정의된 모든 필드가 `Animal.java`에 구현됨
- [x] **Repository:** `EntityManager`를 직접 사용하는 `AnimalRepository` 기본 구조 생성됨
- [x] **DB 설정:** `application.yaml`에 H2 파일 모드 및 콘솔 설정 완료됨
- [x] **기본 데이터:** `data.sql`에 최소한의 샘플 데이터(1건) 존재

---

## 📝 작업 상세 To-Do

### 1. JPQL 다중 필터 쿼리 초안 작성
- [x] **필터 요구사항 분석:**
  - 축종(`upKindCd`), 시도/시군구(`orgNm` 파싱 또는 검색), 보호소(`careRegNo`), 상태(`processState`) 등
- [x] **AnimalRepository 쿼리 메서드 설계:**
  - `@Query` 또는 동적 쿼리(문자열 조합) 방식 결정 (교수님 성향 고려하여 단순 문자열 조합 JPQL 검토)
- [x] **목록 조회용 쿼리 작성:** `A-1` 요구사항에 맞는 `findAllWithFilters` 메서드 초안 작성
- [x] **페이징 처리:** `setFirstResult`, `setMaxResults`를 이용한 페이징 로직 추가

### 2. DB 설정 및 data.sql 준비
- [ ] **H2 콘솔 접속 확인:** 로컬 서버 실행 후 `/h2-console` 접속 및 테이블 생성 확인
- [x] **더미 데이터 대량 확충 (`data.sql`):**
  - [x] `USERS`: 테스트용 계정 3~5개
  - [x] `SHELTERS`: 서울, 경기, 부산 등 주요 지역 보호소 5~10개
  - [x] `ANIMALS`: 필터링 테스트가 가능하도록 다양한 지역/축종/상태의 동물 데이터 20개 이상 작성
  - [x] `FAVORITES`: 초기 찜 데이터 샘플
- [ ] **인코딩 확인:** `data.sql` 내 한글 데이터 깨짐 여부 확인

---

## 🧪 검증 계획
1. **Repository 테스트:** `findAllWithFilters` 호출 시 필터 조건(예: 경기도 + 개 + 보호중)이 정상 작동하는지 로그로 SQL 확인
2. **데이터 로드 확인:** 서버 재시작 시 `data.sql`이 정상 실행되어 H2 콘솔에서 데이터가 조회되는지 확인
3. **API 명세 일치성:** 작성된 쿼리 결과가 `API 상세명세`의 응답 필드와 일치하는지 대조

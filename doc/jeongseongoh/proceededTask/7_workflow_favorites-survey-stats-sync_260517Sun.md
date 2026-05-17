# [7] 관심동물, 설문, 통계 및 동기화 워크플로우 (F-04, 05, 08)

> 작성일: 260517Sun
> 관련 기능: F-04(관심 동물 저장), F-05(설문 기반 매칭), F-08(랜딩 통계)

## 📌 개요
본 워크플로우는 Phase 2의 후반부 작업인 관심동물(Favorites) CRUD, 설문 매칭(Survey) 쿼리 레이어 작성, 통계(Stats) API 연동, 그리고 공공 API 수동 동기화(Pagination 포함) 엔드포인트 개발 과정을 정의합니다.

---

## 🛠️ 작업 순서 및 To-Do

### 1️⃣ 관심 동물 (Favorites) CRUD API 및 프론트 연동 (B-1 ~ B-3)
- [x] **백엔드: Favorites API 구현**
  - [x] `FavoriteController` 생성 및 `/api/likes` 엔드포인트 구현 (Session 기반)
  - [x] 관심 동물 추가(`POST`) / 삭제(`DELETE`) 기능 구현
  - [x] `FavoriteRepository`를 사용하여 로그인한 유저의 데이터만 처리
- [x] **프론트엔드: 하트 버튼 실연동**
  - [x] 동물 상세 페이지 하트 버튼 클릭 시 API 호출
  - [x] **(단순화)** API 응답을 받은 후 버튼의 색상/상태를 변경하는 직관적인 방식으로 구현
  - [x] 로컬스토리지 임시 코드 제거

### 2️⃣ 설문 기반 매칭 로직 (E-1)
- [x] **백엔드: 매칭 API 구현**
  - [x] `POST /api/match/quiz` 컨트롤러 작성
  - [x] 설문 응답값을 `AnimalSearchRequest` 객체나 파라미터로 단순 매핑
  - [x] 기존 `AnimalService.search()` 등을 재활용하여 결과 반환
- [x] **프론트엔드: 결과 페이지 연동**
  - [x] 설문 완료 후 결과 데이터를 받아 목록 렌더링

### 3️⃣ 통계 API 및 기반 작업 (G-1, G-2)
- [x] **백엔드: 기반 클래스 생성**
  - [x] **(추가)** `RescueStatsCache` 엔티티 클래스 생성 (ERD 참고)
  - [x] **(추가)** `RescueStatsCacheRepository` 인터페이스 생성
- [x] **백엔드: API 구현**
  - [x] `GET /api/stats/summary`, `GET /api/stats/chart` 구현
  - [x] DB에 저장된 캐시 데이터를 조회하여 DTO로 반환
- [x] **프론트엔드: 차트 연동**
  - [x] 랜딩 페이지의 `Chart.js` 등에 실제 DB 데이터 연결

### 4️⃣ 공공 API 수동 동기화 보완 (POST /api/admin/sync)
- [x] **백엔드: 기존 로직 보완**
  - [x] 현재 구현된 `OpenApiSyncService`의 pagination 로직이 정상 작동하는지 재검토
  - [x] **통계 연동:** 동물/보호소 동기화 시 `/rescueAnimalStats` API도 호출하여 통계 테이블 업데이트
  - [x] **중복 처리:** `desertionNo`가 이미 존재하면 `save()` 시 업데이트되도록 하거나, 간단한 존재 여부 체크 로직 추가

---

## ✅ 완료 기준
- [x] 프론트엔드에서 하트 버튼 클릭 시 실제 DB에 관심동물 데이터가 저장/삭제되며 UI에 즉시 반영된다.
- [x] 프론트엔드 설문 완료 후 적절한 조건으로 필터링된 동물 리스트가 정상적으로 노출된다.
- [x] 랜딩 페이지의 카운터와 차트가 `RESCUE_STATS_CACHE` 기반의 실제 데이터로 렌더링된다.
- [x] `POST /api/admin/sync` 호출 시 페이지네이션을 통해 전체 데이터를 누락 없이 동기화한다.

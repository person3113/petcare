# 18. 분실동물 상세 API 워크플로우

> 작성일: 2026-05-30 (Sat) 13:45  
> 목표: `GET /api/lost-animals/{id}` 상세 조회 추가

---

## 원인 요약 (현재 증상 기준)

- [x] 분실동물 목록은 `/api/lost-animals`를 사용하지만
- [x] 상세 페이지는 `/api/animals/{id}`만 조회하고 있어서 ID 매칭이 안 됨
- [x] 백엔드에 분실동물 상세 엔드포인트가 없음

---

## 사전 확인

- [x] `LostAnimalController`는 목록 조회만 존재
- [x] `LostAnimalRepository`에 `findById(Long id)` 존재
- [x] `LostAnimalResponse` DTO 존재 (목록과 동일 구조 사용 가능)

---

## 구현 TODO

- [x] `LostAnimalService`에 상세 조회 메서드 추가
  - [x] `findById(id)`로 조회
  - [x] 없으면 `IllegalArgumentException` 처리
  - [x] 기존 `toResponse()` 재사용
- [x] `LostAnimalController`에 상세 엔드포인트 추가
  - [x] `GET /api/lost-animals/{id}`
  - [x] `ApiResponse`로 감싸서 반환

---

## 프론트 분리 TODO

- [x] 분실동물 상세 라우트 분리
  - [x] `/lost-animals/:id` 경로 신규 추가
  - [x] 기존 `/animal/:id`는 구조동물 전용 유지
- [x] 분실동물 상세 페이지 신규 생성
  - [x] `LostAnimalDetailPage.jsx` 작성
  - [x] `/api/lost-animals/{id}` 호출로 상세 조회
  - [x] 데이터 없는 필드는 기본값 보정
- [x] 분실동물 카드 링크 수정
  - [x] `LostAnimalPage`에서 카드 클릭 시 `/lost-animals/:id` 이동
  - [x] 공용 `AnimalCard`에 `to` props 추가

---

## 확인 TODO

- [ ] `lost_animals` 테이블에 데이터 존재 확인 (필요 시 sync)
- [ ] `GET /api/lost-animals/{id}` 호출로 응답 확인
- [ ] 프론트 상세 페이지에서 `/lost-animals/:id` 연결 여부 점검
- [ ] 로그인 미사용 상태에서도 상세 조회가 가능한지 확인

---

## 영향 파일

- [x] `backend/src/main/java/com/websoftware_26_1/petcare/service/LostAnimalService.java`
- [x] `backend/src/main/java/com/websoftware_26_1/petcare/web/LostAnimalController.java`

---

## 완료 기준

- [ ] 특정 `id`로 상세 조회 시 데이터 반환
- [ ] 존재하지 않는 `id`는 예외 발생 (현재 기본 처리)

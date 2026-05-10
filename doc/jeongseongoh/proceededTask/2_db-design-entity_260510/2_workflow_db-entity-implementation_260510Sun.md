# 2_workflow_db-entity-implementation_260510Sun.md

## 1. 개요
- **목표:** `ERD_260331Tue.md`를 바탕으로 백엔드 핵심 엔티티(`User`, `Animal`, `Shelter`, `Favorite`)와 각 Repository를 구현한다.
- **주요 전략:**
  - 교수님 성향에 맞춰 복잡한 연관관계 매핑보다는 직관적인 필드 매핑과 `@Query`(JPQL)를 활용할 수 있는 구조로 작성한다.
  - ERD에서 명시한 '소프트 참조(Soft Reference)'는 JPA 연관관계 매핑 대신 필드(String/Long)로 직접 선언하여 공공 API 연동의 유연성을 확보한다.
  - Lombok을 활용하여 가독성 좋은 코드를 작성한다.

---

## 2. 사전 체크 및 환경 준비
- [x] `backend/src/main/java/com/websoftware_26_1/petcare` 패키지 구조 확인
- [x] `domain` 및 `repository` 서브 패키지 생성 계획
- [x] `ERD_260331Tue.md`의 컬럼명과 Java CamelCase 매핑 규칙 재확인
- [x] JPA 및 H2 설정 확인 (`application.yaml`)

---

## 3. 상세 작업 To-Do

### 3.1. 엔티티 패키지 및 공통 클래스 구성
- [x] `com.websoftware_26_1.petcare.domain` 패키지 생성
- [x] (선택) `BaseTimeEntity` 생성: `created_at`, `updated_at` 공통 처리 (교수님이 선호하는 기본 기능)

### 3.2. USERS 엔티티 구현
- [x] `User.java` 클래스 작성
  - [x] `id` (BIGINT, PK, Auto Increment)
  - [x] `email`, `passwordHash`, `nickname`, `oauthProvider`, `oauthId` 필드 매핑
  - [x] `@Table(name = "users")` 지정
- [x] `UserRepository.java` 작성 (EntityManager 기반)

### 3.3. SHELTERS 엔티티 구현 (동물보다 먼저 구현 권장)
- [x] `Shelter.java` 클래스 작성
  - [x] `careRegNo` (VARCHAR(30), PK) - 공공 API의 고유 번호를 PK로 사용
  - [x] 위경도(`lat`, `lng`)는 `BigDecimal`로 정밀도 확보
  - [x] 운영 시간 등 모든 필드를 ERD 규격에 맞춰 매핑
- [x] `ShelterRepository.java` 작성

### 3.4. ANIMALS 엔티티 구현
- [x] `Animal.java` 클래스 작성
  - [x] `desertionNo` (VARCHAR(30), PK)
  - [x] `popfiles` 필드 처리: DB는 JSON 타입이나, 초기에는 간단하게 `TEXT`나 `String`으로 저장 후 파싱 고려 (또는 Converter 사용)
  - [x] `careRegNo`: `Shelter`와 직접 연관관계 매핑 대신 `String` 필드로 유지 (ERD의 소프트 참조 준수)
- [x] `AnimalRepository.java` 작성
  - [x] 추후 다중 필터 조회를 위한 JPQL 메서드 위치 확보

### 3.5. FAVORITES 엔티티 구현
- [x] `Favorite.java` 클래스 작성
  - [x] `user_id`는 `@ManyToOne`으로 `User`와 연관관계 설정 (ERD에 FK 명시됨)
  - [x] `desertion_no`는 `String`으로 소프트 참조 유지
- [x] `FavoriteRepository.java` 작성

---

## 4. 검증 및 마무리
- [x] 각 엔티티에 Lombok 어노테이션(`@Getter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`) 적용 확인
- [x] 애플리케이션 실행 시 H2 DB에 테이블이 정상적으로 생성되는지 Hibernate 로그 확인
- [x] `data.sql`을 이용한 초기 더미 데이터 로드 테스트 (Phase 1 병행 작업)

---

## 5. 참고 사항
- **주의:** Spring Security 전체를 쓰지 않고 `BCrypt`만 사용하므로, `User` 엔티티의 비밀번호 필드명은 `passwordHash`로 명확히 함.
- **스타일:** 너무 세련된(Over-engineered) QueryDSL이나 복잡한 JPA 설정보다는, 기본적인 `@Column` 설정 위주로 진행하여 "학생이 직접 짠 코드" 느낌을 유지함.

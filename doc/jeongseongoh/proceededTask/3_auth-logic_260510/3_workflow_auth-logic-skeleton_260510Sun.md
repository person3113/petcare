# 3_workflow_auth-logic-skeleton_260510Sun.md

## 1. 개요
- **목표:** Spring Security 전체 프레임워크를 사용하지 않고, `BCrypt`와 `HttpSession`을 활용하여 직접 회원가입 및 로그인 인증 로직의 뼈대를 구축한다.
- **주요 전략:**
  - **직접 구현(Manual Implementation):** 교수님의 평가 기준에 맞춰 세션 생성, 검증, 무효화 과정을 코드로 직접 구현한다.
  - **보안:** 비밀번호는 반드시 `BCryptPasswordEncoder`를 사용하여 암호화하여 저장한다.
  - **단순성:** 복잡한 필터 체인 대신, 초기에는 Controller 레벨에서 세션을 체크하고 점진적으로 Interceptor를 도입한다.

---

## 2. 사전 체크 및 환경 준비
- [x] `build.gradle`에 `spring-security-crypto` 의존성 확인 (완료)
- [x] `User` 엔티티에 `passwordHash` 필드 존재 여부 확인 (완료)
- [x] `com.websoftware_26_1.petcare.web.dto` 패키지 생성 계획
- [x] `com.websoftware_26_1.petcare.service` 패키지 생성 계획

---

## 3. 상세 작업 To-Do

### 3.1. DTO 클래스 작성
- [x] `UserRegisterRequest`: 회원가입 시 받을 데이터 (email, password, nickname)
- [x] `UserLoginRequest`: 로그인 시 받을 데이터 (email, password)
- [x] `UserResponse`: 인증 성공 후 프론트에 내려줄 최소한의 정보 (id, email, nickname)

### 3.2. 암호화 유틸리티 및 Service 구현
- [x] `BCryptPasswordEncoder` 빈 등록 (Config 클래스 생성)
- [x] `AuthService.java` 작성
  - [x] `register(UserRegisterRequest)`: 중복 이메일 체크 -> 비밀번호 암호화 -> `UserRepository.save()`
  - [x] `login(UserLoginRequest)`: 이메일로 사용자 조회 -> `passwordEncoder.matches()` 검증 -> 성공 시 `User` 객체 반환

### 3.3. Controller 구현 (Session 핸들링)
- [x] `AuthController.java` 작성
  - [x] `POST /api/auth/register`: 회원가입 호출
  - [x] `POST /api/auth/login`: 로그인 성공 시 `HttpSession.setAttribute("LOGIN_USER", userResponse)` 수행
  - [x] `POST /api/auth/logout`: `HttpSession.invalidate()` 호출
  - [x] `GET /api/auth/me`: 현재 세션에 저장된 사용자 정보 반환 (로그인 여부 확인용)

### 3.4. (선택/심화) 인증 인터셉터 도입
- [x] `LoginCheckInterceptor.java`: 특정 API 접근 시 세션 존재 여부를 체크하여 미인증 시 401 에러 반환
- [x] `WebConfig.java`: 인터셉터 등록 및 적용 경로 설정

### 3.5. (선택/심화) 간단한 전역 예외 처리 도입
- [x] `AuthException.java`: 인증 실패, 중복 가입 등 예외 상황을 처리할 최소한의 커스텀 예외 클래스
- [x] `GlobalExceptionHandler.java`: `@RestControllerAdvice`를 사용하여 예외 발생 시 프론트에 `{ "message": "..." }` 형태의 JSON 에러를 반환하는 기본 로직 구현

---

## 4. 로컬 테스트 및 검증
- [x] Bruno를 사용하여 회원가입 테스트
- [x] DB(`H2`)에 비밀번호가 암호화된 문자열로 저장되는지 확인
- [x] 로그인 후 쿠키(`JSESSIONID`)가 생성되는지 확인
- [x] `/api/auth/me` 호출을 통해 세션 유지가 정상적으로 되는지 확인
- [x] 로그아웃 후 세션이 파기되는지 확인

---

## 5. 참고 사항
- **주의:** 세션 유지 시간(`maxInactiveInterval`) 등 기본적인 세션 정책은 `application.yaml`에서 관리한다.

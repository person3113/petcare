# **기술스택**

> version: 260414Tue
>

## **Frontend**

| **영역** | **확정 스택** | **결정 근거** |
| --- | --- | --- |
| 마크업 | HTML5 | 수업 핵심 평가 요소 |
| 스타일 | CSS3 +Tailwind CSS | 교수님 허용 확인. React JSX와 궁합이 좋고, 유틸리티 클래스 방식이라 CSS 지식이 있어야 쓸 수 있음  |
| 인터랙션 | JavaScript (ES6+) | 가장 비중 크게 써야 함, 교수님 최우선 평가 기준 |
| UI 프레임워크 | React.js | 수업 커리큘럼 포함, 라이브러리 가져다 써도 된다고 명시 |
| 타입 | TypeScript (기초) | 교수 커리큘럼 4월 단원 포함,`interface`· 파라미터 타입 정도만 |

**JS 라이브러리 (기능 명세 기반)**:

- `Chart.js`— F-08 통계 차트, S-1 상세 시각화
- `CountUp.js`— F-08 랜딩 숫자 카운터 애니메이션
- `Swiper.js`— F-03 카드 스와이프 UI
- `Kakao Maps JS SDK`— F-06 보호소 지도

---

## **Backend**

| **영역** | **확정 스택** | **결정 근거** |
| --- | --- | --- |
| 프레임워크 | Spring Boot 4.0.5 | 확정 |
| 언어 | Java 21 | 확정 |
| 빌드 도구 | Gradle - Groovy | 일반적인 Java 조합 |
| ORM | JPA (`@Query`JPQL 직접 작성) | 교수님 "Spring Data JPA보다 일반 JPA가 더 열심히 한 것, 점수 차이 있다" |
| 인증/인가 | HttpSession 직접 구현 | Spring Security 학습 비용 대비 점수 효율 낮음 |
| 비밀번호 해시 | `spring-security-crypto`단독 추가 | Spring Security 전체 없이 BCrypt만 분리 사용 |
| 공공 API 동기화 | 수동 트리거 방식 (`POST /api/admin/sync`) | 스케줄러 불필요, 발표 전날 1회 실행으로 충분 |
| QueryDSL | ❌ 미사용 | 이 프로젝트 DB 복잡도에서 불필요 |
| Spring Security | ❌ 미사용 | 시간 낭비, HttpSession으로 대체 |

---

## **Database**

**전략: 개발 초기 H2 파일 모드 → Supabase PostgreSQL로 이전 (DB 호스팅만 사용)**

| **단계** | **DB** | **이유** |
| --- | --- | --- |
| 개발 초기 (1인 작업) | H2 파일 모드 | 설정 0초, 재시작해도 데이터 유지 |
| 팀 공동 개발 시작부터 | Supabase PostgreSQL (호스팅만) | 팀원 모두 같은 DB 접근, 프론트 테스트 가능 |

> **⚠️Supabase 사용 원칙: DB 저장소로만 사용. Supabase JS SDK 프론트 직접 호출 금지. Spring Boot가 JDBC/JPA로만 접근**
>

> **⚠️Supabase Auth 미사용: Auth까지 맡기면 "Spring이 한 게 없다"로 읽힐 위험**
>

---

## **Spring Initializr 세팅**

`Project   : Gradle - Groovy
Language  : Java
Spring Boot : 4.0.5
Java      : 21
Packaging : Jar`

| **의존성** | **용도** | **필수 여부** |
| --- | --- | --- |
| `Spring Web` | REST Controller, HTTP 요청 처리 | ✅ 필수 |
| `Spring Data JPA` | `@Query`로 JPQL 직접 작성용 | ✅ 필수 |
| `H2 Database` | 초기 로컬 개발용 | ✅ 필수 |
| `PostgreSQL Driver` | Supabase 연결 시 | ✅ 필수 |
| `Lombok` | `@Getter``@Builder`등 코드 단축 | ✅ 필수 |
| `Validation` | 회원가입`@NotBlank``@Email`검증 | ✅ 필수 |
| `Spring Boot DevTools` | 코드 수정 시 자동 재시작 | ✅ 필수 |
| `spring-security-crypto` | BCrypt 해시만 (build.gradle 수동 추가) | ✅ 필수 |
| `Spring Security` | ❌ 추가하지 말 것 | ❌ 제외 |
| `QueryDSL` | ❌ 불필요 | ❌ 제외 |

---

## **개발 환경 & 협업**

| **항목** | **선택** | **이유** |
| --- | --- | --- |
| GitHub 구조 | 모노레포 (`backend/``frontend/`폴더 분리) | 소규모 팀, PR 하나에 프론트·백 동시 반영 가능 |
| 브랜치 전략 | `main`→`dev`→`feature/기능명` | 기존 합의 유지 |
| API 설계 문서 | Notion에 REST API 명세 선작성 | 프론트·백 분리 개발 가능, 병목 방지 |
| 환경변수 | `application.properties`+`.env` | API key, DB URL은 Git에 올리지 않음 |

---

## **전체 아키텍처 흐름**

```
[사용자 브라우저]
     │
     ▼
[React.js + TypeScript (Vite)]
  - HTML/CSS/JS/Tailwind CSS
  - Chart.js / Swiper.js / CountUp.js
  - Kakao Maps SDK
     │
     │ REST API 호출 (CORS 설정 필요)
     ▼
[Spring Boot 4.0.5 / Java 21]
  - Controller → Service → Repository
  - JPA + @Query JPQL 직접 작성
  - HttpSession 인증
  - 공공 API 호출 (농림부, 관광공사) ← 백엔드에서만
  - 수동 동기화 트리거 POST /api/admin/sync
  - Gemini API 호출 (S-3, DB에 없을 때만)
     │
     ▼
[Supabase PostgreSQL]
  - animals (전체 구조동물 + gemini_intro 캐시)
  - shelters (보호소 위경도 + 운영정보)
  - users / favorites / survey_results / rescue_stats_cache
```

---

## **❌ 의도적으로 제외한 것들**

- **Spring Security**— 세션 직접 구현으로 대체, 시간 절약
- **QueryDSL**— JPQL`@Query`로 충분
- **Supabase Auth / JS SDK**— 교수님 평가 리스크
- **`@Scheduled`자동 동기화**— 수동 트리거로 단순화, 발표 전날 1회 실행으로 충분
- **WebSocket (실시간 채팅)**— 구현 대비 점수 효율 낮음
- **관리자 대시보드**— 교수님 "복잡한 DB 굳이 필요없다"
- **소셜 로그인 OAuth2**— Optional 중에서도 낮은 우선순위
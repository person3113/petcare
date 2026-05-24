# [S-5] 커뮤니티 게시판 (POSTS, COMMENTS 테이블 CRUD) 워크플로우

**담당자:** 정성오
**목표:** 단순 게시글/댓글 CRUD 기능 구현을 통해 JavaScript 비중 향상 및 시각적 기능 확장 어필 (인기글, 프로필 등 복잡한 기능 제외)

---

## 1. 사전 준비 및 DB/엔티티 설계 (Backend)
- [x] `POSTS` 테이블(엔티티) 설계 및 생성
  - [x] 필드: id, title, content, category('adoption_review' 또는 'lost_sighting'), user_id(작성자), created_at, updated_at
  - [x] 연관관계: User (1:N) Post
- [x] `COMMENTS` 테이블(엔티티) 설계 및 생성
  - [x] 필드: id, content, post_id, user_id(작성자), created_at, updated_at
  - [x] 연관관계: Post (1:N) Comment, User (1:N) Comment
- [x] JPA Repository 세팅
  - [x] `PostRepository` 생성 및 `@Query` 활용 카테고리별 목록 조회 메서드 구현
  - [x] `CommentRepository` 생성 및 특정 게시글의 댓글 조회 메서드 구현

## 2. API 엔드포인트 구현 (Backend)
- [x] 게시판 (Posts) CRUD API 구현
  - [x] `GET /api/posts` : 게시글 목록 조회 (카테고리 탭 연동을 위한 조건부 조회)
  - [x] `GET /api/posts/{id}` : 단건 게시글 상세 조회
  - [x] `POST /api/posts` : 게시글 작성 (HttpSession을 통한 인증 확인 필수)
  - [x] `PUT /api/posts/{id}` : 게시글 수정 (작성자 본인 검증)
  - [x] `DELETE /api/posts/{id}` : 게시글 삭제 (작성자 본인 검증)
- [x] 댓글 (Comments) CRUD API 구현
  - [x] `GET /api/posts/{id}/comments` : 특정 게시물에 달린 댓글 리스트 조회
  - [x] `POST /api/posts/{id}/comments` : 댓글 작성 (HttpSession 인증)
  - [x] `PUT /api/comments/{id}` : 댓글 수정
  - [x] `DELETE /api/comments/{id}` : 댓글 삭제

## 3. 화면 UI 및 기본 로직 구현 (Frontend)
- [x] Mock JSON 구조 사전 확정
  - [x] 백엔드 연동 전 프론트엔드 단독 UI 작업을 위해 게시글/댓글 Mock Data 스펙 협의 및 세팅
- [x] 커뮤니티 게시글 목록 뷰 구현
  - [x] '입양후기', '분실목격' 카테고리 필터링 탭 마크업 및 JS 로직 연결
  - [x] Tailwind CSS를 활용한 반응형 게시글 목록 리스트 UI 작업
- [x] 게시글 상세 및 댓글 뷰 구현
  - [x] 본문 내용 렌더링 영역 구성
  - [x] 하단 댓글 리스트 출력 및 댓글 입력 폼 UI 구현
- [x] 게시글 작성/수정 폼 뷰 구현
  - [x] 제목, 내용, 카테고리 선택 영역 구성
  - [x] 순수 JS 기반 유효성 검사 (제목, 내용 빈값 방지 등) 구현

## 4. API 연동 및 통합 테스트 (Integration)
- [x] 프론트엔드 - 백엔드 API 연동
  - [x] 내장 Fetch API를 통해 게시글 리스트 불러오기 연동 (외부 라이브러리 Axios 등 배제)
  - [x] 작성, 수정, 삭제 요청 및 처리 결과에 따른 UI 업데이트 (Alert 또는 리다이렉트) 연동
- [x] 권한 및 세션 테스트
  - [x] 비로그인 시 글/댓글 작성 제한 및 로그인 페이지 유도 확인
  - [x] 본인이 작성한 글/댓글에만 수정/삭제 버튼 노출 및 기능 정상 동작 확인
- [x] 최종 코드 점검
  - [x] 고급 기법보다는 팀 규칙에 맞춰 직관적이고 베이직한 코드로 작성되었는지 확인

# 커밋메시지 작성 가이드

```bash
git commit -m "feat(backend): 구조동물 조회 API 엔드포인트 추가"
git commit -m "feat(frontend): AnimalCard 컴포넌트 스타일 수정"
git commit -m "chore: .gitignore 업데이트"
```

`(backend)` / `(frontend)` 를 붙여주면 나중에 로그 볼 때 어느 쪽 변경인지 한눈에 보여서 팀원들이 편합니다.

### 커밋 메시지 작성 가이드

**좋은 커밋 메시지 형식:**

```
feat: 로그인 기능 구현

- 사용자 로그인 폼 추가
- 로그인 API 연동
- 세션 관리 기능 추가
```

**일반적인 접두어:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 변경
- `test`: 테스트 코드 추가
- `style`: 코드 스타일 변경 (기능 변경 X)
    - 실행 결과는 똑같은데 가독성이나 형식이 정리된 경우
- `chore`: 빌드 프로세스 변경, 패키지 매니저 설정 등
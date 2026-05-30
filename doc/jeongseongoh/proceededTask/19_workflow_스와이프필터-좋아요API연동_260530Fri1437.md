# 19. AnimalSwipePage 필터·좋아요 API 연동 및 버그 수정

**작업일:** 260530Fri  
**대상 파일:** `frontend/src/pages/AnimalSwipepage.jsx`, `frontend/src/components/animalswipe/SwipeSideBox.jsx`

---

## 작업 배경

- `AnimalSwipepage.jsx` 의 하트(좋아요) 버튼이 `/api/likes` 연동 이후에도 LocalStorage에 의존하고 있었음
- 필터 드롭다운 시도/시군구/보호소 옵션이 하드코딩 Mock 데이터(`SwipeSideBox.jsx` 내부) 였음
- 필터 적용 시 `animal.careAddr` undefined 에러 발생 (일부 데이터에 careAddr 필드 없음)
- 축종 등 필터 선택 후 결과 없을 때 "데이터 로딩 중..." 메시지가 뜨는 UX 문제

---

## TODO

### 1. LocalStorage 의존 제거

- [x] `likeAnimal` state 초기값: `localStorage.getItem(...)` → `[]` 로 변경
- [x] `likeAnimal` 변경 시 `localStorage.setItem(...)` 하던 useEffect 제거
- [x] 기존에 있던 `getFavorites()` API 호출 useEffect 유지 (서버에서 찜 목록 불러옴)

### 2. 필터 드롭다운 실 API 연동

- [x] `AnimalSwipepage.jsx`에 `sidoList / sigunguList / shelterList` state 추가
- [x] `fetchSido()` → 마운트 시 1회 호출 (useEffect `[]`)
- [x] `fetchSigungu(sidoCode)` → `filter.sido` 변경 시 연쇄 호출 (useEffect `[filter.sido]`)
- [x] `fetchShelters(sigunguCode)` → `filter.sigungu` 변경 시 연쇄 호출 (useEffect `[filter.sigungu]`)
- [x] 시도 변경 시 하위 sigungu/shelterName 선택값 초기화 (`FilterChange` 내부)
- [x] 시군구 변경 시 하위 shelterName 선택값 초기화 (`FilterChange` 내부)
- [x] 세 목록을 `SwipeSideBox`에 props로 전달

- [x] `SwipeSideBox.jsx` — 함수 시그니처에 `sidoList, sigunguList, shelterList` props 추가
- [x] `SwipeSideBox.jsx` — 하드코딩 Mock 배열(`sidoList/sigunguList/shelterList`) 제거
- [x] `SwipeSideBox.jsx` — 각 `<select>` 의 `map`을 props 데이터 기반으로 교체

### 3. 버그 수정

- [x] `animal.careAddr?.includes(...)` — optional chaining으로 undefined 에러 방어
- [x] early return 분리
  - 최초 로딩 중 (`animals.length === 0`) → "데이터 로딩 중..." 표시
  - 필터 결과 없음 (`!currentAnimal`) → "조건에 맞는 동물이 없습니다." 표시

---

## 주요 변경 내용 요약

### `AnimalSwipepage.jsx`

```js
// 변경 전: localStorage에서 초기값 읽음
const [likeAnimal, setlikeAnimal] = useState(() => {
    const saved = localStorage.getItem('likedId_list');
    return saved ? JSON.parse(saved) : [];
});

// 변경 후: 빈 배열로 초기화, 서버에서 로드
const [likeAnimal, setlikeAnimal] = useState([]);
```

```js
// 추가: 시도/시군구/보호소 state + 연쇄 useEffect
const [sidoList, setSidoList] = useState([]);
const [sigunguList, setSigunguList] = useState([]);
const [shelterList, setShelterList] = useState([]);

useEffect(() => { fetchSido().then(setSidoList); }, []);
useEffect(() => { /* filter.sido 바뀌면 fetchSigungu 호출 */ }, [filter.sido]);
useEffect(() => { /* filter.sigungu 바뀌면 fetchShelters 호출 */ }, [filter.sigungu]);
```

```js
// 변경 전
if (!animal.careAddr.includes(newFilter.sido)) { ... }

// 변경 후: optional chaining으로 null/undefined 방어
if (!animal.careAddr?.includes(newFilter.sido)) { ... }
```

### `SwipeSideBox.jsx`

```js
// 변경 전: 하드코딩
const sidoList = [ {code:'1', name:"서울광역시"}, ... ];

// 변경 후: props로 받음
function SwipeSideBox({ LikeCnt, filter, onFilterChange, sidoList, sigunguList, shelterList }) {
    // Mock 배열 선언 없음
}
```

---

## 확인 사항 (수동 테스트)

- [ ] 스와이프 페이지 진입 시 동물 카드 정상 출력
- [ ] 축종(개/고양이/기타) 선택 시 필터 적용, 결과 없으면 "조건에 맞는 동물이 없습니다." 표시
- [ ] 시도 드롭다운에 실제 시/도 목록 로드됨
- [ ] 시도 선택 → 시군구 목록 연쇄 로드됨
- [ ] 하트 버튼 클릭 → `/api/likes/{id}` POST 호출됨 (네트워크 탭 확인)
- [ ] 페이지 새로고침 후 찜 목록이 서버 기준으로 복원됨 (localStorage 불필요)

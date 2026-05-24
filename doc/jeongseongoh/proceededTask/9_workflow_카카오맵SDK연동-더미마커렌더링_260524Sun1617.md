# Task 9 — Workflow: Kakao Maps SDK 연동 (앱키 발급) 및 더미 보호소 마커 렌더링

> **관련 Todo:** `F-04, F-06` 동물 상세 및 지도 섹션 (정성오 담당)
> **작성일:** 260524Sun1617
> **참고 스택:** React.js (Vite + JSX), Kakao Maps JS SDK, Tailwind CSS

---

## 개요

동물 상세 페이지(`AnimalDetailpage.jsx`) 또는 별도 지도 페이지에서,  
Kakao Maps JS SDK를 연동하여 더미 보호소 데이터를 마커로 지도 위에 렌더링한다.  
실제 API 연동 이전 단계이므로 하드코딩된 더미 데이터를 사용한다.

---

## 사전 조건 확인

- [x] Kakao Developers 계정 보유 여부 확인
- [x] `frontend/.env` 파일 존재 여부 확인 (없으면 생성 필요)
  - ⚠️ `.env` 파일은 AI가 직접 접근 불가 — **앱키 입력은 직접 수행 필요**

---

## Step 1. Kakao Developers 앱키 발급

- [x] [https://developers.kakao.com](https://developers.kakao.com) 접속 → 로그인
- [x] 내 애플리케이션 → 애플리케이션 추가
  - 앱 이름: (예) `petcare-map`
  - 회사명: 임의 입력
- [x] 생성된 앱의 **JavaScript 키** 복사
- [x] 앱 설정 → 플랫폼 → Web 플랫폼 등록
  - 사이트 도메인: `http://localhost:5173` 입력 (Vite 기본 포트)
- [x] (선택) 카카오맵 API 사용 활성화 여부 확인 (기본 활성화되어 있음)

---

## Step 2. 앱키 환경변수 설정

> ⚠️ **이 Step은 직접 수행 필요 (AI가 `.env` 파일 접근 불가)**

- [x] `frontend/.env` 파일 열기 (없으면 생성)
- [x] 아래 줄 추가:
  ```
  VITE_KAKAO_MAP_KEY=여기에_JavaScript_키_입력
  ```
- [x] `.gitignore`에 `.env`가 포함되어 있는지 확인 (이미 되어 있을 가능성 높음)

---

## Step 3. Kakao Maps SDK 스크립트 로드

Kakao Maps SDK는 npm 패키지가 아닌 **CDN 스크립트 방식**으로 로드한다.

- [x] `frontend/index.html` 의 `<head>` 태그 안에 아래 스크립트 추가:
  ```html
  <script
    type="text/javascript"
    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%VITE_KAKAO_MAP_KEY%&libraries=services"
  ></script>
  ```
  - ⚠️ Vite의 `index.html`에서 env 변수는 `%VITE_변수명%` 형식으로 참조됨
  - `libraries=services` 는 주소 검색 등 추가 기능 사용 시 필요 (지금은 없어도 되지만 나중을 위해 포함)

---

## Step 4. 지도 컴포넌트 생성

- [x] `frontend/src/components/KakaoMap.jsx` 파일 신규 생성
- [x] 구현 내용:
  - `useEffect` 훅으로 컴포넌트 마운트 시 지도 초기화
  - `window.kakao.maps` 객체 사용 (전역 객체로 접근)
  - props로 `shelters` 배열(더미 데이터)을 받아 마커 렌더링
  - 지도 중심 좌표: 대한민국 중심 (위도 `36.5`, 경도 `127.5`) 또는 서울 (위도 `37.5665`, 경도 `126.9780`)
  - 초기 줌 레벨: `7` (전국 보호소 분포가 보이는 수준)

  ```jsx
  // 대략적인 구조 (실제 구현 시 참고)
  import { useEffect, useRef } from 'react';

  function KakaoMap({ shelters }) {
    const mapRef = useRef(null);

    useEffect(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5),
        level: 7,
      };
      const map = new window.kakao.maps.Map(container, options);

      shelters.forEach((shelter) => {
        const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lng);
        const marker = new window.kakao.maps.Marker({ position });
        marker.setMap(map);
        // TODO: 마커 클릭 시 infoWindow로 보호소 이름 표시 (선택)
      });
    }, [shelters]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
  }

  export default KakaoMap;
  ```

---

## Step 5. 더미 보호소 데이터 준비

- [x] `frontend/src/mock/` 폴더 존재 여부 확인 (없으면 생성)
- [x] `frontend/src/mock/sheltersDummy.js` 파일 생성
- [x] 내용: 위경도가 포함된 더미 보호소 5~10개 하드코딩
  ```js
  // sheltersDummy.js
  const sheltersDummy = [
    { id: 1, name: '서울 동물보호소', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '부산 동물보호소', lat: 35.1796, lng: 129.0756 },
    { id: 3, name: '대구 동물보호소', lat: 35.8714, lng: 128.6014 },
    { id: 4, name: '인천 동물보호소', lat: 37.4563, lng: 126.7052 },
    { id: 5, name: '광주 동물보호소', lat: 35.1595, lng: 126.8526 },
    { id: 6, name: '대전 동물보호소', lat: 36.3504, lng: 127.3845 },
    { id: 7, name: '제주 동물보호소', lat: 33.4996, lng: 126.5312 },
  ];

  export default sheltersDummy;
  ```

---

## Step 6. 지도 페이지 또는 기존 페이지에 컴포넌트 삽입

- [x] 삽입 위치 결정:
  - **옵션 A**: `AnimalDetailpage.jsx` 하단에 지도 섹션으로 삽입 (동물 상세 → 보호소 위치)
  - **옵션 B**: 별도 `ShelterMapPage.jsx` 페이지로 분리 (전국 보호소 지도)
  - → 현재 단계는 **옵션 B 권장** (더미 렌더링 검증 목적, 기존 코드 영향 최소화)
- [x] 선택한 위치에 아래처럼 import 및 렌더링:
  ```jsx
  import KakaoMap from '../components/KakaoMap';
  import sheltersDummy from '../mock/sheltersDummy';

  // JSX 내에서
  <KakaoMap shelters={sheltersDummy} />
  ```
- [x] `App.jsx`에 라우트 추가 (옵션 B 선택 시):
  ```jsx
  <Route path="/map" element={<ShelterMapPage />} />
  ```

---

## Step 7. 동작 확인

- [x] `npm run dev` 로 개발 서버 실행
- [x] 브라우저에서 해당 경로(`/map` 또는 동물 상세 페이지) 접속
- [x] 지도가 정상 렌더링되는지 확인
- [x] 더미 보호소 7개의 마커가 지도에 표시되는지 확인
- [x] 콘솔 에러 없는지 확인 (특히 `kakao is not defined` 에러 주의)
  - 발생 시: `index.html` 스크립트 태그 appkey 환경변수 치환 여부 확인

---

## 주의사항 및 트러블슈팅

| 문제 | 원인 | 해결 |
|------|------|------|
| `kakao is not defined` | SDK 스크립트 로드 전에 JS 실행됨 | `index.html`의 스크립트 태그 위치 확인, `useEffect` 안에서만 `kakao` 접근 |
| 지도가 안 보임 (빈 박스) | 컨테이너 height 미설정 | `div`에 명시적 `height` CSS 지정 필요 |
| 앱키 오류 (401) | 잘못된 키 또는 도메인 미등록 | Kakao Developers에서 Web 플랫폼 도메인 재확인 |
| 환경변수 미적용 | `.env` 파일 형식 오류 | `VITE_` 접두사 필수, 서버 재시작 필요 |

---

## 완료 기준

- [x] 지도가 지정 경로에서 정상 렌더링됨
- [x] 더미 보호소 마커 7개 이상 지도에 표시됨
- [x] 콘솔 에러 없음
- [x] 기존 페이지(`AnimalFeedPage` 등) 동작에 영향 없음

---

## 다음 단계 (Phase 2 연동 시)

- `sheltersDummy` → `D-1` 실제 API(`/api/shelters`) 응답으로 교체
- 마커 클릭 → InfoWindow로 보호소 상세 정보 표시
- (선택) 동물 상세 페이지에서 해당 동물의 보호소 위치만 단독 표시

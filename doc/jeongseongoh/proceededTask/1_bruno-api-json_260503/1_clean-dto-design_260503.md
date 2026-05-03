# Phase 2: Clean DTO 및 데이터 매핑 설계 (260503)

## 1. 개요
공공 API v2의 복잡하고 난해한 필드명을 프론트엔드에서 직관적으로 사용할 수 있도록 'Basic & Clean' 구조로 재설계합니다. 이 설계는 Phase 3의 Mock JSON 생성 및 Phase 4의 백엔드 개발 가이드라인이 됩니다.

## 2. 구조동물 (Animal) DTO 매핑

| **공공 API 필드 (v2)** | **정제된 필드 (Clean)** | **타입** | **비고 (가공 로직)** |
| --- | --- | --- | --- |
| `desertionNo` | `id` | string | |
| `happenDt` | `discoveryDate` | string | YYYYMMDD -> YYYY-MM-DD |
| `happenPlace` | `discoveryPlace` | string | |
| `kindFullNm` | `kind` | string | `[개] 믹스견` 형태 유지 |
| `colorCd` | `color` | string | |
| `age` | `age` | string | |
| `weight` | `weight` | string | |
| `noticeNo` | `noticeNumber` | string | |
| `noticeSdt` | `noticeStartDate` | string | YYYYMMDD -> YYYY-MM-DD |
| `noticeEdt` | `noticeEndDate` | string | YYYYMMDD -> YYYY-MM-DD |
| `popfile1`~`8` | `images` | string[] | null 제외 배열화 |
| `processState` | `status` | string | |
| `sexCd` | `gender` | string | M:수컷, F:암컷, Q:미상 매핑 |
| `neuterYn` | `isNeutered` | string | Y:예, N:아니오, U:미상 매핑 |
| `specialMark` | `description` | string | |
| `careNm` | `shelterName` | string | |
| `careTel` | `shelterTel` | string | |
| `careAddr` | `shelterAddr` | string | |
| `orgNm` | `jurisdiction` | string | |
| `sfeSoci` | `socialization` | string | |
| `sfeHealth` | `healthStatus` | string | |
| `updTm` | `updatedAt` | string | |

## 3. 동물보호센터 (Shelter) DTO 매핑

| **공공 API 필드 (v2)** | **정제된 필드 (Clean)** | **타입** | **비고** |
| --- | --- | --- | --- |
| `careRegNo` | `id` | string | |
| `careNm` | `name` | string | |
| `careAddr` | `address` | string | |
| `careTel` | `tel` | string | |
| `lat` | `lat` | number | Float 변환 |
| `lng` | `lng` | number | Float 변환 |
| `weekOprStime` | `weekStartTime` | string | |
| `weekOprEtime` | `weekEndTime` | string | |
| `closeDay` | `closedDays` | string | |
| `updTm` | `updatedAt` | string | |

## 4. 코드 조회 (Code) DTO 매핑

| **공공 API 필드 (v2)** | **정제된 필드 (Clean)** | **비고** |
| --- | --- | --- |
| `orgCd` | `code` | 시도/시군구 코드 |
| `orgdownNm` | `name` | 지역명 |
| `uprCd` | `parentCode` | 시군구의 상위 시도 코드 |
| `careRegNo` | `id` | 보호소 고유 번호 |
| `careNm` | `name` | 보호소 이름 |
| `kindCd` | `code` | 품종 코드 |
| `kindNm` | `name` | 품종 이름 |

## 5. 통계 (Stats) DTO 매핑

| **프론트엔드 요구 필드** | **매핑/가공 출처** | **설명** |
| --- | --- | --- |
| `totalRescued` | `totalCount` (기간 내 합계) | 전체 구조 건수 |
| `statusCounts` | `chart1` (처분상태별 집계) | 보호중, 입양, 안락사 등 상태별 숫자 |
| `regionRatios` | `chart2` (지역별 비율) | 시도별 발생 비율 (%) |

## 6. 특수 가공 전략
1.  **배열화 (Grouping):** `popfile1`부터 `popfile8`까지 순회하며 값이 있는 항목만 `images` 배열에 담습니다. (Swiper UI 대응)
2.  **포맷팅 (Formatting):** `YYYYMMDD` 형태의 날짜를 `YYYY-MM-DD`로 변환하여 프론트엔드의 Moment/Day.js 처리 부담을 줄입니다.
3.  **한글 직관화 (Humanizing):** `sexCd`, `neuterYn` 등 코드값을 프론트엔드에서 즉시 렌더링 가능한 한글 문자열로 변환합니다.
4.  **타입 변환 (Casting):** `lat`, `lng` 등 숫자로 쓰이는 필드는 문자열이 아닌 숫자 타입으로 명확히 전달합니다.
5.  **래퍼 제거 (Flattening):** 공공 API의 `response.body.items.item` 구조를 생략하고 `data: { items: [], pagination: {} }` 형태로 단순화합니다.


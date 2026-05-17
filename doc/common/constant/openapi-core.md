# Core OpenAPI Summary (All Approved APIs)

공공데이터포털을 통해 승인된 모든 서비스(7종)의 핵심 명세 요약입니다.

## 1. 서비스별 Base URL & 주요 엔드포인트

| 서비스명 | Base URL | 주요 엔드포인트 |
| --- | --- | --- |
| **구조동물 조회** | `apis.data.go.kr/1543061/abandonmentPublicService_v2` | `/abandonmentPublic_v2` |
| **동물보호센터 정보** | `apis.data.go.kr/1543061/animalShelterSrvc_v2` | `/shelterInfo_v2` |
| **반려동물 동반여행** | `apis.data.go.kr/B551011/KorPetTourService2` | `/areaBasedList2`, `/detailPetTour2` |
| **분실동물 조회** | `apis.data.go.kr/1543061/lossInfoService` | `/lossInfo` |
| **동물등록 정보조회** | `apis.data.go.kr/1543061/animalInfoSrvc_v3` | `/animalInfo_v3` |
| **등록대행업체 조회** | `apis.data.go.kr/1543061/recordAgencySrvc_v2` | `/recordAgency_v2` |
| **구조동물 통계 조회** | `apis.data.go.kr/1543061/rescueAnimalStatsService` | `/rescueAnimalStats` |

---

## 2. 상세 엔드포인트 요약

### [MAFRA] 구조동물 관련 (구조동물 조회 / 통계)
- **구조동물 목록 (`/abandonmentPublic_v2`)**: `bgnde`/`endde`(구조일), `upkind`(축종), `state`(상태) 등 조건 검색.
- **통계조회 (`/rescueAnimalStats`)**: 기간별/지역별 구조 현황 통계 데이터 제공.
- **코드조회**: `/sido_v2`, `/sigungu_v2`, `/shelter_v2`, `/kind_v2` (검색 필터링용)

### [MAFRA] 동물등록/분실 관련
- **분실동물 조회 (`/lossInfo`)**: 사용자가 신고한 분실 동물의 위치, 사진, 연락처 정보 조회.
- **동물등록 정보 (`/animalInfo_v3`)**: `dog_reg_no`(등록번호) & `owner_nm`(성명) 필수. 등록 동물의 기본 정보 확인.
- **등록대행업체 (`/recordAgency_v2`)**: `addr`(주소) 또는 `orgNm`(업체명)으로 대행 병원/업체 정보 조회.

### [MAFRA] 동물보호센터 정보
- **보호소 상세 (`/shelterInfo_v2`)**: `care_reg_no` 필수. 위도/경도(`lat`/`lng`), 운영시간, 연락처 등 상세 정보.

### [KTO] 반려동물 동반여행 서비스
- **지역기반 목록 (`/areaBasedList2`)**: `areaCode`(지역), `contentTypeId`(유형: 숙박, 음식점 등)별 장소 목록.
- **동반정보 상세 (`/detailPetTour2`)**: `contentId` 필수. 동반 시 유의사항, 이용가능 시설 정보 제공.
- **위치기반 조회 (`/locationBasedList2`)**: `mapX`/`mapY`(좌표) 기준 반경 내 여행지 검색.

---

## 3. 공통 에러 코드
- `Unauthorized`: 인증키 유효하지 않음
- `Forbidden`: 서비스 활용신청 미승인 (호출 전 포털 승인 상태 확인 필수)
- `API token quota exceeded`: 일일 호출 한도 초과
- `INVALID_REQUEST_PARAMETER_ERROR`: 필수 파라미터 누락 또는 형식 오류

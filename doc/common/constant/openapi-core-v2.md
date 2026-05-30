실제 DTO 및 클래스 모델 모델링(코딩) 단계에서 필드 누락으로 인한 컴파일 에러나 데이터 유실이 없도록, **원시 명세서에 등장한 모든 필드를 단 하나도 빠짐없이 1:1로 추출하여 매핑 테이블로 정리**했습니다.

타입은 예시 데이터와 오픈API 특성을 고려하여 코딩에 가장 적합한 타입(`String`, `Integer`, `Long`, `Double`)으로 명시했습니다. 프로젝트 환경(Java/Kotlin, TypeScript 등)에 맞춰 적용하시기 바랍니다.

---

## 0. 공통 응답 백엔드 헤더 (Common Header)

모든 API 응답의 `response -> header`에 기본적으로 포함되는 공통 구조입니다. 공통 상위 클래스나 레퍼 객체(Response Wrapper) 정의 시 활용하세요.

| 필드명 (Property) | 타입 (Type) | 설명 (Description) |
| --- | --- | --- |
| `reqNo` | `Long` / `String` | 요청 고유 번호 |
| `resultCode` | `String` | 결과 코드 (정상: `00`, `0000` 등) |
| `resultMsg` | `String` | 결과 메시지 (예: `NORMAL SERVICE.`, `OK`) |
| `errorMsg` | `String` | 오류 상세 내역 |

---

## 1. 국가동물보호정보시스템 구조동물 조회 서비스

* **Base URL:** `http://apis.data.go.kr/1543061/abandonmentPublicService_v2`

### 📑 1-1. GET `/abandonmentPublic_v2` (구조동물 조회)

#### 요청 파라미터 (Query Parameters)

`serviceKey`는 필수값입니다.

| 파라미터명 | 타입 | 설명 |
| --- | --- | --- |
| `serviceKey` | `String` | 공공데이터포털에서 발급받은 인증키 |
| `bgnde` | `String` | 구조날짜(검색 시작일)(YYYYMMDD) |
| `endde` | `String` | 구조날짜(검색 종료일)(YYYYMMDD) |
| `upkind` | `String` | 축종코드 (개: 417000, 고양이: 422400, 기타: 429900) |
| `kind` | `String` | 품종코드 (품종 조회 OPEN API 참조) |
| `upr_cd` | `String` | 시도코드 (시도 조회 OPEN API 참조) |
| `org_cd` | `String` | 시군구코드 (시군구 조회 OPEN API 참조) |
| `care_reg_no` | `String` | 보호소번호 (보호소 조회 OPEN API 참조) |
| `state` | `String` | 상태 (전체: null, 공고중: notice, 보호중: protect) |
| `neuter_yn` | `String` | 상태 (전체: null, 예: Y, 아니오: N, 미상: U) |
| `pageNo` | `String` | 페이지 번호 (기본값: 1) |
| `numOfRows` | `String` | 페이지당 보여줄 개수 (1,000 이하, 기본값: 10) |
| `_type` | `String` | xml(기본값) 또는 json |
| `bgupd` | `String` | 수정날짜(검색 시작일)(YYYYMMDD) |
| `enupd` | `String` | 수정날짜(검색 종료일)(YYYYMMDD) |
| `sex_cd` | `String` | 성별 (전체: null, 수컷: M, 암컷: F, 미상: Q) |
| `rfid_cd` | `String` | 동물등록번호(RFID 번호) |
| `desertion_no` | `String` | 유기번호 |
| `notice_no` | `String` | 공고번호 |

#### 응답 바디 필드 (`response -> body -> items -> item`)

원시 모델 명세에 기재된 전용 상세 속성(입양 조건, 방역 상태 등)이 대거 추가되어 있으니 전부 매핑 클래스에 선언하셔야 합니다.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `desertionNo` | `String` | 구조번호 / 유기번호 |
| `happenDt` | `String` | 접수일 / 접수일자 (YYYYMMDD) |
| `happenPlace` | `String` | 발견장소 |
| `kindFullNm` | `String` | 품종 (예: [개] 믹스견) |
| `upKindCd` | `String` | 축종코드 (개: 417000 등) |
| `upKindNm` | `String` | 축종명 |
| `kindCd` | `String` | 품종코드 |
| `kindNm` | `String` | 품종명 |
| `colorCd` | `String` | 색상 / 색상코드 |
| `age` | `String` | 나이 |
| `weight` | `String` | 체중 |
| `noticeNo` | `String` | 공고번호 |
| `noticeSdt` | `String` | 공고시작일 (YYYYMMDD) |
| `noticeEdt` | `String` | 공고종료일 (YYYYMMDD) |
| `popfile1` | `String` | 이미지 1 |
| `popfile2` | `String` | 이미지 2 |
| `popfile3` | `String` | 이미지 3 |
| `popfile4` | `String` | 이미지 4 |
| `popfile5` | `String` | 이미지 5 |
| `popfile6` | `String` | 이미지 6 |
| `popfile7` | `String` | 이미지 7 |
| `popfile8` | `String` | 이미지 8 |
| `processState` | `String` | 상태 (예: 보호중, 종료(반환)) |
| `sexCd` | `String` | 성별 (M: 수컷, F: 암컷, Q: 미상) |
| `neuterYn` | `String` | 중성화여부 (Y: 예, N: 아니오, U: 미상) |
| `specialMark` | `String` | 특징 |
| `careRegNo` | `String` | 보호소번호 |
| `careNm` | `String` | 보호소이름 |
| `careTel` | `String` | 보호소전화번호 |
| `careAddr` | `String` | 보호장소 / 주소 |
| `careOwnerNm` | `String` | 보호소대표자 |
| `orgNm` | `String` | 관할기관 / 관할지 |
| `updTm` | `String` | 수정일(yyyy-mm-dd hh:mm:ss) |
| `srvcTxt` | `String` | 봉사안내 지원내용 및 신청방법 |
| `sprtEDate` | `String` | 입양지원 종료일 |
| `rfidCd` | `String` | 동물등록번호(RFID번호) |
| `evntImg` | `String` | 행사안내 이미지 |
| `endReason` | `String` | 처분사유 |
| `sfeSoci` | `String` | 특징(사회성) |
| `sfeHealth` | `String` | 특징(건강) |
| `etcBigo` | `String` | 특이사항 / 비고 |
| `vaccinationChk` | `String` | 체크박스(광견병,종합백신,코로나,호흡기 등) |
| `healthChk` | `String` | 체크박스(사상충,파보,코로나,홍역,원충) |
| `adptnTitle` | `String` | 입양절차 제목 |
| `adptnSDate` | `String` | 입양절차 시작일 |
| `adptnEDate` | `String` | 입양절차 종료일 |
| `adptnConditionLimitTxt` | `String` | 입양절차 조건 및 제한 |
| `adptnTxt` | `String` | 입양절차 지원내용 및 신청방법 |
| `adptnImg` | `String` | 입양절차 이미지 |
| `sprtTitle` | `String` | 입양지원 제목 |
| `sprtSDate` | `String` | 입양지원 시작일 |
| `sprtConditionLimitTxt` | `String` | 입양지원 조건 및 제한 |
| `sprtTxt` | `String` | 입양지원 지원내용 및 신청방법 |
| `sprtImg` | `String` | 입양지원 이미지 |
| `srvcTitle` | `String` | 봉사안내 제목 |
| `srvcSDate` | `String` | 봉사안내 시작일 |
| `srvcEDate` | `String` | 봉사안내 종료일 |
| `srvcConditionLimitTxt` | `String` | 봉사안내 조건 및 제한 |
| `srvcImg` | `String` | 봉사안내 이미지 |
| `evntTitle` | `String` | 행사안내 제목 |
| `evntSDate` | `String` | 행사안내 시작일 |
| `evntEDate` | `String` | 행사안내 종료일 |
| `evntConditionLimitTxt` | `String` | 행사안내 조건 및 제한 |
| `evntTxt` | `String` | 행사안내 조건 및 제한행사안내 지원내용 및 신청방법 |

---

### 📑 1-2. GET `/sigungu_v2` (시군구 조회)

* **요청 파라미터:** `serviceKey`, `upr_cd`(시도코드-필수), `_type`, `numOfRows`, `pageNo`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `uprCd` | `String` | 시군구 상위코드 (시도코드) |
| `orgCd` | `String` | 시군구코드 |
| `orgdownNm` | `String` | 시군구명 |

---

### 📑 1-3. GET `/sido_v2` (시도 조회)

* **요청 파라미터:** `serviceKey`, `numOfRows`, `pageNo`, `_type`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `orgCd` | `String` | 시도코드 |
| `orgdownNm` | `String` | 시도명 |

---

### 📑 1-4. GET `/shelter_v2` (보호소 조회)

* **요청 파라미터:** `serviceKey`, `upr_cd`(필수), `org_cd`(필수), `_type`, `numOfRows`, `pageNo`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `careRegNo` | `String` | 보호소번호 |
| `careNm` | `String` | 보호소명 |

---

### 📑 1-5. GET `/kind_v2` (품종 조회)

* **요청 파라미터:** `serviceKey`, `up_kind_cd`(축종코드-필수), `_type`, `numOfRows`, `pageNo`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `kindCd` | `String` | 품종코드 |
| `kindNm` | `String` | 품종명 |

---

## 2. 동물보호센터 정보 조회서비스

* **Base URL:** `http://apis.data.go.kr/1543061/animalShelterSrvc_v2`

### 📑 2-1. GET `/shelterInfo_v2` (동물보호센터 정보조회)

* **요청 파라미터:** `serviceKey`, `care_reg_no`, `care_nm`, `numOfRows`, `pageNo`, `_type`, `upr_cd`, `org_cd`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `dataStdDt` | `String` | 데이터기준일자 |
| `careNm` | `String` | 동물보호센터명 |
| `careRegNo` | `String` | 보호소번호 |
| `orgNm` | `String` | 관리기관명 |
| `divisionNm` | `String` | 동물보호센터유형 |
| `saveTrgtAnimal` | `String` | 구조대상동물 |
| `careAddr` | `String` | 소재지도로명주소 |
| `jibunAddr` | `String` | 소재지번주소 |
| `lat` | `Double` | 위도 |
| `lng` | `Double` | 경도 |
| `dsignationDate` | `String` | 동물보호센터지정일자 |
| `weekOprStime` | `String` | 평일운영시작시각 |
| `weekOprEtime` | `String` | 평일운영종료시각 |
| `weekCellStime` | `String` | 평일분양시작시각 |
| `weekCellEtime` | `String` | 평일분양종료시각 |
| `weekendOprStime` | `String` | 주말운영시작시각 |
| `weekendOprEtime` | `String` | 주말운영종료시각 |
| `weekendCellStime` | `String` | 주말분양시작시각 |
| `weekendCellEtime` | `String` | 주말분양종료시각 |
| `closeDay` | `String` | 휴무일 |
| `vetPersonCnt` | `Integer` | 수의사인원수 (원시 명세에 따라 String 선언 가능) |
| `specsPersonCnt` | `Integer` | 사양관리사인원수 |
| `medicalCnt` | `Integer` | 진료실수 |
| `breedCnt` | `Integer` | 사육실수 |
| `quarabtineCnt` | `Integer` | 격리실수 |
| `feedCnt` | `Integer` | 사료보관실수 |
| `transCarCnt` | `Integer` | 구조운반용차량보유대수 |
| `careTel` | `String` | 전화번호 |

---

## 3. 구조동물 통계 조회 서비스

* **Base URL:** `http://apis.data.go.kr/1543061/rescueAnimalStatsService`

### 📑 3-1. 하위 지역/시설 조회 관련 엔드포인트

* **GET `/rescueAnimalSido**`: 파라미터 (`serviceKey`, `numOfRows`, `pageNo`, `_type`)
* **GET `/rescueAnimalSigungu**`: 파라미터 (`serviceKey`, `upr_cd`[필수], `numOfRows`, `pageNo`, `_type`)
* **GET `/rescueAnimalShelter**`: 파라미터 (`serviceKey`, `upr_cd`[필수], `org_cd`[필수], `numOfRows`, `pageNo`, `_type`)

> 상기 3개 API의 응답 필드는 구조동물 서비스(1-2, 1-3, 1-4)의 `orgCd`, `orgdownNm`, `uprCd`, `careRegNo`, `careNm` 구조와 1:1 매칭됩니다.

### 📑 3-2. GET `/rescueAnimalStats` (구조동물 통계조회)

* **요청 파라미터:** `serviceKey`, `bgnde`(시작일-필수), `endde`(종료일-필수), `upr_cd`, `org_cd`, `care_reg_no`, `pageNo`, `numOfRows`, `_type`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `tot` | `String` | 건수 또는 비율 (예: "108283", "14.2") |
| `se` | `String` | 구분 코드 (예: chart1, chart2) |
| `rgn` | `String` | 시도 / 시군구명 (예: 전체 지역) |
| `prcsNm` | `String` | 처리명 또는 지자체명 (예: 보호중, 자연사, 대구광역시) |

---

## 4. 분실동물 조회 서비스

* **Base URL:** `http://apis.data.go.kr/1543061/lossInfoService`

### 📑 4-1. 하위 조회 API 파라미터 및 응답

* **GET `/lossInfoSigungu**`: 파라미터 (`serviceKey`, `upr_cd`[필수], `numOfRows`, `pageNo`, `_type`) -> 응답: `orgCd`, `orgdownNm`, `uprCd`
* **GET `/lossInfoSido**`: 파라미터 (`serviceKey`, `numOfRows`, `pageNo`, `_type`) -> 응답: `orgCd`, `orgdownNm`
* **GET `/lossInfoKind**`: 파라미터 (`serviceKey`, `up_kind_cd`[필수], `numOfRows`, `pageNo`, `_type`) -> 응답: `kindCd`, `kindNm`

### 📑 4-2. GET `/lossInfo` (분실동물 조회)

* **요청 파라미터:** `serviceKey`, `bgnde`(시작일-필수), `ended`(종료일-필수), `upkind`, `kind`, `upr_cd`, `org_cd`, `sex_cd`, `pageNo`, `numOfRows`, `_type`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `rfidCd` | `String` | RFID 번호 |
| `callName` | `String` | 신고자 이름 |
| `callTel` | `String` | 신고자 연락처 |
| `happenDt` | `String` | 접수일 / 분실 일시 (YYYY-MM-DD HH:mm:ss.S) |
| `happenAddr` | `String` | 분실장소 |
| `happenAddrDtl` | `String` | 분실장소상세 |
| `happenPlace` | `String` | 주위 건물 / 장소 특징 |
| `orgNm` | `String` | 관할지 / 관할기관명 |
| `popfile` | `String` | 동물 이미지 URL |
| `kindCd` | `String` | 품종명 / 품종 |
| `colorCd` | `String` | 색상 |
| `sexCd` | `String` | 성별 (M: 수컷, F: 암컷) |
| `age` | `String` | 나이 |
| `specialMark` | `String` | 특징 |

---

## 5. 한국관광공사 반려동물 동반여행 서비스

* **Base URL:** `http://apis.data.go.kr/B551011/KorPetTourService2`
* **공통 필수 파라미터 (모든 관광공사 API 요청에 상시 필수 포함):** `serviceKey`, `MobileOS` (IOS, AND, WIN, ETC), `MobileApp`, `pageNo`, `numOfRows`, `_type`

### 📑 5-1. GET `/categoryCode2` (서비스분류코드조회)

* **추가 파라미터:** `contentTypeId`, `cat1`, `cat2`, `cat3`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `name` | `String` | 대, 중, 소분류 코드명 |
| `rnum` | `Integer` | 일련번호 |
| `code` | `String` | 대, 중, 소분류 코드 |

### 📑 5-2. GET `/detailPetTour2` (반려동물 동반여행 상세 동반조건 조회)

* **추가 파라미터:** `contentId` (콘텐츠ID - 필수)
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `acmpyNeedMtr` | `String` | 동반 시 필요 사항 / 유의사항 |
| `contentid` | `String` | 콘텐츠 ID |
| `relaAcdntRiskMtr` | `String` | 관련 사고 위험 요인 / 사항 |
| `acmpyTypeCd` | `String` | 동반 유형 코드 |
| `relaPosesFclty` | `String` | 관련 보유 시설 |
| `relaFrnshPrdlst` | `String` | 관련 제공 품목 |
| `etcAcmpyInfo` | `String` | 기타 동반 정보 |
| `relaPurcPrdlst` | `String` | 관련 구매 품목 |
| `acmpyPsblCpam` | `String` | 동반 가능 허용 기준 / 무게 제한 등 |
| `relaRntlPrdlst` | `String` | 관련 대여 품목 |

### 📑 5-3. GET `/areaCode2` (지역코드 조회)

* **추가 파라미터:** `areaCode`
* **응답 바디 필드 (`item`)**: `name`(지역명), `rnum`(일련번호), `code`(지역코드)

### 📑 5-4. GET `/ldongCode2` (법정동 코드 조회)

* **추가 파라미터:** `lDongRegnCd`, `lDongListYn`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `rnum` | `String` | 일련번호 |
| `name` | `String` | 법정동명 |
| `code` | `String` | 법정동코드 |
| `lDongRegnCd` | `String` | 법정동 시도 코드 |
| `lDongRegnNm` | `String` | 법정동 시도 명 |
| `lDongSignguCd` | `String` | 법정동 시군구 코드 |
| `lDongSignguNm` | `String` | 법정동 시군구 명 |

### 📑 5-5. GET `/lclsSystmCode2` (분류체계 코드 조회)

* **추가 파라미터:** `lclsSystm1`, `lclsSystm2`, `lclsSystm3`, `lclsSystmListYn`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `rnum` | `String` | 일련번호 |
| `code` | `String` | 분류체계 코드 |
| `name` | `String` | 분류체계 코드명 |
| `lclsSystm1Cd` | `String` | 분류체계 1Depth 코드 |
| `lclsSystm1Nm` | `String` | 분류체계 1Depth 명 |
| `lclsSystm2Cd` | `String` | 분류체계 2Depth 코드 |
| `lclsSystm2Nm` | `String` | 분류체계 2Depth 명 |
| `lclsSystm3Cd` | `String` | 분류체계 3Depth 코드 |
| `lclsSystm3Nm` | `String` | 분류체계 3Depth 명 |

### 📑 5-6. GET `/areaBasedList2` (지역기반 관광정보조회)

* **추가 파라미터:** `arrange`, `contentTypeId`, `areaCode`, `sigunguCode`, `cat1`, `cat2`, `cat3`, `modifiedtime`, `lDongRegnCd`, `lDongSignguCd`, `lclsSystm1`, `lclsSystm2`, `lclsSystm3`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `cpyrhtDivCd` | `String` | 저작권 분할 코드 / 저작권 유형 |
| `contentid` | `String` | 콘텐츠 ID |
| `contenttypeid` | `String` | 콘텐츠 타입 ID |
| `title` | `String` | 명소 제목 |
| `createdtime` | `String` | 생성일시 |
| `modifiedtime` | `String` | 수정일시 |
| `tel` | `String` | 전화번호 |
| `cat1` | `String` | 대분류 |
| `cat2` | `String` | 중분류 |
| `cat3` | `String` | 소분류 |
| `zipcode` | `String` | 우편번호 |
| `addr1` | `String` | 주소 |
| `addr2` | `String` | 상세주소 |
| `areacode` | `String` | 지역코드 |
| `sigungucode` | `String` | 시군구코드 |
| `mapx` | `String` | GPS X좌표 (경도) |
| `mapy` | `String` | GPS Y좌표 (위도) |
| `mlevel` | `String` | 지도 줌 레벨 |
| `firstimage` | `String` | 대표 이미지 URL 1 |
| `firstimage2` | `String` | 대표 이미지 URL 2 |
| `lDongRegnCd` | `String` | 법정동 시도 코드 |
| `lDongSignguCd` | `String` | 법정동 시군구 코드 |
| `lclsSystm1` | `String` | 분류체계 1Depth |
| `lclsSystm2` | `String` | 분류체계 2Depth |
| `lclsSystm3` | `String` | 분류체계 3Depth |

### 📑 5-7. GET `/detailImage2` (이미정보조회)

* **추가 파라미터:** `contentId`(필수), `imageYN`
* **응답 바디 필드 (`item`)**: `cpyrhtDivCd`(저작권코드), `contentid`(콘텐츠ID), `imgname`(이미지명), `originimgurl`(원본이미지URL), `serialnum`(일련번호), `smallimageurl`(썸네일이미지URL)

### 📑 5-8. GET `/petTourSyncList2` (동기화 목록 조회)

* **추가 파라미터:** `areaBasedList2`와 동일 조건 + `showflag`
* **응답 바디 필드 (`item`)**: `areaBasedList2` 필드 전체 포함 + `showflag`(콘텐츠 표출 여부: 1=표출, 0=비표출)

### 📑 5-9. GET `/locationBasedList2` (위치기반 관광정보 조회)

* **추가 파라미터:** `mapX`(필수), `mapY`(필수), `radius`(필수), `arrange`, `contentTypeId`, `modifiedtime`, 및 법정동/분류체계 파라미터군
* **응답 바디 필드 (`item`)**: `areaBasedList2` 필드 전체 포함 + `dist`(중심 좌표로부터의 거리, 단위: m)

### 📑 5-10. GET `/detailCommon2` (공통 정보 조회)

* **추가 파라미터:** `contentId`(필수)
* **응답 바디 필드 (`item`)**: `areaBasedList2` 필드 전체 포함 + `overview`(개요/설명), `homepage`(홈페이지 주소), `telname`(전화번호 명의/이름)

### 📑 5-11. GET `/detailInfo2` (반복 정보 조회 - 숙박 객실 및 상세 세부 편의시설)

* **추가 파라미터:** `contentId`(필수), `contentTypeId`(필수)
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `roomTable` | `String` | 객실 테이블 정보 |
| `roomcable` | `String` | 객실 케이블TV 여부 |
| `roombathfacility` | `String` | 욕실 시설 상태 |
| `contentid` | `String` | 콘텐츠 ID |
| `contenttypeid` | `String` | 콘텐츠 타입 ID |
| `roomtitle` | `String` | 객실 명칭 / 제목 |
| `roomsize1` | `String` | 객실 크기 (평방미터) |
| `roomcount` | `String` | 객실 수 |
| `roombasecount` | `String` | 기준 인원 |
| `roommaxcount` | `String` | 최대 인원 |
| `roomoffseasonminfee1` | `String` | 비수기 주중 최소 요금 |
| `roomoffseasonminfee2` | `String` | 비수기 주말 최소 요금 |
| `roompeakseasonminfee1` | `String` | 성수기 주중 최소 요금 |
| `roompeakseasonminfee2` | `String` | 성수기 주말 최소 요금 |
| `roomintro` | `String` | 객실 소개 글 |
| `roombath` | `String` | 욕조 여부 |
| `roomhometheater` | `String` | 홈시어터 시설 여부 |
| `roomaircondition` | `String` | 에어컨 여부 |
| `roomtv` | `String` | TV 여부 |
| `roompc` | `String` | PC 보유 여부 |
| `roominternet` | `String` | 인터넷 가능 여부 |
| `roomrefrigerator` | `String` | 냉장고 여부 |
| `roomtoiletries` | `String` | 세면도구 구비 여부 |
| `roomsofa` | `String` | 소파 여부 |
| `roomcook` | `String` | 취사 도구/가능 여부 |
| `roomhairdryer` | `String` | 헤어드라이어 여부 |
| `roomsize2` | `String` | 객실 크기 (평) |
| `roomimg1` ~ `roomimg5` | `String` | 객실 이미지 URL 1 ~ 5 |
| `roomimg1cpyrhtdiv` ~ `5` | `String` | 객실 이미지 저작권 구분 1 ~ 5 |
| `roomimg1alt` ~ `5` | `String` | 객실 이미지 대체 텍스트 1 ~ 5 |
| `fldgubun` | `String` | 일련번호 구분 코드 |
| `infoname` | `String` | 정보 항목 이름 |
| `infotext` | `String` | 정보 세부 내용 |
| `serialnum` | `String` | 일련번호 |
| `roominfono` | `String` | 객실 정보 번호 |

### 📑 5-12. GET `/detailIntro2` (소개 정보 조회 - 주차시설, 개장시간 등 원시 필드 폭탄)

* **추가 파라미터:** `contentId`(필수), `contentTypeId`(필수)
* **응답 바디 필드 (`item`)**
관광타입별로 내려오는 불규칙 속성명 전체 목록입니다. 툴을 통해 원시 JSON 파싱 빌드 시 에러가 나지 않도록 모조리 기재해 두어야 안전합니다.

```
expagerangeleports, infocentershopping, chkcreditcardculture, discountinfo, infocenterculture, parkingculture, parkingfee, restdateculture, playtime, program, spendtimefestival, sponsor1, sponsor1tel, sponsor2, sponsor2tel, subevent, usetimefestival, accomcountleports, chkcreditcardleports, infocenterleports, openperiod, parkingfeeleports, parkingleports, reservation, restdateleports, scaleleports, usefeeleports, usefee, usetimeculture, scale, spendtime, agelimit, bookingplace, discountinfofestival, eventenddate, eventhomepage, eventplace, eventstartdate, festivalgrade, placeinfo, contenttypeid, accomcount, chkcreditcard, expagerange, expguide, heritage1, heritage2, heritage3, infocenter, opendate, parking, restdate, useseason, usetime, accomcountculture, fitness, lcnsno, contentid, parkingshopping, restdateshopping, restroom, publicbath, publicpc, sauna, saleitem, saleitemcost, scaleshopping, shopguide, chkcreditcardfood, discountinfofood, firstmenu, infocenterfood, kidsfacility, opendatefood, opetimefood, packing, parkingfood, reservationfood, restdatefood, scalefood, seat, smoking, treatmenu, chkcreditcardshopping, culturecenter, reservationlodging, reservationurl, roomtype, scalelodging, subfacility, barbecue, beauty, opendateshopping, opentime, usetimeleports, accomcountlodging, benikia, checkintime, checkouttime, chkcooking, foodplace, goodstay, hanok, infocenterlodging, parkinglodging, pickup, roomcount, beverage, bicycle, campfire, karaoke, seminar, sports, refundregulation, fairday, chkbabycarriage, chkbabycarriageleports, chkbabycarriageshopping, chkbabycarriageculture, chkpetculture, chkpet, chkpetleports, chkpetshopping

```

*(위 필드명들은 전부 명세서에 노출된 장소 인프라 속성 이름이며, 성격에 따라 전부 `String`으로 선언하여 Mapping 받으시면 됩니다.)*

### 📑 5-13. GET `/searchKeyword2` (키워드 조회)

* **추가 파라미터:** `arrange`, `keyword`(필수)
* **응답 바디 필드 (`item`)**: `areaBasedList2` 모델 구조와 완벽히 동일합니다.

---

## 6. 동물등록 정보조회 서비스

* **Base URL:** `http://apis.data.go.kr/1543061/animalInfoSrvc_v3`

### 📑 6-1. GET `/animalInfo_v3` (동물등록 조회)

* **요청 파라미터:** `serviceKey`, `dog_reg_no`(필수 조합), `rfid_cd`(필수 조합), `owner_nm`(필수 조합), `owner_birth`(필수 조합), `_type`
* **응답 바디 필드 (`body -> item`)** - 단일 객체 리턴 구조

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `officeTel` | `String` | 관할기관 전화번호 |
| `aprGbNm` | `String` | 승인 상태 구분명 |
| `dogRegNo` | `String` | 동물등록번호 |
| `rfidCd` | `String` | 무선식별장치 RFID 번호 |
| `rfidGubun` | `String` | 식별장치유형 (Y: 내장, M: 외장, N: 인식표) |
| `birthDt` | `String` | 동물 생년월일 (YYYYMMDD) |
| `dogNm` | `String` | 동물이름 |
| `sexNm` | `String` | 성별 명칭 |
| `kindNm` | `String` | 품종명 |
| `neuterYn` | `String` | 중성화여부 |
| `orgNm` | `String` | 관할 지자체/기관명 |
| `regTm` | `String` | 등록일시 |
| `aprTm` | `String` | 승인일시 |

---

## 7. 반려동물 등록대행업체 정보 조회 서비스

* **Base URL:** `http://apis.data.go.kr/1543061/recordAgencySrvc_v2`

### 📑 7-1. GET `/recordAgency_v2` (반려동물 등록대행업체 조회)

* **요청 파라미터:** `serviceKey`, `addr`, `orgNm`, `numOfRows`, `pageNo`, `_type`
* **응답 바디 필드 (`item`)**

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `orgNm` | `String` | 대행업체명 |
| `tel` | `String` | 업체 전화번호 |
| `orgAddr` | `String` | 주소 |
| `orgAddrDtl` | `String` | 상세주소 |
| `memberNm` | `String` | 대표자명 (마스킹 처리될 수 있음) |
| `numOfRows` | `String` | 한 페이지 결과 수 (페이징 보조 필드) |
| `pageNo` | `String` | 페이지 번호 |
| `totalCount` | `String` | 전체 결과 수 |
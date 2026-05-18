# 공공 API v2 실데이터 품질 분석 리포트 (260503)

## 1. 개요
Bruno를 통해 수집된 실제 공공 API(v2) 응답 데이터를 분석하여, 명세서와의 차이점 및 프론트엔드 개발 시 고려해야 할 데이터 품질 요소를 정리합니다.

## 2. API별 분석 결과

### 🐾 구조동물 조회 (`abandonmentPublic_v2`)
- **다중 이미지 (`popfile1` ~ `popfile8`):**
    - 실제 응답에서 `popfile1`, `popfile2`는 안정적으로 제공됨.
    - `popfile3` 이상의 필드는 샘플 데이터에서 확인되지 않음. 프론트엔드 UI(Swiper 등) 설계 시 `images` 배열로 변환하되, 가변적인 길이에 대응해야 함.
- **상태값 (`processState`):**
    - "보호중", "종료(입양)", "종료(반환)", "종료(안락사)" 등 다양한 한글 문자열로 제공됨.
    - 백엔드에서 Enum 또는 정제된 코드로 변환 필요.
- **추가 필드 확인:**
    - `sfeSoci` (사회성), `sfeHealth` (건강): 명세대로 데이터가 포함되어 오며, 특징(특이사항)이 상세히 기재된 경우가 많음 (예: "밤톨이처럼 작고 귀여움", "양호").
    - `vaccinationChk` (백신), `healthChk` (건강체크): 일부 항목에서 데이터가 확인됨.
- **날짜 형식:**
    - `updTm`: `YYYY-MM-DD HH:mm:ss.S` 형식 (예: `2026-04-03 14:39:27.0`).

### 🏠 동물보호센터 상세 정보 (`shelterInfo_v2`)
- **좌표 데이터 (`lat`, `lng`):**
    - `35.922276`, `128.59904`와 같이 유효한 숫자 형식(Float/Double)으로 제공됨.
    - 지도 마커 표시 및 거리 계산에 즉시 활용 가능.
- **운영 시간:**
    - `weekOprStime`, `weekOprEtime` 등이 `HH:mm` 형식으로 제공됨.
- **데이터 일관성:**
    - `careRegNo`를 기준으로 구조동물 데이터의 `careRegNo`와 정확히 매칭됨을 확인.

### 📊 구조동물 통계 (`rescueAnimalSido`)
- **데이터 구조:**
    - 현재 응답에서는 시도 코드(`orgCd`)와 이름(`orgdownNm`)만 확인됨.
    - 실제 "통계치(숫자)"를 얻기 위해서는 하위 API나 다른 파라미터 조합이 필요한지 재검토 필요. (단순 목록 조회 API일 가능성 농후)

## 3. 종합 결론 및 대응 전략 (Phase 2 반영)
1. **Flattening 필구:** `response.body.items.item`의 깊은 뎁스를 제거하여 프론트엔드 전달.
2. **이미지 배열화:** `popfile1~8`을 `images: string[]` 형태로 묶어서 전달하여 UI 편의성 증대.
3. **한글 데이터 정제:** `sexCd` (M/F/Q) -> "수컷/암컷/미상", `neuterYn` (Y/N/U) -> "예/아니오/미상" 등 직관적인 한글로 매핑.
4. **사회성/건강 데이터 활용:** `sfeSoci`, `sfeHealth` 데이터가 유의미하므로 상세 페이지 UI에 반영 확정.

---

{
"response": {
"header": {
"reqNo": 49383012,
"resultCode": "00",
"resultMsg": "NORMAL SERVICE."
},
"body": {
"items": {
"item": [
{
"desertionNo": "447515202600086",
"happenDt": "20260331",
"happenPlace": "옥산면 감계리",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "갈색&검정&흰색",
"age": "2024(년생)",
"weight": "4(Kg)",
"noticeNo": "경북-의성-2026-00078",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604031404349.png",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604031404375.png",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "밤톨이처럼 작고 귀여움, 조금은 예민한 아이",
"careRegNo": "347515201900001",
"careNm": "의성동물보호센터",
"careTel": "010-8855-5661",
"careAddr": "경상북도 의성군 의성읍 의성사곡로 101  상리리 440-2",
"careOwnerNm": "김영주",
"orgNm": "경상북도 의성군",
"sfeSoci": "밤톨이처럼 작고 귀여움, 조금은 예민한 아이",
"sfeHealth": "양호",
"updTm": "2026-04-03 14:39:27.0"
},
{
"desertionNo": "447515202600085",
"happenDt": "20260331",
"happenPlace": "옥산면 감계리",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "크림색",
"age": "2026(60일미만)(년생)",
"weight": "8(Kg)",
"noticeNo": "경북-의성-2026-00077",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604031404355.png",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604031404369.png",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "오랜 길거리 생활로 사나움, 상처 조금 있음",
"careRegNo": "347515201900001",
"careNm": "의성동물보호센터",
"careTel": "010-8855-5661",
"careAddr": "경상북도 의성군 의성읍 의성사곡로 101  상리리 440-2",
"careOwnerNm": "김영주",
"orgNm": "경상북도 의성군",
"sfeSoci": "오랜 길거리 생활로 사나움, 상처 조금 있음",
"sfeHealth": "양호",
"updTm": "2026-04-03 14:39:27.0"
},
{
"desertionNo": "442424202600046",
"happenDt": "20260331",
"happenPlace": "갈천동 601-380 인근",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "흰색&검은반점",
"age": "2022(년생)",
"weight": "8(Kg)",
"noticeNo": "강원-삼척-2026-00030",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011604633[1].jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011604665.jpg",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "우측 엄지 절단 및 피부 절상",
"careRegNo": "342424201300001",
"careNm": "삼척시동물보호센터",
"careTel": "033-571-2610",
"careAddr": "강원도 삼척시 미로면 동안로 86-45  ",
"careOwnerNm": "삼척시장",
"orgNm": "강원특별자치도 삼척시",
"updTm": "2026-04-02 09:13:13.0"
},
{
"desertionNo": "428353202600212",
"happenDt": "20260331",
"happenPlace": "남동구 도림동451-1",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "기타(아이보리)",
"age": "2025(년생)",
"weight": "10.5(Kg)",
"noticeNo": "인천-남동-2026-00089",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/20260331200323.jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202603312003474[1].jpg",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "보들보들함",
"careRegNo": "328353200900001",
"careNm": "인천광역시수의사회",
"careTel": "032-429-1673",
"careAddr": "인천광역시 계양구 다남로165번길 56 (다남동, 유기동물보호소) ",
"careOwnerNm": "박정현",
"orgNm": "인천광역시 남동구",
"vaccinationChk": "광견병,종합백신",
"healthChk": "사상충,파보,홍역",
"updTm": "2026-04-12 11:55:24.0"
},
{
"desertionNo": "428353202600211",
"happenDt": "20260331",
"happenPlace": "남동구 도림동 451-1",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "기타(아이보리)",
"age": "2025(년생)",
"weight": "7.5(Kg)",
"noticeNo": "인천-남동-2026-00088",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202603312003870.jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202603312003566.jpg",
"processState": "종료(입양)",
"sexCd": "M",
"neuterYn": "Y",
"specialMark": "온순함",
"careRegNo": "328353202600002",
"careNm": "보람동물병원",
"careTel": "032-429-1673",
"careAddr": "인천광역시 남동구 문화서로3번길 7 (구월동) ",
"careOwnerNm": "조길영",
"orgNm": "인천광역시 남동구",
"vaccinationChk": "광견병,종합백신",
"healthChk": "사상충,파보,홍역",
"updTm": "2026-04-17 14:32:59.0"
},
{
"desertionNo": "428353202600210",
"rfidCd": "410097800628216",
"happenDt": "20260331",
"happenPlace": "구월동 1409-24",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "갈색",
"age": "2024(년생)",
"weight": "11.45(Kg)",
"noticeNo": "인천-남동-2026-00092",
"noticeSdt": "20260403",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202603311603353.jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202603311603397[2].jpg",
"processState": "종료(반환)",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "구부러진 귀와 진한 갈색 귀털, 인절미 같음",
"careRegNo": "328353202600003",
"careNm": "길동물병원",
"careTel": "032-467-1275",
"careAddr": "인천광역시 남동구 구월로 317 (만수동) ",
"careOwnerNm": "이광호",
"orgNm": "인천광역시 남동구",
"healthChk": "사상충,파보,코로나,홍역,원충",
"etcBigo": "-",
"updTm": "2026-04-03 12:57:57.0"
},
{
"desertionNo": "446499202600064",
"happenDt": "20260331",
"happenPlace": "금일읍 감목길53-1",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "흰색",
"age": "2025(년생)",
"weight": "5(Kg)",
"noticeNo": "전남-완도-2026-00064",
"noticeSdt": "20260402",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604020904766.jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/20260402090407.jpg",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "N",
"specialMark": "흰색",
"careRegNo": "346499201300001",
"careNm": "유기동물임시보호센터",
"careTel": "061-550-5749",
"careAddr": "전라남도 완도군 신지면 신지로6번길 23-89 (신지면) ",
"careOwnerNm": "완도군수",
"orgNm": "전라남도 완도군",
"updTm": "2026-04-02 09:28:04.0"
},
{
"desertionNo": "443444202600053",
"happenDt": "20260331",
"happenPlace": "영동읍 화신리",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "흰색",
"age": "2025(년생)",
"weight": "11.6(Kg)",
"noticeNo": "충북-영동-2026-00033",
"noticeSdt": "20260402",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604010904375.jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604010904414.jpg",
"processState": "보호중",
"sexCd": "M",
"neuterYn": "U",
"specialMark": "미등록, 매우 난폭함",
"careRegNo": "343444200900002",
"careNm": "최종주동물병원",
"careTel": "043-744-4209",
"careAddr": "충청북도 영동군 영동읍 계산로 54 (영동읍, 최종주동물병원) ",
"careOwnerNm": "최종주",
"orgNm": "충청북도 영동군",
"updTm": "2026-04-01 09:38:32.0"
},
{
"desertionNo": "441559202600302",
"happenDt": "20260331",
"happenPlace": "경기 양주시 산북동 산 53-2",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "갈색",
"age": "2022(년생)",
"weight": "15(Kg)",
"noticeNo": "경기-양주-2026-00132",
"noticeSdt": "20260402",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011504785[1].jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011504800[2].jpg",
"processState": "종료(안락사)",
"sexCd": "F",
"neuterYn": "U",
"specialMark": "온순. 얌전. 사람 좋아함. 파란 바탕 노란 줄 목줄. 눈곱. 코 갈색. 치석. 꼬리 단미 안됨. 털 약간 때탐. ",
"careRegNo": "341559200900001",
"careNm": "한국동물구조관리협회",
"careTel": "031-867-9119",
"careAddr": "경기도 양주시 남면 감악산로 63-37 (남면) ",
"careOwnerNm": "김철훈",
"orgNm": "경기도 양주시",
"updTm": "2026-04-22 16:11:47.0",
"endReason": "보호기간종료"
},
{
"desertionNo": "441559202600301",
"happenDt": "20260331",
"happenPlace": "경기 양주시 산북동 산 53-2",
"kindFullNm": "[개] 믹스견",
"upKindCd": "417000",
"upKindNm": "개",
"kindCd": "000114",
"kindNm": "믹스견",
"colorCd": "흰색",
"age": "2024(년생)",
"weight": "10(Kg)",
"noticeNo": "경기-양주-2026-00131",
"noticeSdt": "20260402",
"noticeEdt": "20260413",
"popfile1": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011504223[2].jpg",
"popfile2": "http://openapi.animal.go.kr/openapi/service/rest/fileDownloadSrvc/files/shelter/2026/03/202604011504238[2].jpg",
"processState": "종료(안락사)",
"sexCd": "F",
"neuterYn": "U",
"specialMark": "경계. 겁 있음. 방어적 입질. 눈곱. 꼬리 단미 안됨. 털 때탐. ",
"careRegNo": "341559200900001",
"careNm": "한국동물구조관리협회",
"careTel": "031-867-9119",
"careAddr": "경기도 양주시 남면 감악산로 63-37 (남면) ",
"careOwnerNm": "김철훈",
"orgNm": "경기도 양주시",
"updTm": "2026-04-22 16:10:49.0",
"endReason": "보호기간종료"
}
]
},
"numOfRows": 10,
"pageNo": 1,
"totalCount": 6492
}
}
}

---

{
"response": {
"header": {
"reqNo": 49383038,
"resultCode": "00",
"resultMsg": "NORMAL SERVICE."
},
"body": {
"items": {
"item": [
{
"orgCd": "6110000",
"orgdownNm": "서울특별시"
},
{
"orgCd": "6260000",
"orgdownNm": "부산광역시"
},
{
"orgCd": "6270000",
"orgdownNm": "대구광역시"
},
{
"orgCd": "6280000",
"orgdownNm": "인천광역시"
},
{
"orgCd": "6290000",
"orgdownNm": "광주광역시"
},
{
"orgCd": "5690000",
"orgdownNm": "세종특별자치시"
},
{
"orgCd": "6300000",
"orgdownNm": "대전광역시"
},
{
"orgCd": "6310000",
"orgdownNm": "울산광역시"
},
{
"orgCd": "6410000",
"orgdownNm": "경기도"
},
{
"orgCd": "6530000",
"orgdownNm": "강원특별자치도"
}
]
},
"numOfRows": 10,
"pageNo": 1,
"totalCount": 17
}
}
}

---

{
"response": {
"header": {
"reqNo": 49383044,
"resultCode": "00",
"resultMsg": "NORMAL SERVICE."
},
"body": {
"items": {
"item": [
{
"uprCd": "6110000",
"orgCd": "6119999",
"orgdownNm": "가정보호"
},
{
"uprCd": "6110000",
"orgCd": "3220000",
"orgdownNm": "강남구"
},
{
"uprCd": "6110000",
"orgCd": "3240000",
"orgdownNm": "강동구"
},
{
"uprCd": "6110000",
"orgCd": "3080000",
"orgdownNm": "강북구"
},
{
"uprCd": "6110000",
"orgCd": "3150000",
"orgdownNm": "강서구"
},
{
"uprCd": "6110000",
"orgCd": "3200000",
"orgdownNm": "관악구"
},
{
"uprCd": "6110000",
"orgCd": "3040000",
"orgdownNm": "광진구"
},
{
"uprCd": "6110000",
"orgCd": "3160000",
"orgdownNm": "구로구"
},
{
"uprCd": "6110000",
"orgCd": "3170000",
"orgdownNm": "금천구"
},
{
"uprCd": "6110000",
"orgCd": "3100000",
"orgdownNm": "노원구"
}
]
},
"numOfRows": 10,
"pageNo": 1,
"totalCount": 27
}
}
}

---

{
"response" : {
"header" : {
"reqNo" : 49383048,
"resultCode" : "00",
"resultMsg" : "NORMAL SERVICE."
},
"body" : {
"items" : {
"item" : [ {
"careRegNo" : "311322200900001",
"careNm" : "한국동물구조관리협회"
}, {
"careRegNo" : "311322200900001",
"careNm" : "한국동물구조관리협회"
}, {
"careRegNo" : "311322200900001",
"careNm" : "한국동물구조관리협회"
} ]
},
"numOfRows" : 10,
"pageNo" : 1,
"totalCount" : 3
}
}
}

---

{
"response": {
"header": {
"reqNo": 49383059,
"resultCode": "00",
"resultMsg": "NORMAL SERVICE."
},
"body": {
"items": {
"item": [
{
"kindCd": "000245",
"kindNm": "고든 세터"
},
{
"kindCd": "000054",
"kindNm": "골든 리트리버"
},
{
"kindCd": "000056",
"kindNm": "그레이 하운드"
},
{
"kindCd": "000055",
"kindNm": "그레이트 덴"
},
{
"kindCd": "000118",
"kindNm": "그레이트 피레니즈"
},
{
"kindCd": "000249",
"kindNm": "그리펀 벨지언"
},
{
"kindCd": "000115",
"kindNm": "기타"
},
{
"kindCd": "000037",
"kindNm": "꼬똥 드 뚤레아"
},
{
"kindCd": "000081",
"kindNm": "네오폴리탄 마스티프"
},
{
"kindCd": "000204",
"kindNm": "노르포크 테리어"
}
]
},
"numOfRows": 10,
"pageNo": 1,
"totalCount": 206
}
}
}

---

{
"response" : {
"header" : {
"reqNo" : 49383066,
"resultCode" : "00",
"resultMsg" : "NORMAL SERVICE."
},
"body" : {
"items" : {
"item" : [ {
"careNm" : "(사)대구수의사회",
"careRegNo" : "327346201500001",
"orgNm" : "대구광역시 수성구",
"divisionNm" : "법인",
"saveTrgtAnimal" : "개+고양이+기타",
"careAddr" : "대구광역시 북구 호국로 229 (서변동) 6층",
"jibunAddr" : " 6층",
"lat" : 35.922276,
"lng" : 128.59904,
"dsignationDate" : "2017-01-01",
"weekOprStime" : "00:00",
"weekOprEtime" : "24:00",
"closeDay" : "0",
"vetPersonCnt" : 0,
"specsPersonCnt" : 0,
"careTel" : "053-764-3708",
"dataStdDt" : "2025-01-03"
}, {
"careNm" : "(사)동물보호관리협회",
"careRegNo" : "348535202400001",
"orgNm" : "경상남도 김해시",
"divisionNm" : "법인",
"saveTrgtAnimal" : "개+고양이+기타",
"careAddr" : "부산광역시 강서구 가락대로1283번길 25-2 (봉림동) ",
"jibunAddr" : " ",
"lat" : 35.178925,
"lng" : 128.89975,
"dsignationDate" : "2025-01-01",
"weekOprStime" : "09:00",
"weekOprEtime" : "17:00",
"weekCellStime" : "13:00",
"weekCellEtime" : "15:00",
"closeDay" : "토요일+일요일",
"vetPersonCnt" : 1,
"specsPersonCnt" : 6,
"medicalCnt" : 1,
"breedCnt" : 1,
"quarabtineCnt" : 1,
"feedCnt" : 1,
"transCarCnt" : 3,
"careTel" : "051-971-6208",
"dataStdDt" : "2026-01-02"
}, {
"careNm" : "(사)동부동물보호협회",
"careRegNo" : "326338201300001",
"orgNm" : "부산광역시 수영구",
"divisionNm" : "법인",
"saveTrgtAnimal" : "개+고양이+기타",
"careAddr" : "부산광역시 해운대구 송정2로13번길 46 (송정동) ",
"jibunAddr" : " ",
"lat" : 35.194817,
"lng" : 129.20631,
"dsignationDate" : "2025-11-14",
"weekOprStime" : "09:00",
"weekOprEtime" : "18:00",
"weekCellStime" : "14:00",
"weekCellEtime" : "16:00",
"weekendOprStime" : "10:00",
"weekendOprEtime" : "14:00",
"weekendCellStime" : "10:00",
"weekendCellEtime" : "13:00",
"closeDay" : "일요일",
"vetPersonCnt" : 2,
"specsPersonCnt" : 5,
"medicalCnt" : 3,
"breedCnt" : 15,
"quarabtineCnt" : 3,
"feedCnt" : 1,
"transCarCnt" : 3,
"careTel" : "051-701-7599",
"dataStdDt" : "2026-01-20"
}, {
"careNm" : "(사)동부동물보호협회",
"careRegNo" : "326331201100001",
"orgNm" : "부산광역시 남구",
"divisionNm" : "법인",
"saveTrgtAnimal" : "개+고양이+기타",
"careAddr" : "부산광역시 해운대구 송정2로13번길 46 (송정동) ",
"jibunAddr" : "부산광역시 해운대구 송정동 85-1 ",
"lat" : 35.181606,
"lng" : 129.19846,
"dsignationDate" : "2024-01-01",
"weekOprStime" : "09:00",
"weekOprEtime" : "18:00",
"weekCellStime" : "14:00",
"weekCellEtime" : "16:00",
"weekendOprStime" : "10:00",
"weekendOprEtime" : "14:00",
"weekendCellStime" : "10:00",
"weekendCellEtime" : "13:00",
"closeDay" : "일요일",
"vetPersonCnt" : 2,
"specsPersonCnt" : 5,
"medicalCnt" : 3,
"breedCnt" : 15,
"quarabtineCnt" : 3,
"feedCnt" : 1,
"transCarCnt" : 3,
"careTel" : "051-701-7599",
"dataStdDt" : "2024-11-27"
}, {
"careNm" : "(사)동부동물보호협회",
"careRegNo" : "326330202400001",
"orgNm" : "부산광역시 동래구",
"divisionNm" : "법인",
"saveTrgtAnimal" : "개+고양이+기타",
"careAddr" : "부산광역시 해운대구 송정2로13번길 46 (송정동) ",
"jibunAddr" : "부산광역시 해운대구 송정동 85-1 ",
"lat" : 35.194817,
"lng" : 129.20631,
"dsignationDate" : "2025-01-01",
"weekOprStime" : "09:00",
"weekOprEtime" : "18:00",
"closeDay" : "토요일+일요일",
"vetPersonCnt" : 2,
"specsPersonCnt" : 4,
"careTel" : "051-701-7599",
"dataStdDt" : "2025-01-20"
}, {
"careNm" : "(사)영일동물플러스",
"careRegNo" : "347502201600001",
"orgNm" : "경상북도 포항시",
"divisionNm" : "단체",
"saveTrgtAnimal" : "개+고양이+야생동물",
"careAddr" : "경상북도 포항시 북구 흥해읍 덕장길 224 (흥해읍) ",
"jibunAddr" : " ",
"lat" : 36.145683,
"lng" : 129.33263,
"dsignationDate" : "2019-07-01",
"weekOprStime" : "09:00",
"weekOprEtime" : "18:00",
"closeDay" : "0",
"vetPersonCnt" : 2,
"specsPersonCnt" : 5,
"medicalCnt" : 1,
"breedCnt" : 6,
"quarabtineCnt" : 1,
"feedCnt" : 1,
"transCarCnt" : 1,
"careTel" : "054-262-8295",
"dataStdDt" : "2025-07-01"
}, {
"careNm" : "119동물병원",
"careRegNo" : "327348201700003",
"orgNm" : "대구광역시 달성군",
"divisionNm" : "동물병원",
"saveTrgtAnimal" : "개+고양이",
"careAddr" : "대구광역시 달성군 다사읍 달구벌대로 893 (다사읍, 대실요양병원 장례식장) 다사읍 관할",
"jibunAddr" : " 다사읍 관할",
"lat" : 35.857166,
"lng" : 128.46654,
"dsignationDate" : "2017-02-01",
"weekOprStime" : "09:30",
"weekOprEtime" : "18:30",
"weekCellStime" : "09:30",
"weekCellEtime" : "18:30",
"weekendOprStime" : "09:30",
"weekendOprEtime" : "16:00",
"weekendCellStime" : "09:30",
"weekendCellEtime" : "16:00",
"closeDay" : "일요일",
"vetPersonCnt" : 1,
"specsPersonCnt" : 1,
"medicalCnt" : 1,
"breedCnt" : 1,
"quarabtineCnt" : 1,
"feedCnt" : 1,
"transCarCnt" : 1,
"careTel" : "053-585-1195",
"dataStdDt" : "2025-01-31"
}, {
"careNm" : "24시센트럴동물메디컬",
"careRegNo" : "311303202500006",
"orgNm" : "서울특별시 성동구",
"divisionNm" : "동물병원",
"saveTrgtAnimal" : "개+고양이",
"careAddr" : "서울특별시 성동구 고산자로 207 (행당동) ",
"jibunAddr" : "서울특별시 성동구 행당동 318-36 무학빌딩 ",
"lat" : 37.55869,
"lng" : 127.03371,
"dsignationDate" : "2025-03-05",
"weekOprStime" : "00:00",
"weekOprEtime" : "24:00",
"closeDay" : "0",
"vetPersonCnt" : 13,
"specsPersonCnt" : 15,
"careTel" : "02-3395-7975"
}, {
"careNm" : "24시아이동물메디컬",
"careRegNo" : "341386200900001",
"orgNm" : "경기도 부천시",
"divisionNm" : "동물병원",
"saveTrgtAnimal" : "개+고양이+등",
"careAddr" : "경기도 부천시 오정구 소사로 779 (원종동) 201호",
"jibunAddr" : "경기도 부천시 원종동 229-8 뉴월드프라자 201호",
"lat" : 37.52566,
"lng" : 126.804565,
"dsignationDate" : "2021-01-01",
"weekOprStime" : "00:00",
"weekOprEtime" : "24:00",
"closeDay" : "0",
"vetPersonCnt" : 7,
"specsPersonCnt" : 5,
"careTel" : "032-677-5262",
"dataStdDt" : "2025-01-10"
}, {
"careNm" : "25세 동물병원",
"careRegNo" : "347522202600002",
"orgNm" : "경상북도 칠곡군",
"divisionNm" : "동물병원",
"saveTrgtAnimal" : "고양이",
"careAddr" : "경상북도 칠곡군 왜관읍 석전로7길 1  ",
"jibunAddr" : "경상북도 칠곡군 왜관읍 석전리 536-8 ",
"lat" : 36.00085,
"lng" : 128.40858,
"dsignationDate" : "2021-05-18",
"weekOprStime" : "09:00",
"weekOprEtime" : "18:00",
"closeDay" : "토요일+일요일",
"vetPersonCnt" : 1,
"specsPersonCnt" : 1,
"careTel" : "054-974-0975"
} ]
},
"numOfRows" : 10,
"pageNo" : 1,
"totalCount" : 793
}
}
}

---

{
"response": {
"header": {
"reqNo": 49383067,
"resultCode": "00",
"resultMsg": "NORMAL SERVICE."
},
"body": {
"items": {
"item": [
{
"orgCd": "6110000",
"orgdownNm": "서울특별시"
},
{
"orgCd": "6260000",
"orgdownNm": "부산광역시"
},
{
"orgCd": "6270000",
"orgdownNm": "대구광역시"
},
{
"orgCd": "6280000",
"orgdownNm": "인천광역시"
},
{
"orgCd": "6290000",
"orgdownNm": "광주광역시"
},
{
"orgCd": "5690000",
"orgdownNm": "세종특별자치시"
},
{
"orgCd": "6300000",
"orgdownNm": "대전광역시"
},
{
"orgCd": "6310000",
"orgdownNm": "울산광역시"
},
{
"orgCd": "6410000",
"orgdownNm": "경기도"
},
{
"orgCd": "6530000",
"orgdownNm": "강원특별자치도"
}
]
},
"numOfRows": 10,
"pageNo": 1,
"totalCount": 17
}
}
}
# Mock JSON_260417Fri

파일 명세를 다시 확인할 필요 없이 이전 API 명세와 공공 API 실제 응답 구조(file:8, file:9, file:10)를 그대로 씁니다.

---

# **Mock JSON 파일 (공공 API 응답 구조 기반)**

> **폴더 구조 제안: 프론트 루트에 `/mock/` 폴더 생성 후 아래 파일들을 배치하세요.
실제 API로 교체할 때는 `fetch('/mock/animals.json')` → `fetch('/api/animals')`로 경로만 바꾸면 됩니다.**
>

---

## **📁 폴더 구조**

`/mock
├── animals.json          ← A-1 구조동물 목록
├── animal_detail.json    ← A-2 구조동물 상세
├── codes_sido.json       ← C-1 시도 목록
├── codes_sigungu.json    ← C-2 시군구 목록
├── codes_shelters.json   ← C-3 보호소 드롭다운
├── shelters.json         ← D-1 보호소 지도용 전체
├── auth_login.json       ← F-2 로그인 응답
├── auth_me.json          ← F-3 내 정보
├── likes.json            ← B-1 관심 동물 목록
├── match_result.json     ← E-1 설문 매칭 결과
├── stats_summary.json    ← G-1 통계 카운터
└── stats_chart.json      ← G-2 통계 차트`

---

## **🐾 animals.json (A-1)**

20건 중 핵심 케이스만 8건으로 압축. **고의로 null 필드를 섞어** 프론트 방어 코드를 테스트합니다.

` {
"success": true,
"data": {
  "items": [
    {
      "desertionNo": "448531202600375",
      "happenDt": "20260324",
      "happenPlace": "진주시 대곡면 단목리 1065-11",
      "kindFullNm": "[개] 믹스견",
      "upKindCd": "417000",
      "upKindNm": "개",
      "kindCd": "000114",
      "kindNm": "믹스견",
      "colorCd": "흰색",
      "age": "2022(년생)",
      "weight": "3(Kg)",
      "noticeNo": "경남-진주-2026-00073",
      "noticeSdt": "20260325",
      "noticeEdt": "20260406",
      "popfile1": "https://placedog.net/300/300?id=1",
      "popfile2": "https://placedog.net/300/300?id=2",
      "processState": "보호중",
      "sexCd": "M",
      "neuterYn": "N",
      "specialMark": "겁많고 엄살있음",
      "careRegNo": "348531201000001",
      "careNm": "진주시동물보호센터",
      "careTel": "055-749-6134",
      "careAddr": "경상남도 진주시 집현면 신당길207번길 22",
      "orgNm": "경상남도 진주시",
      "updTm": "2026-03-24 17:26:41.0"
    },
    {
      "desertionNo": "448567202600324",
      "happenDt": "20260324",
      "happenPlace": "마산합포구 반월동 84-13",
      "kindFullNm": "[개] 푸들",
      "upKindCd": "417000",
      "upKindNm": "개",
      "kindCd": "000128",
      "kindNm": "푸들",
      "colorCd": "갈색",
      "age": "2016(년생)",
      "weight": "6(Kg)",
      "noticeNo": "경남-창원1-2026-00184",
      "noticeSdt": "20260324",
      "noticeEdt": "20260403",
      "popfile1": "https://placedog.net/300/300?id=3",
      "popfile2": null,
      "processState": "보호중",
      "sexCd": "F",
      "neuterYn": "Y",
      "specialMark": "온순함, 손에 익숙",
      "careRegNo": "348527200900001",
      "careNm": "창원동물보호센터",
      "careTel": "055-225-5701",
      "careAddr": "경상남도 창원시 성산구 공단로474번길 117",
      "orgNm": "경상남도 창원시",
      "updTm": "2026-03-24 16:41:54.0"
    },
    {
      "desertionNo": "111101202600088",
      "happenDt": "20260320",
      "happenPlace": "강남구 역삼동 테헤란로 일대",
      "kindFullNm": "[고양이] 코리안숏헤어",
      "upKindCd": "422400",
      "upKindNm": "고양이",
      "kindCd": "000155",
      "kindNm": "코리안숏헤어",
      "colorCd": "고등어",
      "age": "2024(년생)",
      "weight": "2.5(Kg)",
      "noticeNo": "서울-강남-2026-00088",
      "noticeSdt": "20260321",
      "noticeEdt": "20260401",
      "popfile1": "https://picsum.photos/seed/cat1/300/300",
      "popfile2": "https://picsum.photos/seed/cat2/300/300",
      "processState": "공고중",
      "sexCd": "F",
      "neuterYn": "U",
      "specialMark": "도심 길고양이, 경계심 강함",
      "careRegNo": "211100202100001",
      "careNm": "서울특별시동물보호센터",
      "careTel": "02-1234-5678",
      "careAddr": "서울특별시 강남구 자곡로 174-25",
      "orgNm": "서울특별시 강남구",
      "updTm": "2026-03-21 10:00:00.0"
    },
    {
      "desertionNo": "111101202600089",
      "happenDt": "20260318",
      "happenPlace": "종로구 창경궁로 주변",
      "kindFullNm": "[고양이] 러시안블루",
      "upKindCd": "422400",
      "upKindNm": "고양이",
      "kindCd": "000164",
      "kindNm": "러시안블루",
      "colorCd": "회색",
      "age": "2023(년생)",
      "weight": "4(Kg)",
      "noticeNo": "서울-종로-2026-00055",
      "noticeSdt": "20260319",
      "noticeEdt": "20260329",
      "popfile1": "https://picsum.photos/seed/cat3/300/300",
      "popfile2": null,
      "processState": "공고중",
      "sexCd": "M",
      "neuterYn": "Y",
      "specialMark": "내장칩 있음, 집고양이 추정",
      "careRegNo": "211100202100001",
      "careNm": "서울특별시동물보호센터",
      "careTel": "02-1234-5678",
      "careAddr": "서울특별시 종로구 자하문로 36",
      "orgNm": "서울특별시 종로구",
      "updTm": "2026-03-19 14:30:00.0"
    },
    {
      "desertionNo": "641100202600210",
      "happenDt": "20260315",
      "happenPlace": "수원시 팔달구 인계동",
      "kindFullNm": "[개] 시바",
      "upKindCd": "417000",
      "upKindNm": "개",
      "kindCd": "000100",
      "kindNm": "시바",
      "colorCd": "기타(블랙탄)",
      "age": "2021(년생)",
      "weight": "9(Kg)",
      "noticeNo": "경기-수원-2026-00210",
      "noticeSdt": "20260316",
      "noticeEdt": "20260326",
      "popfile1": "https://placedog.net/300/300?id=4",
      "popfile2": "https://placedog.net/300/300?id=5",
      "processState": "보호중",
      "sexCd": "M",
      "neuterYn": "Y",
      "specialMark": "사람 좋아함, 다른 개 경계",
      "careRegNo": "348100202200001",
      "careNm": "수원시동물보호센터",
      "careTel": "031-228-3456",
      "careAddr": "경기도 수원시 팔달구 인계로 123",
      "orgNm": "경기도 수원시",
      "updTm": "2026-03-16 09:00:00.0"
    },
    {
      "desertionNo": "429900202600001",
      "happenDt": "20260310",
      "happenPlace": "부산 해운대구 반여동",
      "kindFullNm": "[기타] 토끼",
      "upKindCd": "429900",
      "upKindNm": "기타",
      "kindCd": "000200",
      "kindNm": "토끼",
      "colorCd": "흰색",
      "age": "2025(년생)",
      "weight": "1.5(Kg)",
      "noticeNo": "부산-해운대-2026-00001",
      "noticeSdt": "20260311",
      "noticeEdt": "20260321",
      "popfile1": "https://picsum.photos/seed/rabbit1/300/300",
      "popfile2": null,
      "processState": "보호중",
      "sexCd": "Q",
      "neuterYn": "U",
      "specialMark": "온순, 특이사항 없음",
      "careRegNo": "226000201800001",
      "careNm": "부산해운대동물보호센터",
      "careTel": "051-749-4000",
      "careAddr": "부산광역시 해운대구 반여로 100",
      "orgNm": "부산광역시 해운대구",
      "updTm": "2026-03-11 11:00:00.0"
    },
    {
      "desertionNo": "641100202600055",
      "happenDt": "20260301",
      "happenPlace": "고양시 일산동구 마두동",
      "kindFullNm": "[개] 골든 리트리버",
      "upKindCd": "417000",
      "upKindNm": "개",
      "kindCd": "000044",
      "kindNm": "골든 리트리버",
      "colorCd": "황금색",
      "age": "2019(년생)",
      "weight": "28(Kg)",
      "noticeNo": "경기-고양-2026-00055",
      "noticeSdt": "20260302",
      "noticeEdt": "20260312",
      "popfile1": "https://placedog.net/300/300?id=6",
      "popfile2": null,
      "processState": "보호중",
      "sexCd": "F",
      "neuterYn": "Y",
      "specialMark": "사회성 매우 좋음, 훈련된 개 추정, 내장칩 없음",
      "careRegNo": "348100202200002",
      "careNm": "고양시동물보호센터",
      "careTel": "031-909-9000",
      "careAddr": "경기도 고양시 일산동구 성석로 12",
      "orgNm": "경기도 고양시",
      "updTm": "2026-03-02 08:00:00.0"
    },
    {
      "desertionNo": "226000202600412",
      "happenDt": "20260228",
      "happenPlace": "부산 수영구 광안동",
      "kindFullNm": "[고양이] 샴",
      "upKindCd": "422400",
      "upKindNm": "고양이",
      "kindCd": "000161",
      "kindNm": "샴",
      "colorCd": "크림&브라운",
      "age": "2020(년생)",
      "weight": "3.8(Kg)",
      "noticeNo": "부산-수영-2026-00412",
      "noticeSdt": "20260301",
      "noticeEdt": "20260311",
      "popfile1": "https://picsum.photos/seed/cat4/300/300",
      "popfile2": "https://picsum.photos/seed/cat5/300/300",
      "processState": "보호중",
      "sexCd": "F",
      "neuterYn": "Y",
      "specialMark": "집고양이 추정, 사람 친화적",
      "careRegNo": "226000201800001",
      "careNm": "부산수영동물보호센터",
      "careTel": "051-610-4450",
      "careAddr": "부산광역시 수영구 수영로 200",
      "orgNm": "부산광역시 수영구",
      "updTm": "2026-03-01 13:00:00.0"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalCount": 5102,
    "totalPages": 256
  }
}
}`

---

## **🐾 animal_detail.json (A-2)**

상세 페이지용. **F-04 체크리스트 필드를 전부 포함**.

` {
"success": true,
"data": {
  "desertionNo": "448531202600375",
  "happenDt": "20260324",
  "happenPlace": "진주시 대곡면 단목리 1065-11",
  "kindFullNm": "[개] 믹스견",
  "upKindCd": "417000",
  "upKindNm": "개",
  "kindCd": "000114",
  "kindNm": "믹스견",
  "colorCd": "흰색",
  "age": "2022(년생)",
  "weight": "3(Kg)",
  "rfidCd": "",
  "noticeNo": "경남-진주-2026-00073",
  "noticeSdt": "20260325",
  "noticeEdt": "20260410",
  "popfile1": "https://placedog.net/600/600?id=1",
  "popfile2": "https://placedog.net/600/600?id=2",
  "popfile3": "https://placedog.net/600/600?id=3",
  "popfile4": null,
  "popfile5": null,
  "popfile6": null,
  "popfile7": null,
  "popfile8": null,
  "processState": "보호중",
  "sexCd": "M",
  "neuterYn": "N",
  "specialMark": "겁많고 엄살있음, 적응 후 애교 많음",
  "sfeSoci": "낯선 사람 경계 있음, 적응 후 친화적",
  "sfeHealth": "건강 양호, 구충 완료",
  "vaccinationChk": "광견병,종합백신",
  "healthChk": "사상충",
  "careRegNo": "348531201000001",
  "careNm": "진주시동물보호센터",
  "careTel": "055-749-6134",
  "careAddr": "경상남도 진주시 집현면 신당길207번길 22",
  "careOwnerNm": "농업기술센터소장",
  "orgNm": "경상남도 진주시",
  "adptnTitle": "입양 절차 안내",
  "adptnTxt": "입양 희망 시 보호소 방문 후 상담 필수. 입양 서약서 작성 후 진행됩니다.",
  "adptnConditionLimitTxt": "단독주택 또는 반려동물 동반 가능 주거지 거주자. 18세 이상.",
  "adptnSDate": "20260101",
  "adptnEDate": "20261231",
  "updTm": "2026-03-24 17:26:41.0",
  "isLiked": false
}
}`

---

## **🔽 codes_sido.json (C-1)**

` {
"success": true,
"data": [
  { "orgCd": "6110000", "orgdownNm": "서울특별시" },
  { "orgCd": "6260000", "orgdownNm": "부산광역시" },
  { "orgCd": "6270000", "orgdownNm": "대구광역시" },
  { "orgCd": "6280000", "orgdownNm": "인천광역시" },
  { "orgCd": "6290000", "orgdownNm": "광주광역시" },
  { "orgCd": "6300000", "orgdownNm": "대전광역시" },
  { "orgCd": "6310000", "orgdownNm": "울산광역시" },
  { "orgCd": "5690000", "orgdownNm": "세종특별자치시" },
  { "orgCd": "6410000", "orgdownNm": "경기도" },
  { "orgCd": "6530000", "orgdownNm": "강원특별자치도" },
  { "orgCd": "6430000", "orgdownNm": "충청북도" },
  { "orgCd": "6440000", "orgdownNm": "충청남도" },
  { "orgCd": "6450000", "orgdownNm": "전라북도" },
  { "orgCd": "6460000", "orgdownNm": "전라남도" },
  { "orgCd": "6470000", "orgdownNm": "경상북도" },
  { "orgCd": "6480000", "orgdownNm": "경상남도" },
  { "orgCd": "6500000", "orgdownNm": "제주특별자치도" }
]
}`

---

## **🔽 codes_sigungu.json (C-2)**

` {
"success": true,
"data": [
  { "uprCd": "6110000", "orgCd": "3010000", "orgdownNm": "강남구" },
  { "uprCd": "6110000", "orgCd": "3020000", "orgdownNm": "강동구" },
  { "uprCd": "6110000", "orgCd": "3030000", "orgdownNm": "강북구" },
  { "uprCd": "6110000", "orgCd": "3040000", "orgdownNm": "강서구" },
  { "uprCd": "6110000", "orgCd": "3050000", "orgdownNm": "관악구" },
  { "uprCd": "6110000", "orgCd": "3060000", "orgdownNm": "광진구" },
  { "uprCd": "6110000", "orgCd": "3070000", "orgdownNm": "구로구" },
  { "uprCd": "6110000", "orgCd": "3080000", "orgdownNm": "금천구" },
  { "uprCd": "6110000", "orgCd": "3090000", "orgdownNm": "노원구" },
  { "uprCd": "6110000", "orgCd": "3100000", "orgdownNm": "도봉구" }
]
}`

> **ℹ️ 실제로는 `uprCd`에 따라 다른 결과를 내야 하지만, Mock에서는 이 파일 하나를 어떤 시도에서도 공통으로 사용합니다. 실제 API 연결 시 자동으로 올바른 데이터가 옵니다.**
>

---

## **🔽 codes_shelters.json (C-3)**

` {
"success": true,
"data": [
  { "careRegNo": "211100202100001", "careNm": "서울특별시동물보호센터" },
  { "careRegNo": "211100202100002", "careNm": "강남구동물보호센터" },
  { "careRegNo": "211100202100003", "careNm": "마포구동물보호센터" }
]
}`

---

## **🗺️ shelters.json (D-1)**

지도 마커용. **`lat`/`lng` null 케이스를 의도적으로 포함**.

` {
"success": true,
"data": [
  {
    "careRegNo": "211100202100001",
    "careNm": "서울특별시동물보호센터",
    "careAddr": "서울특별시 강남구 자곡로 174-25",
    "careTel": "02-1234-5678",
    "lat": "37.4734",
    "lng": "127.0946",
    "weekOprStime": "0900",
    "weekOprEtime": "1800",
    "weekCellStime": "0900",
    "weekCellEtime": "1700",
    "weekendOprStime": "0900",
    "weekendOprEtime": "1700",
    "weekendCellStime": null,
    "weekendCellEtime": null,
    "closeDay": "일요일, 공휴일",
    "vetPersonCnt": "3",
    "specsPersonCnt": "5",
    "orgNm": "서울특별시 강남구",
    "saveTrgtAnimal": "개, 고양이"
  },
  {
    "careRegNo": "348531201000001",
    "careNm": "진주시동물보호센터",
    "careAddr": "경상남도 진주시 집현면 신당길207번길 22",
    "careTel": "055-749-6134",
    "lat": "35.1897",
    "lng": "128.1051",
    "weekOprStime": "0900",
    "weekOprEtime": "1800",
    "weekCellStime": "1000",
    "weekCellEtime": "1600",
    "weekendOprStime": "0900",
    "weekendOprEtime": "1700",
    "weekendCellStime": "1000",
    "weekendCellEtime": "1600",
    "closeDay": "법정공휴일",
    "vetPersonCnt": "1",
    "specsPersonCnt": "3",
    "orgNm": "경상남도 진주시",
    "saveTrgtAnimal": "개, 고양이, 기타"
  },
  {
    "careRegNo": "348527200900001",
    "careNm": "창원동물보호센터",
    "careAddr": "경상남도 창원시 성산구 공단로474번길 117",
    "careTel": "055-225-5701",
    "lat": "35.2278",
    "lng": "128.6819",
    "weekOprStime": "0900",
    "weekOprEtime": "1800",
    "weekCellStime": "0900",
    "weekCellEtime": "1700",
    "weekendOprStime": null,
    "weekendOprEtime": null,
    "weekendCellStime": null,
    "weekendCellEtime": null,
    "closeDay": "토요일, 일요일, 공휴일",
    "vetPersonCnt": "2",
    "specsPersonCnt": "4",
    "orgNm": "경상남도 창원시",
    "saveTrgtAnimal": "개, 고양이"
  },
  {
    "careRegNo": "226000201800001",
    "careNm": "부산해운대동물보호센터",
    "careAddr": "부산광역시 해운대구 반여로 100",
    "careTel": "051-749-4000",
    "lat": null,
    "lng": null,
    "weekOprStime": "0900",
    "weekOprEtime": "1800",
    "weekCellStime": "0900",
    "weekCellEtime": "1700",
    "weekendOprStime": null,
    "weekendOprEtime": null,
    "weekendCellStime": null,
    "weekendCellEtime": null,
    "closeDay": "일요일",
    "vetPersonCnt": "1",
    "specsPersonCnt": "2",
    "orgNm": "부산광역시 해운대구",
    "saveTrgtAnimal": "개, 고양이"
  }
],
"meta": {
  "totalCount": 4,
  "cachedAt": "2026-03-30T09:00:00.000Z"
}
}`

---

## **👤 auth_login.json (F-2)**

` {
"success": true,
"data": {
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "nickname": "냥이집사"
  }
}
}`

---

## **👤 auth_me.json (F-3)**

` {
"success": true,
"data": {
  "userId": 1,
  "email": "user@example.com",
  "nickname": "냥이집사",
  "createdAt": "2026-03-01T12:00:00.000Z"
}
}`

---

## **❤️ likes.json (B-1)**

` {
"success": true,
"data": [
  {
    "desertionNo": "448531202600375",
    "kindFullNm": "[개] 믹스견",
    "processState": "보호중",
    "popfile1": "https://placedog.net/300/300?id=1",
    "careNm": "진주시동물보호센터",
    "noticeEdt": "20260410",
    "likedAt": "2026-03-29T20:00:00.000Z"
  },
  {
    "desertionNo": "111101202600088",
    "kindFullNm": "[고양이] 코리안숏헤어",
    "processState": "공고중",
    "popfile1": "https://picsum.photos/seed/cat1/300/300",
    "careNm": "서울특별시동물보호센터",
    "noticeEdt": "20260401",
    "likedAt": "2026-03-28T15:30:00.000Z"
  }
]
}`

---

## **🧩 match_result.json (E-1)**

` {
"success": true,
"data": {
  "matchedAnimals": [
    {
      "desertionNo": "448567202600324",
      "kindFullNm": "[개] 푸들",
      "processState": "보호중",
      "popfile1": "https://placedog.net/300/300?id=3",
      "careNm": "창원동물보호센터",
      "noticeEdt": "20260403",
      "sexCd": "F",
      "neuterYn": "Y",
      "age": "2016(년생)"
    },
    {
      "desertionNo": "641100202600055",
      "kindFullNm": "[개] 골든 리트리버",
      "processState": "보호중",
      "popfile1": "https://placedog.net/300/300?id=6",
      "careNm": "고양시동물보호센터",
      "noticeEdt": "20260312",
      "sexCd": "F",
      "neuterYn": "Y",
      "age": "2019(년생)"
    }
  ],
  "totalCount": 2,
  "queryParams": {
    "upkind": "417000",
    "sex_cd": "F",
    "neuter_yn": "Y",
    "upr_cd": "6410000",
    "state": "protect"
  }
}
}`

---

## **📊 stats_summary.json (G-1)**

공공 통계 API `se: "chart1"` 응답값 집계 결과.

` {
"success": true,
"data": {
  "totalRescued": 190503,
  "totalAdopted": 21138,
  "totalProtecting": 108283,
  "totalEuthanized": 16809,
  "totalNaturalDeath": 25613,
  "totalReturned": 13955,
  "period": {
    "from": "20240101",
    "to": "20260101"
  },
  "cachedAt": "2026-03-30T09:00:00.000Z"
}
}`

---

## **📊 stats_chart.json (G-2)**

` {
"success": true,
"data": {
  "chart1": [
    { "prcsNm": "보호중", "tot": 108283 },
    { "prcsNm": "자연사", "tot": 25613 },
    { "prcsNm": "입양", "tot": 21138 },
    { "prcsNm": "안락사", "tot": 16809 },
    { "prcsNm": "반환", "tot": 13955 },
    { "prcsNm": "기증", "tot": 3541 },
    { "prcsNm": "방사", "tot": 1164 }
  ],
  "chart2": [
    { "prcsNm": "인천광역시", "tot": 18.5 },
    { "prcsNm": "경상북도", "tot": 14.7 },
    { "prcsNm": "대구광역시", "tot": 14.2 },
    { "prcsNm": "경상남도", "tot": 12.1 },
    { "prcsNm": "경기도", "tot": 10.8 },
    { "prcsNm": "전라남도", "tot": 9.3 },
    { "prcsNm": "강원도", "tot": 7.6 },
    { "prcsNm": "충청남도", "tot": 6.9 },
    { "prcsNm": "기타", "tot": 5.9 }
  ],
  "period": {
    "from": "20240101",
    "to": "20260101"
  }
}
}`

---

## **⚙️ Mock 사용 방법 (프론트 코드 패턴)**

프론트는 아래처럼 환경 변수 하나로 Mock ↔ 실제 API를 전환하도록 짜면, 나중에 코드를 고칠 게 없습니다.

`javascript// constants.js
const USE_MOCK = true; // 개발 중엔 true, 백엔드 연결 시 false

const API_BASE = USE_MOCK ? '/mock' : '/api';

// 사용 예시
async function getAnimals(filters = {}) {
if (USE_MOCK) {
const res = await fetch('/mock/animals.json');
return res.json();
}
const params = new URLSearchParams(filters);
const res = await fetch(`/api/animals?${params}`);
return res.json();
}`

> **⚠️ 주의: 이미지 URL은 `via.placeholder.com`으로 채워뒀지만, 실제 공공 API 연결 후에는 `openapi.animal.go.kr`에서 직접 오는 URL로 교체됩니다. CORS 문제가 없는지 미리 테스트해두세요.**
>
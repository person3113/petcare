# **API 세부 명세 (프론트 즉시 사용 분 - v2 Clean)**

> **상태:** Phase 2 Clean DTO 반영 완료 (260503)  
> **원칙:** 프론트엔드 친화적인 필드명 및 구조 지향

---

## **🐾 A-1. 구조동물 목록 조회**

`GET /api/animals`

**연결 기능**: F-01 (카드 피드), F-02 (필터링), F-03 (스와이프)

## **Response 200**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "448531202600375",
        "discoveryDate": "2026-03-24",
        "discoveryPlace": "진주시 대곡면 단목리",
        "kind": "[개] 믹스견",
        "color": "흰색",
        "age": "2026(60일미만)(년생)",
        "weight": "3(Kg)",
        "noticeNumber": "경남-진주-2026-00073",
        "noticeStartDate": "2026-03-25",
        "noticeEndDate": "2026-04-06",
        "images": ["https://placedog.net/300/300?id=1"],
        "status": "보호중",
        "gender": "수컷",
        "isNeutered": "아니오",
        "description": "겁많고 엄살있음",
        "shelterName": "진주시동물보호센터",
        "shelterTel": "055-749-6134",
        "shelterAddr": "경상남도 진주시 집현면 신당길207번길 22",
        "jurisdiction": "경상남도 진주시",
        "updatedAt": "2026-03-24 17:26:41.0"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalCount": 5102,
      "totalPages": 256
    }
  }
}
```

---

## **🐾 A-2. 구조동물 상세 조회**

`GET /api/animals/:id`

## **Response 200**

```json
{
  "success": true,
  "data": {
    "id": "448531202600375",
    "discoveryDate": "2026-03-24",
    "discoveryPlace": "진주시 대곡면 단목리 1065-11",
    "kind": "[개] 믹스견",
    "color": "흰색",
    "age": "2022(년생)",
    "weight": "3(Kg)",
    "noticeNumber": "경남-진주-2026-00073",
    "noticeStartDate": "2026-03-25",
    "noticeEndDate": "2026-04-06",
    "images": [
      "https://placedog.net/300/300?id=1",
      "https://placedog.net/300/300?id=2"
    ],
    "status": "보호중",
    "gender": "수컷",
    "isNeutered": "아니오",
    "description": "겁많고 엄살있음",
    "socialization": "낯선 사람 경계",
    "healthStatus": "건강 양호",
    "shelterName": "진주시동물보호센터",
    "shelterTel": "055-749-6134",
    "shelterAddr": "경상남도 진주시 집현면 신당길207번길 22",
    "jurisdiction": "경상남도 진주시",
    "updatedAt": "2026-03-24 17:26:41.0",
    "isLiked": false
  }
}
```

---

## **🔽 C-1. 시도 목록 조회**

`GET /api/codes/sido`

## **Response 200**

```json
{
  "success": true,
  "data": [
    { "code": "6110000", "name": "서울특별시" },
    { "code": "6260000", "name": "부산광역시" }
  ]
}
```

---

## **🗺️ D-1. 보호소 전체 목록 (지도용)**

`GET /api/shelters`

## **Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": "348531201000001",
      "name": "진주시동물보호센터",
      "address": "경상남도 진주시 집현면 신당길207번길 22",
      "tel": "055-749-6134",
      "lat": 35.123456,
      "lng": 128.123456,
      "weekStartTime": "09:00",
      "weekEndTime": "18:00",
      "closedDays": "일요일, 공휴일",
      "targetAnimals": "개, 고양이"
    }
  ]
}
```

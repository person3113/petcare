# Mock JSON_260417Fri (v2 Clean)

> **상태:** Phase 2 Clean DTO 반영 완료  
> **위치:** `frontend/public/mock/*.json`

---

## **📁 폴더 구조**

`/frontend/public/mock
├── animals.json          ← 구조동물 목록
├── animal_detail.json    ← 구조동물 상세
├── codes_sido.json       ← 시도 목록
├── shelters.json         ← 보호소 지도용 전체
└── stats_summary.json    ← 통계 카운터`

---

## **🐾 animals.json**

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
        "images": ["https://placedog.net/300/300?id=1", "https://placedog.net/300/300?id=2"],
        "status": "보호중",
        "gender": "수컷",
        "isNeutered": "아니오",
        "noticeEndDate": "2026-04-10"
      },
      {
        "id": "448567202600324",
        "discoveryDate": "2026-03-24",
        "discoveryPlace": "마산합포구 반월동",
        "kind": "[개] 푸들",
        "images": ["https://placedog.net/300/300?id=3"],
        "status": "보호중",
        "gender": "암컷",
        "isNeutered": "예",
        "noticeEndDate": "2026-04-03"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 2,
      "totalPages": 1
    }
  }
}
```

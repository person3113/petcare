import KakaoMap from '../components/KakaoMap';
import sheltersDummy from '../mock/sheltersDummy';

// F-06: 전국 보호소 지도 페이지 (더미 데이터 기반)
// 나중에 sheltersDummy -> /api/shelters API 응답으로 교체 예정
function ShelterMapPage() {
  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
        전국 보호소 지도
      </h2>
      <p style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
        마커를 클릭하면 보호소 이름을 확인할 수 있습니다.
      </p>
      {/* 더미 보호소 데이터로 마커 렌더링 */}
      <KakaoMap shelters={sheltersDummy} />
    </div>
  );
}

export default ShelterMapPage;

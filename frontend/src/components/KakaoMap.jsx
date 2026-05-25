import { useEffect, useRef } from 'react';

// props: shelters = [{ id, name, lat, lng }, ...]
function KakaoMap({ shelters }) {
  const mapRef = useRef(null); // 지도를 렌더링할 div를 가리키는 ref

  useEffect(() => {
    // kakao 객체가 아직 로드되지 않았으면 종료
    if (!window.kakao || !window.kakao.maps) {
      console.log('카카오맵 객체가 없습니다. SDK 스크립트 로드 여부를 확인하세요.');
      return;
    }

    const container = mapRef.current; // 지도 컨테이너 div

    // 지도 초기 옵션: 대한민국 중심, 줌 레벨 7 (전국 보호소 분포 확인용)
    const options = {
      center: new window.kakao.maps.LatLng(36.5, 127.5),
      level: 7,
    };

    // 지도 생성
    const map = new window.kakao.maps.Map(container, options);

    // 보호소 목록을 순회하며 마커 생성
    shelters.forEach((shelter) => {
      const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lng);

      // 마커 생성 및 지도에 표시
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map);

      // 마커 클릭 시 보호소 이름을 InfoWindow로 표시
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px; font-size:13px;">${shelter.name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });
    });
  }, [shelters]); // shelters 배열이 바뀔 때마다 지도 다시 그리기

  return (
      <div
      ref={mapRef}
      className="h-[400px] w-full rounded-lg"
    />
  );
}

export default KakaoMap;

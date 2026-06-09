import { useEffect, useRef } from 'react';

function KakaoMap({ shelters, currentLocation, selectedShelter, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.log('맵 없음');
      return;
    }

    const container = mapRef.current;
    
    // 기본 설정
    let centerPosition = new window.kakao.maps.LatLng(36.5, 127.5);
    let level = 7;
    
    if (currentLocation) {
        centerPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        level = 5; // 줌 더
    }

    const options = {
      center: centerPosition,
      level: level,
    };

    if (!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(container, options);
    } else if (currentLocation && !selectedShelter) {
        mapInstance.current.setCenter(centerPosition);
        mapInstance.current.setLevel(level);
    }
  }, [currentLocation, selectedShelter]);

  useEffect(() => {
    if (!mapInstance.current || !selectedShelter) return;
    
    const position = new window.kakao.maps.LatLng(selectedShelter.lat, selectedShelter.lng);
    mapInstance.current.panTo(position);
  }, [selectedShelter]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // 기존 마커 제거
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // 현재 위치 마커
    if (currentLocation) {
        const currentPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        const content = '<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>';
        const customOverlay = new window.kakao.maps.CustomOverlay({
            position: currentPos,
            content: content,
            xAnchor: 0.5,
            yAnchor: 0.5
        });
        customOverlay.setMap(map);
        markersRef.current.push(customOverlay);
    }

    // 보호소 마커
    shelters.forEach((shelter) => {
      const position = new window.kakao.maps.LatLng(shelter.lat, shelter.lng);

      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map);
      markersRef.current.push(marker);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px; font-size:13px; color:black;">${shelter.name}</div>`,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, marker);
      });
      window.kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      window.kakao.maps.event.addListener(marker, 'click', function () {
        if (onMarkerClick) {
            onMarkerClick(shelter);
            map.panTo(position); // 마커 클릭 시 해당 위치로 지도 이동
        }
      });
    });
  }, [shelters, currentLocation, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
    />
  );
}

export default KakaoMap;

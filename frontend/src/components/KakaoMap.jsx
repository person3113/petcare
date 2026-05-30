import { useEffect, useRef } from 'react';

// props: shelters = [{ id, name, lat, lng }, ...]
function KakaoMap({ shelters, currentLocation, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.log('카카오맵 객체가 없습니다. SDK 스크립트 로드 여부를 확인하세요.');
      return;
    }

    const container = mapRef.current;
    
    // Default center
    let centerPosition = new window.kakao.maps.LatLng(36.5, 127.5);
    let level = 7;
    
    if (currentLocation) {
        centerPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        level = 5; // Zoom in closer if we have a location
    }

    const options = {
      center: centerPosition,
      level: level,
    };

    if (!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(container, options);
    }
  }, [currentLocation]); // Re-center on first location load

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Current location marker (Custom overlay)
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

    // Shelter markers
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
            map.panTo(position); // Smooth pan to clicked marker
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

import { useEffect, useState, useMemo } from 'react';
import KakaoMap from '../components/KakaoMap';
import { request } from '../api/http.js';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // km 거리 계산
  return d;
}

function countUrgentAnimals(animals) {
  if (!animals) return 0;
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  return animals.filter(a => {
    if (!a.noticeEndDate) return false;
    const endDate = new Date(a.noticeEndDate);
    return endDate >= now && endDate <= threeDaysLater;
  }).length;
}

const formatOperatingHours = (wStart, wEnd, wkStart, wkEnd, closed) => {
  let str = [];
  if (wStart && wEnd) str.push(`평일 ${wStart}~${wEnd}`);
  if (wkStart && wkEnd) str.push(`주말 ${wkStart}~${wkEnd}`);
  let closedStr = closed ? `휴무: ${closed}` : '';
  if (str.length === 0 && !closedStr) return "운영시간 정보 없음";
  
  return [str.join(' | '), closedStr].filter(Boolean).join(' | ');
};


function ShelterMapPage() {
  const [shelters, setShelters] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [shelterAnimals, setShelterAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const [tab, setTab] = useState('전체');
  const [searchParams] = useSearchParams(); //동물상세페이지에서 주소창에 전달한 보호소 이름 읽기 위한
  const targetName = searchParams.get('q'); //주소창에 q뒤에있는 보호소 이름만 가져오기

  useEffect(() => {
    // 전체 보호소 가져오기
    request('/api/shelters')
      .then((res) => setShelters(res?.data || []))
      .catch((err) => console.log('보호소 데이터 로딩 실패', err));

    // 내 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
          });
        },
        (error) => {
          console.log('위치 정보 로딩 실패', error);
        }
      );
    }
  }, []);

  const sortedShelters = useMemo(() => {
    if (!currentLocation || shelters.length === 0) return shelters;
    
    // 오픈API 데이터 중에 이름이 똑같은 중복 데이터가 있어서 이름으로 필터링
    const uniqueShelters = shelters.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

    return [...uniqueShelters]
      .map(s => ({
        ...s,
        distance: getDistance(currentLocation.lat, currentLocation.lng, s.lat, s.lng)
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [shelters, currentLocation]);

  const handleMarkerClick = (shelter) => {
    setSelectedShelter(shelter);
    setLoadingAnimals(true);
    // 선택한 보호소 동물들 불러오기
    request(`/api/animals?care_reg_no=${shelter.id}&limit=5`)
      .then(res => {
        setShelterAnimals(res?.data?.items || []);
        setLoadingAnimals(false);
      })
      .catch(err => {
        console.error('동물 데이터 로딩 실패', err);
        setShelterAnimals([]);
        setLoadingAnimals(false);
      });
  };

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
          });
        },
        (error) => {
          alert('위치 정보를 가져올 수 없습니다.');
        }
      );
    }
  };

  const displayShelters = selectedShelter ? [selectedShelter] : sortedShelters.slice(0, 10);
  const urgentCount = countUrgentAnimals(shelterAnimals);

  //주소창읽기
  useEffect(() => {
    if (shelters.length > 0 && targetName){
      const found = shelters.find(s => s.name === targetName);
      if (found){
        setTimeout(() => { handleMarkerClick(found);},0); //앞에 화면 다 그리고 난 후
      }

    }
  }, [shelters, targetName]);


  return (
    <div className="py-6 h-[calc(100vh-100px)] min-h-[600px] flex flex-col md:flex-row gap-6">
      
      {}
      <div className="relative flex-1 rounded-xl overflow-hidden shadow-md bg-gray-100 min-h-[300px]">
        <KakaoMap 
          shelters={shelters} 
          currentLocation={currentLocation} 
          selectedShelter={selectedShelter}
          onMarkerClick={handleMarkerClick} 
        />
        <button 
          onClick={handleRefreshLocation}
          className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 z-10 flex items-center gap-2"
        >
          <span className="text-xl">📍</span> 현재 위치
        </button>
      </div>

      {/* 사이드바  */}
      <div className="w-full md:w-[360px] flex flex-col bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden shrink-0">
        
        {/* 모바일 탭 */}
        <div className="md:hidden flex items-center gap-2 p-3 border-b border-gray-100 overflow-x-auto">
           <button onClick={() => { setSelectedShelter(null); setTab('전체'); }} className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${tab === '전체' && !selectedShelter ? 'bg-gray-900 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>내 주변</button>
        </div>

        <div className="p-5 border-b border-gray-100 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {selectedShelter ? '보호소 상세 정보' : '내 주변 보호소'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedShelter ? selectedShelter.name : (currentLocation ? '가까운 순 10곳' : '위치 정보가 필요합니다')}
            </p>
          </div>
          {selectedShelter && (
            <button 
              onClick={() => setSelectedShelter(null)}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              목록으로
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 min-h-[300px] md:min-h-0">
          {displayShelters.map((shelter) => (
            <div 
              key={shelter.id} 
              className={`bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm transition-all ${!selectedShelter ? 'cursor-pointer hover:border-orange-300 hover:shadow-md' : ''}`}
              onClick={() => !selectedShelter && handleMarkerClick(shelter)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-base">{shelter.name}</h3>
                {shelter.distance && (
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md shrink-0">
                    {shelter.distance.toFixed(1)}km
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">{shelter.address}</p>
              
              {/* 간략한 연락처 및 운영시간 */}
              <div className="text-[11px] text-gray-600 space-y-1 mb-3">
                <p className="flex items-center gap-1">📞 {shelter.tel || '전화번호 없음'}</p>
                <p className="flex items-center gap-1">🕒 {formatOperatingHours(shelter.weekStartTime, shelter.weekEndTime, shelter.weekendStartTime, shelter.weekendEndTime, shelter.closedDays)}</p>
              </div>

              {selectedShelter && selectedShelter.id === shelter.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* 시설 정보 더보기 */}
                  <details className="mb-4 text-xs group cursor-pointer">
                    <summary className="font-semibold text-gray-700 hover:text-blue-600 flex items-center outline-none list-none">
                      <span className="group-open:hidden mr-1">▶</span>
                      <span className="hidden group-open:inline mr-1">▼</span>
                      시설 및 인력 상세정보
                    </summary>
                    <div className="mt-2 bg-gray-50 p-3 rounded-lg grid grid-cols-2 gap-2 text-gray-600 cursor-default">
                      <p>수의사: <span className="font-semibold text-gray-800">{shelter.vetPersonCnt != null ? `${shelter.vetPersonCnt}명` : '-'}</span></p>
                      <p>사양관리사: <span className="font-semibold text-gray-800">{shelter.specsPersonCnt != null ? `${shelter.specsPersonCnt}명` : '-'}</span></p>
                      <p>진료실: <span className="font-semibold text-gray-800">{shelter.medicalCnt != null ? `${shelter.medicalCnt}실` : '-'}</span></p>
                      <p>격리실: <span className="font-semibold text-gray-800">{shelter.quarantineCnt != null ? `${shelter.quarantineCnt}실` : '-'}</span></p>
                      <p>사육실: <span className="font-semibold text-gray-800">{shelter.feedCnt != null ? `${shelter.feedCnt}실` : '-'}</span></p>
                      <p className="col-span-2 mt-1 border-t border-gray-200 pt-1">구조대상: <span className="font-semibold text-gray-800">{shelter.targetAnimals || '-'}</span></p>
                    </div>
                  </details>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-800">보호 중인 동물</span>
                    {urgentCount > 0 && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        긴급 {urgentCount}
                      </span>
                    )}
                  </div>
                  
                  {loadingAnimals ? (
                    <div className="text-xs text-gray-400 text-center py-4">동물 정보를 불러오는 중...</div>
                  ) : shelterAnimals.length > 0 ? (
                    <>
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {shelterAnimals.map(animal => (
                          <Link key={animal.id} to={`/animal/${animal.id}`} className="block min-w-[72px] w-[72px] group">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden mb-1 relative mx-auto">
                              <img src={animal.images?.[0] || 'https://via.placeholder.com/150'} alt={animal.kind} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          </Link>
                        ))}
                      </div>
                      {}
                      <Link 
                        to={`/animals?keyword=${shelter.name}`} 
                        className="block w-full text-center py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        이 보호소 동물 전체 보기
                      </Link>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-lg">보호 중인 동물이 없습니다.</div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {!selectedShelter && displayShelters.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-10">
              보호소를 찾을 수 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShelterMapPage;

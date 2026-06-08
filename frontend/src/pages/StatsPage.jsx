import React, { useState, useEffect, useMemo } from 'react';
import { getGlobalStats, getFilteredStats } from '../api/stats.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { SIDO_LIST } from '../constants.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

function StatsPage() {
  const [globalStats, setGlobalStats] = useState(null);
  const [filteredStats, setFilteredStats] = useState(null);
  
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  
  const [errorGlobal, setErrorGlobal] = useState('');
  const [errorFiltered, setErrorFiltered] = useState('');

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getThreeMonthsAgoStr = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [filters, setFilters] = useState({
    startDate: getThreeMonthsAgoStr(),
    endDate: getTodayStr(),
    sido: ''
  });

  // Fetch Global Stats on Mount
  useEffect(() => {
    function fetchGlobal() {
      setLoadingGlobal(true);
      setErrorGlobal('');
      getGlobalStats()
        .then(res => {
          setGlobalStats(res.data || res);
        })
        .catch(err => {
          setErrorGlobal('전역 통계 데이터를 불러오는데 실패했습니다.');
        })
        .finally(() => {
          setLoadingGlobal(false);
        });
    }
    fetchGlobal();
  }, []);

  // Fetch Filtered Stats when button is clicked or on initial load
  const fetchFiltered = () => {
    setLoadingFiltered(true);
    setErrorFiltered('');
    getFilteredStats(filters.startDate, filters.endDate, filters.sido)
      .then(res => {
        setFilteredStats(res.data || res);
      })
      .catch(err => {
        setErrorFiltered('상세 통계 데이터를 불러오는데 실패했습니다.');
      })
      .finally(() => {
        setLoadingFiltered(false);
      });
  };

  useEffect(() => {
    fetchFiltered();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    fetchFiltered();
  };

  // --- Global Chart Data ---
  let rescueTrendData = null;
  if (globalStats?.rescueTrend) {
    rescueTrendData = {
      labels: globalStats.rescueTrend.map(d => d.month),
      datasets: [{
        label: '구조 건수',
        data: globalStats.rescueTrend.map(d => d.count),
        borderColor: '#0ea5e9',
        backgroundColor: '#0ea5e9',
        tension: 0.3
      }]
    };
  }

  let lostVsRescueData = null;
  if (globalStats?.lostVsRescue) {
    lostVsRescueData = {
      labels: globalStats.lostVsRescue.map(d => d.month),
      datasets: [
        { label: '구조', data: globalStats.lostVsRescue.map(d => d.rescueCount), borderColor: '#0ea5e9', tension: 0.3 },
        { label: '분실', data: globalStats.lostVsRescue.map(d => d.lostCount), borderColor: '#f43f5e', tension: 0.3 }
      ]
    };
  }

  // --- Filtered Chart Data ---
  let regionalChartData = null;
  if (filteredStats?.regionalStats) {
    regionalChartData = {
      labels: filteredStats.regionalStats.map(d => d.region),
      datasets: [
        { label: '입양률 (%)', data: filteredStats.regionalStats.map(d => d.adoptionRate), backgroundColor: '#10b981' },
        { label: '안락사율 (%)', data: filteredStats.regionalStats.map(d => d.euthanasiaRate), backgroundColor: '#e11d48' }
      ]
    };
  }

  let statusChartData = null;
  if (filteredStats?.statusRatio) {
    statusChartData = {
      labels: filteredStats.statusRatio.map(d => d.status),
      datasets: [{
        data: filteredStats.statusRatio.map(d => d.count),
        backgroundColor: ['#f97316', '#e11d48', '#0ea5e9', '#10b981', '#64748b', '#f59e0b', '#8b5cf6', '#ec4899']
      }]
    };
  }

  let kindChartData = null;
  if (filteredStats?.kindRatio) {
    kindChartData = {
      labels: filteredStats.kindRatio.map(d => d.kind),
      datasets: [{
        data: filteredStats.kindRatio.map(d => d.count),
        backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6']
      }]
    };
  }

  let topBreedsData = null;
  if (filteredStats?.topBreeds) {
    topBreedsData = {
      labels: filteredStats.topBreeds.map(d => d.breed),
      datasets: [{
        label: '발생 건수',
        data: filteredStats.topBreeds.map(d => d.count),
        backgroundColor: '#8b5cf6'
      }]
    };
  }

  let lostHotspotsData = null;
  if (filteredStats?.lostHotspots) {
    lostHotspotsData = {
      labels: filteredStats.lostHotspots.map(d => d.region),
      datasets: [{
        label: '분실 건수',
        data: filteredStats.lostHotspots.map(d => d.count),
        backgroundColor: '#f43f5e'
      }]
    };
  }

  let topLostBreedsData = null;
  if (filteredStats?.topLostBreeds) {
    topLostBreedsData = {
      labels: filteredStats.topLostBreeds.map(d => d.breed),
      datasets: [{
        label: '분실 건수',
        data: filteredStats.topLostBreeds.map(d => d.count),
        backgroundColor: '#f59e0b'
      }]
    };
  }

  let topSheltersData = null;
  if (filteredStats?.topShelters) {
    topSheltersData = {
      labels: filteredStats.topShelters.map(d => d.shelter),
      datasets: [{
        label: '보호 개체 수',
        data: filteredStats.topShelters.map(d => d.count),
        backgroundColor: '#10b981'
      }]
    };
  }

  const defaultOptions = { responsive: true, maintainAspectRatio: false };
  const horizontalBarOptions = { indexAxis: 'y', responsive: true, maintainAspectRatio: false };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto bg-gray-50 min-h-screen space-y-12">
      
      {/* 1. Global Stats Section */}
      <section>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">전국 누적 통계</h1>
        <p className="text-lg text-gray-600 mb-8">전국의 유기동물 구조 및 분실 동향을 한눈에 파악하세요.</p>
        
        {loadingGlobal && <div className="text-gray-500 animate-pulse">불러오는 중...</div>}
        {errorGlobal && <div className="text-red-500">{errorGlobal}</div>}
        
        {!loadingGlobal && globalStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">기간별 구조 추세</h2>
              <div className="h-64"><Line data={rescueTrendData} options={defaultOptions} /></div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">분실 vs 구조 발생 추이</h2>
              <div className="h-64"><Line data={lostVsRescueData} options={defaultOptions} /></div>
            </div>
          </div>
        )}
      </section>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* 2. Detailed Filtered Stats Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">상세 분석</h2>
            <p className="text-gray-600">원하는 기간과 지역을 선택하여 상세 데이터를 확인하세요.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex flex-col text-sm text-gray-600 font-medium">
              시작일
              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="mt-1 px-3 py-2 border rounded-lg" />
            </label>
            <label className="flex flex-col text-sm text-gray-600 font-medium">
              종료일
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="mt-1 px-3 py-2 border rounded-lg" />
            </label>
            <label className="flex flex-col text-sm text-gray-600 font-medium">
              지역 (시도)
              <select name="sido" value={filters.sido} onChange={handleFilterChange} className="mt-1 px-3 py-2 border rounded-lg min-w-[120px]">
                <option value="">전국</option>
                {SIDO_LIST.map(s => (
                  <option key={s.code} value={s.name}>{s.name}</option>
                ))}
              </select>
            </label>
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              조회
            </button>
          </div>
        </div>

        {loadingFiltered && <div className="text-gray-500 animate-pulse text-center py-10">상세 데이터를 분석 중입니다...</div>}
        {errorFiltered && <div className="text-red-500 text-center py-10">{errorFiltered}</div>}

        {!loadingFiltered && filteredStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {filters.sido ? `${filters.sido} 내 시군구별 현황 비교 (입양/안락사)` : '전국 시도별 현황 비교 (입양/안락사)'}
              </h2>
              <div className="h-80"><Bar data={regionalChartData} options={defaultOptions} /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">구조동물 처리 현황</h2>
              <div className="h-64 max-w-sm mx-auto"><Doughnut data={statusChartData} options={defaultOptions} /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-4">축종별 현황 분석</h2>
              <div className="h-48 max-w-sm mx-auto mb-6"><Doughnut data={kindChartData} options={defaultOptions} /></div>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 border-t pt-4">
                {filteredStats.kindRatio.map((k, i) => (
                  <div key={i} className="text-center">
                    <span className="font-bold block text-gray-800 mb-1">{k.kind}</span>
                    {k.topBreeds && k.topBreeds.slice(0,3).map((b, idx) => (
                      <div key={idx} className="truncate" title={b.breed}>{b.breed} ({b.count})</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">유기 빈도 상위 품종 Top 10</h2>
              <div className="h-64"><Bar data={topBreedsData} options={horizontalBarOptions} /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">많이 잃어버리는 품종 Top 10</h2>
              <div className="h-64"><Bar data={topLostBreedsData} options={horizontalBarOptions} /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">지역별 분실 장소 Top 10</h2>
              <div className="h-64"><Bar data={lostHotspotsData} options={horizontalBarOptions} /></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">보호소별 보호 개체 수 Top 10</h2>
              <div className="h-64"><Bar data={topSheltersData} options={horizontalBarOptions} /></div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}

export default StatsPage;

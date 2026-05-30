import React, { useState, useEffect, useMemo } from 'react';
import { getNationalStatus, getRegionalRates } from '../api/stats.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function StatsPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [nationalStatus, setNationalStatus] = useState([]);
  const [regionalRates, setRegionalRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      if (!startDate || !endDate) return;
      
      const startStr = startDate.replace(/-/g, '');
      const endStr = endDate.replace(/-/g, '');
      
      setLoading(true);
      setError('');
      try {
        const [statusRes, ratesRes] = await Promise.all([
          getNationalStatus(startStr, endStr),
          getRegionalRates(startStr, endStr)
        ]);
        setNationalStatus(statusRes?.data || statusRes);
        setRegionalRates(ratesRes?.data || ratesRes);
      } catch (err) {
        console.error(err);
        setError('통계 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [startDate, endDate]);

  const statusChartData = useMemo(() => {
    if (!nationalStatus || nationalStatus.length === 0) return null;
    const labels = nationalStatus.map(item => item.label);
    const values = nationalStatus.map(item => item.value);
    
    return {
      labels,
      datasets: [
        {
          label: '전체 두수',
          data: values,
          backgroundColor: [
            '#f97316', '#e11d48', '#0ea5e9', '#10b981', '#64748b', '#f59e0b', '#8b5cf6', '#ec4899'
          ],
          borderWidth: 1,
        }
      ]
    };
  }, [nationalStatus]);

  const regionalChartData = useMemo(() => {
    if (!regionalRates || regionalRates.length === 0) return null;
    
    // sorting by adoption rate descending is already done in backend
    const labels = regionalRates.map(item => item.regionName);
    const adoptionRates = regionalRates.map(item => item.adoptionRate);
    const euthanasiaRates = regionalRates.map(item => item.euthanasiaRate);

    return {
      labels,
      datasets: [
        {
          label: '입양률 (%)',
          data: adoptionRates,
          backgroundColor: '#10b981',
          stack: 'Stack 0',
        },
        {
          label: '안락사율 (%)',
          data: euthanasiaRates,
          backgroundColor: '#e11d48',
          stack: 'Stack 1',
        }
      ]
    };
  }, [regionalRates]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">구조동물 상세 통계</h1>
      <p className="text-gray-600 mb-8">기간과 지역별 구조동물의 상태 및 비율을 분석합니다.</p>

      {/* 필터 영역 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex items-end gap-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">조회 시작일</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-40 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">조회 종료일</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-40 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="text-sm text-gray-500 ml-auto pb-2">
          ※ 기간이 길 경우 데이터 로딩에 다소 시간이 걸릴 수 있습니다.
        </div>
      </section>

      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">데이터를 불러오는 중입니다... (최대 10~15초 소요)</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-8">
          {/* 차트 1: 전국 상태별 전체 두수 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">전국 구조동물 상태별 두수</h2>
            {statusChartData && statusChartData.labels.length > 0 ? (
              <div className="max-w-[400px] mx-auto">
                <Doughnut data={statusChartData} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">해당 기간의 데이터가 없습니다.</p>
            )}
          </section>

          {/* 차트 2: 지역별 입양률 및 안락사율 */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">지자체 유기동물 통계 순위</h2>
            <p className="text-sm text-gray-500 mb-6">전국 17개 시도의 입양률 및 안락사율을 비교합니다. (입양률 순)</p>
            {regionalChartData && regionalChartData.labels.length > 0 ? (
              <div className="h-[400px]">
                <Bar options={barOptions} data={regionalChartData} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">해당 기간의 지역 데이터가 없습니다.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default StatsPage;

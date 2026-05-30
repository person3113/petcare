import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getStatsSummary, getStatsChart, getRealtimeSummary } from '../api/stats.js';
import CountUp from '../components/CountUp.jsx';

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchStats() {
      try {
        const [summaryRes, chartRes, realtimeRes] = await Promise.all([
          getStatsSummary(),
          getStatsChart(),
          getRealtimeSummary()
        ]);
        if (!isMounted) return;
        
        // realtimeRes.data가 실제 StatsRealtimeResponse 데이터라고 가정
        const realData = realtimeRes?.data || realtimeRes;
        
        // 필요한 데이터를 summary 상태 하나로 합치거나 
        // chart 컴포넌트는 기존 데이터를 사용할 수 있도록 유지
        setSummary({
          ...(summaryRes?.data || summaryRes),
          realtime: realData
        });
        setChart(chartRes?.data || chartRes);
      } catch (err) {
        if (!isMounted) return;
        setError('통계 데이터를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusChartData = useMemo(() => {
    if (!chart?.statusCounts?.length) {
      return null;
    }
    const labels = chart.statusCounts.map((item) => item.label);
    const values = chart.statusCounts.map((item) => item.value);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#f97316',
            '#e11d48',
            '#0ea5e9',
            '#10b981',
            '#64748b',
            '#f59e0b',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [chart]);

  const periodText = summary?.period
    ? `${summary.period.from} ~ ${summary.period.to}`
    : '';

  return (
    <div className="px-4 py-6">

      <section className="bg-pink-50 rounded-2xl p-10 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">펫케어 홈</h1>

        {loading && <p>통계 로딩중...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {summary && summary.realtime && !loading && (
          <div className="mt-5">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              최근 한달간 유기동물 통계 (기준: {summary.realtime.todayDate})
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[140px] rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm text-gray-600">구조</p>
                <strong className="text-xl">
                  <CountUp end={summary.realtime.totalRescued || 0} duration={1.2} /> 마리
                </strong>
              </div>
              <div className="min-w-[140px] rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm text-gray-600">보호중</p>
                <strong className="text-xl">
                  <CountUp end={summary.realtime.totalProtecting || 0} duration={1.2} /> 마리
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    ({summary.realtime.totalRescued > 0 ? ((summary.realtime.totalProtecting / summary.realtime.totalRescued) * 100).toFixed(1) : "0.0"} %)
                  </span>
                </strong>
              </div>
              <div className="min-w-[140px] rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm text-gray-600">입양률</p>
                <strong className="text-xl">
                  <CountUp end={summary.realtime.totalAdopted || 0} duration={1.2} /> 마리 
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    ({summary.realtime.totalRescued > 0 ? ((summary.realtime.totalAdopted / summary.realtime.totalRescued) * 100).toFixed(1) : "0.0"} %)
                  </span>
                </strong>
              </div>
              <div className="min-w-[140px] rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm text-gray-600">안락사율</p>
                <strong className="text-xl">
                  <CountUp end={summary.realtime.totalEuthanized || 0} duration={1.2} /> 마리 
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    ({summary.realtime.totalRescued > 0 ? ((summary.realtime.totalEuthanized / summary.realtime.totalRescued) * 100).toFixed(1) : "0.0"} %)
                  </span>
                </strong>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mb-6">
        <div className="flex gap-4">
            {/* 여기 아이디는 임시로 1로 둔것입니다. */}
          <Link to="/animalswipe/1" className="flex-1 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <p className="text-xs text-gray-400">인연 찾기</p>
            <h3 className="text-lg font-bold text-gray-900">스와이프</h3>
          </Link>
          <Link to="/animals" className="flex-1 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <p className="text-xs text-gray-400">입양하기</p>
            <h3 className="text-lg font-bold text-gray-900">필터 목록</h3>
          </Link>
          <Link to="/survey" className="flex-1 border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <p className="text-xs text-gray-400">매칭테스트</p>
            <h3 className="text-lg font-bold text-gray-900">5문항 설문</h3>
          </Link>
        </div>
      </section>

      <section className="border border-gray-200 rounded-xl p-6">
        {periodText && <p className="text-sm text-gray-600">집계기간: {periodText}</p>}
        {statusChartData && !loading && (
          <div className="mt-6 max-w-[420px]">
            <Doughnut data={statusChartData} />
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;

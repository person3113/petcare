import React, { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getStatsSummary, getStatsChart } from '../api/stats.js';
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
        const [summaryRes, chartRes] = await Promise.all([
          getStatsSummary(),
          getStatsChart(),
        ]);
        if (!isMounted) return;
        setSummary(summaryRes?.data || summaryRes);
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
      <h1 className="text-2xl font-bold text-gray-900">펫케어 홈</h1>
      <p className="mt-2 text-sm text-gray-600">
        로그인 상태에 따라 기능이 열립니다.
      </p>
      <div className="mt-4 text-sm text-gray-700">
        <p>{user ? '로그인됨' : '로그인 필요'}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">랜딩 통계</h2>
        {periodText && (
          <p className="mt-2 text-sm text-gray-600">
            집계기간: {periodText}
          </p>
        )}
        {loading && <p>통계 로딩중...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {summary && !loading && (
          <div className="mt-5 flex flex-wrap gap-4">
            <div className="min-w-[160px] rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm text-gray-600">총 구조</p>
              <strong className="text-xl">
                <CountUp end={summary.totalRescued || 0} duration={1.2} />
              </strong>
            </div>
            <div className="min-w-[160px] rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm text-gray-600">입양</p>
              <strong className="text-xl">
                <CountUp end={summary.totalAdopted || 0} duration={1.2} />
              </strong>
            </div>
            <div className="min-w-[160px] rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm text-gray-600">보호중</p>
              <strong className="text-xl">
                <CountUp end={summary.totalProtecting || 0} duration={1.2} />
              </strong>
            </div>
            <div className="min-w-[160px] rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm text-gray-600">안락사</p>
              <strong className="text-xl">
                <CountUp end={summary.totalEuthanized || 0} duration={1.2} />
              </strong>
            </div>
          </div>
        )}

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

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
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>펫케어 홈</h1>
      <p style={{ marginBottom: '20px', color: '#555' }}>
        로그인 상태에 따라 기능이 열립니다.
      </p>
      <div style={{ marginBottom: '20px' }}>
        <p>{user ? '로그인됨' : '로그인 필요'}</p>
      </div>

      <section style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>랜딩 통계</h2>
        {periodText && (
          <p style={{ color: '#666', marginBottom: '16px' }}>
            집계기간: {periodText}
          </p>
        )}
        {loading && <p>통계 로딩중...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

        {summary && !loading && (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '160px', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 6px 0', color: '#666' }}>총 구조</p>
              <strong style={{ fontSize: '22px' }}>
                <CountUp end={summary.totalRescued || 0} duration={1.2} />
              </strong>
            </div>
            <div style={{ minWidth: '160px', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 6px 0', color: '#666' }}>입양</p>
              <strong style={{ fontSize: '22px' }}>
                <CountUp end={summary.totalAdopted || 0} duration={1.2} />
              </strong>
            </div>
            <div style={{ minWidth: '160px', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 6px 0', color: '#666' }}>보호중</p>
              <strong style={{ fontSize: '22px' }}>
                <CountUp end={summary.totalProtecting || 0} duration={1.2} />
              </strong>
            </div>
            <div style={{ minWidth: '160px', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 6px 0', color: '#666' }}>안락사</p>
              <strong style={{ fontSize: '22px' }}>
                <CountUp end={summary.totalEuthanized || 0} duration={1.2} />
              </strong>
            </div>
          </div>
        )}

        {statusChartData && !loading && (
          <div style={{ marginTop: '24px', maxWidth: '420px' }}>
            <Doughnut data={statusChartData} />
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

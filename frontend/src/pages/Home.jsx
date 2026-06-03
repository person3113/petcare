import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getStatsSummary, getRealtimeSummary } from '../api/stats.js';
import CountUp from '../components/CountUp.jsx';
import RecommendedAnimals from '../components/landing/RecommendedAnimals.jsx';
import LostAnimalsSection from '../components/landing/LostAnimalsSection.jsx';
import AdoptionReviewsSection from '../components/landing/AdoptionReviewsSection.jsx';

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
        const [summaryRes, realtimeRes] = await Promise.all([
          getStatsSummary(),
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



  return (
    <div className="px-4 py-6">

      <section className="bg-pink-50 rounded-2xl p-10 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">펫케어 홈</h1>

        {loading && <p>통계 로딩중...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {summary && summary.realtime && !loading && (
          <div className="mt-5">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-gray-700">
                최근 한달간 유기동물 통계 (기준: {summary.realtime.todayDate})
              </h2>
              <Link to="/stats" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                상세 통계 보기 &rarr;
              </Link>
            </div>
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

      <section className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
            {/* 여기 아이디는 임시로 1로 둔것입니다. */}
          <Link to="/animalswipe/1" className="flex-1 border border-gray-200 bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition group">
            <p className="text-xs text-gray-400">인연 찾기</p>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">스와이프 &rarr;</h3>
          </Link>
          <Link to="/animals" className="flex-1 border border-gray-200 bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition group">
            <p className="text-xs text-gray-400">입양하기</p>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">필터 목록 &rarr;</h3>
          </Link>
          <Link to="/survey" className="flex-1 border border-gray-200 bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition group">
            <p className="text-xs text-gray-400">매칭테스트</p>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">5문항 설문 &rarr;</h3>
          </Link>
        </div>
      </section>

      <RecommendedAnimals />
      <LostAnimalsSection />
      <AdoptionReviewsSection />

    </div>
  );
}

export default Home;

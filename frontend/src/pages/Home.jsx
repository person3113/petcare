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

    function fetchStats() {
      getStatsSummary()
        .then(summaryRes => {
          getRealtimeSummary()
            .then(realtimeRes => {
              if (!isMounted) return;
              const realData = realtimeRes?.data || realtimeRes;
              setSummary({
                ...(summaryRes?.data || summaryRes),
                realtime: realData
              });
              setLoading(false);
            })
            .catch(err => {
              if (!isMounted) return;
              setError('실시간 데이터 에러');
              setLoading(false);
            });
        })
        .catch(err => {
          if (!isMounted) return;
          setError('통계 데이터 에러');
          setLoading(false);
        });
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);



  return (
    <div className="px-4 py-6">

      <section 
        className="rounded-2xl sm:p-10 p-6 mb-8 relative overflow-hidden bg-cover bg-center bg-no-repeat shadow-sm min-h-[250px] md:min-h-[320px] flex items-center"
        style={{ backgroundImage: 'url(/dogs.jpg)' }}
      >
        {/* pc는 좌측-> 우측 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-0 hidden md:block"></div>
        {/* 모바일은 상단-> 하단 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-transparent z-0 md:hidden"></div>
        
        <div className="z-10 relative w-full">
          <div className="text-left md:w-1/2">
            <h1 className="!text-3xl md:!text-4xl font-bold text-gray-900 mb-4 leading-tight drop-shadow-sm">당신에게 꼭 맞는 <br className="hidden md:block" />
              <span className="text-accent">인연</span>을 만나보세요</h1>
            <p className="text-gray-800 mb-1 font-medium drop-shadow-sm">설문을 통해 잘 맞는 동물을 추천해줍니다</p>
            <p className="text-gray-800 font-medium drop-shadow-sm">지금 바로 인연을 찾아보세요</p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        {loading && <p className="text-center text-gray-500">통계 로딩중...</p>}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        {summary && summary.realtime && !loading && (
          <div className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <h2 className="sm:!text-sm !text-[9px] font-bold text-gray-400">
                최근 한달간 유기동물 통계 (기준: {summary.realtime.todayDate})
              </h2>
              <Link to="/stats" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                상세 통계 보기 &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-gray-600">구조</p>
                <strong className="text-sm sm:text-xl text-accent">
                  <CountUp end={summary.realtime.totalRescued || 0} duration={1.2} /> 마리
                </strong>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-2 md:p-3">
                <p className="text-xs md:text-sm text-gray-600">보호중</p>
                <strong className="text-sm md:text-xl text-accent">
                  <CountUp end={summary.realtime.totalProtecting || 0} duration={1.2} /> 마리
                  <span className="text-[10px] md:text-sm font-normal text-gray-500 ml-1">
                    ({summary.realtime.totalRescued > 0 ? ((summary.realtime.totalProtecting / summary.realtime.totalRescued) * 100).toFixed(1) : "0.0"} %)
                  </span>
                </strong>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-2 md:p-3">
                <p className="text-xs md:text-sm text-gray-600">입양률</p>
                <strong className="text-sm md:text-xl text-accent">
                  <CountUp end={summary.realtime.totalAdopted || 0} duration={1.2} /> 마리 
                  <span className="text-[10px] md:text-sm font-normal text-gray-500 ml-1">
                    ({summary.realtime.totalRescued > 0 ? ((summary.realtime.totalAdopted / summary.realtime.totalRescued) * 100).toFixed(1) : "0.0"} %)
                  </span>
                </strong>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-2 md:p-3">
                <p className="text-xs md:text-sm text-gray-600">안락사율</p>
                <strong className="text-sm md:text-xl text-accent">
                  <CountUp end={summary.realtime.totalEuthanized || 0} duration={1.2} /> 마리 
                  <span className="text-[10px] md:text-sm font-normal text-gray-500 ml-1">
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

      <section className="mt-16 mb-8 pt-10 border-t border-gray-100">
        <h2 className="text-sm font-bold text-gray-400 mb-4 text-center">만든 사람들</h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
          <div>
            <p className="font-medium text-gray-700 text-sm">정성오</p>
            <p className="text-xs text-gray-400 mt-0.5">팀장 / 풀스택</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 text-sm">곽선아</p>
            <p className="text-xs text-gray-400 mt-0.5">프론트 / 디자인</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 text-sm">김은솔</p>
            <p className="text-xs text-gray-400 mt-0.5">프론트 / 디자인</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

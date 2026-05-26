import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard.jsx';

// 설문 결과 페이지
// Survey에서 navigate로 전달받은 data를 렌더링
function MatchResult() {
  const location = useLocation();
  const data = location.state || {};
  const items = data.items || [];
  const pagination = data.pagination;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">🐾 설문 결과</h1>
          <p className="mt-2 text-sm text-gray-500">
            조건에 맞는 동물 목록입니다.
          </p>
        </div>

        {/* 결과 없음 */}
        {items.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              조건에 맞는 동물이 없습니다. 조건을 바꿔서 다시 시도해 주세요.
            </p>
          </div>
        )}

        {/* 동물 카드 목록 */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((animal) => (
              // AnimalCard 컴포넌트 재활용
              <Link key={animal.id} to={`/animal/${animal.id}`}>
                <AnimalCard animal={animal} />
              </Link>
            ))}
          </div>
        )}

        {/* 페이지네이션 정보 */}
        {pagination && (
          <p className="mt-4 text-center text-xs text-gray-400">
            총 {pagination.totalCount}건 &middot; {pagination.page} / {pagination.totalPages} 페이지
          </p>
        )}

        {/* 설문 다시하기 링크 */}
        <div className="mt-8 text-center">
          <Link
            to="/survey"
            className="inline-block rounded-xl border border-amber-400 px-6 py-2 text-sm font-semibold text-amber-500 transition hover:bg-amber-50"
          >
            ← 설문 다시하기
          </Link>
          <Link
            to="/mypage"
            className="ml-2 inline-block rounded-xl border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            설문 기록 보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchResult;

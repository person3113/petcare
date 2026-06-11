import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchLostAnimalsPage, fetchSido, fetchSigungu } from '../api/animals.js';
import LostAnimalFilter from '../components/LostAnimalFilter.jsx';
import AnimalCard from '../components/AnimalCard.jsx';

// 필터 초기값
const DEFAULT_FILTERS = {
  sido: '',
  sigungu: '',
  kind: '',
  gender: '',
};

function LostAnimalPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [allAnimals, setAllAnimals] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const pageLimit = 20;
  const debounceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetchSido().then(setSidoList);

    function init() {
      const params = { page, limit: pageLimit, keyword };
      if (filters.sido) params.sido = filters.sido;
      if (filters.sigungu) params.sigungu = filters.sigungu;
      if (filters.kind) params.kind = filters.kind;
      if (filters.gender) params.gender = filters.gender;

      fetchLostAnimalsPage(params)
        .then(data => {
          if (!isMounted) return;
          setAllAnimals(data.items || []);
          setPagination(data.pagination || null);
        })
        .catch(err => {
          if (!isMounted) return;
          setError('분실동물 데이터를 불러오지 못했습니다.');
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    setLoading(true);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      init();
    }, 300);

    return () => {
      isMounted = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [page, filters, keyword]);

  function handleFilterChange(nextFilters) {
    setFilters(nextFilters);
    if (page !== 1) {
      setPage(1);
    }
  }

  function handleCascadeChange(nextFilters) {
    if (nextFilters.sido !== filters.sido) {
      const sidoCode = sidoList.find((item) => item.name === nextFilters.sido)?.code || '';
      if (nextFilters.sido) {
        fetchSigungu(sidoCode).then(sigungu => {
          setSigunguList(sigungu);
          nextFilters = { ...nextFilters, sigungu: '' };
          handleFilterChange(nextFilters);
        });
      } else {
        setSigunguList([]);
        nextFilters = { ...nextFilters, sigungu: '' };
        handleFilterChange(nextFilters);
      }
    } else {
      handleFilterChange(nextFilters);
    }
  }

  const isSigunguDisabled = !filters.sido;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">분실동물 탭</h1>
          <p className="text-sm text-gray-500">
            분실된 반려동물을 지역과 조건으로 찾아보세요.
          </p>
        </div>

        <LostAnimalFilter
          sidoList={sidoList}
          sigunguList={sigunguList}
          filters={filters}
          onChange={handleCascadeChange}
          disabledSigungu={isSigunguDisabled}
        />

        <section className="flex items-center justify-between text-sm text-gray-600">
          <span>총 {pagination?.totalCount ?? allAnimals.length}건</span>
        </section>

        {loading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && allAnimals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            조건에 맞는 분실동물이 없습니다.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} to={`/lost-animals/${animal.id}`} />
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              이전
            </button>
            <span className="text-gray-500">
              {page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={page >= pagination.totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LostAnimalPage;

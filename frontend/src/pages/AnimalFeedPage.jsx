import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAnimalsPage, fetchSigungu, fetchShelters } from '../api/animals.js';
import FilterBar from '../components/FilterBar.jsx';
import AnimalCard from '../components/AnimalCard.jsx';
import { SIDO_LIST } from '../constants.js';

const DEFAULT_FILTERS = {
  sido: '',
  sigungu: '',
  shelterName: '',
  kind: '',
  status: '보호중',
  gender: '',
  isNeutered: '',
};



function AnimalFeedPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [allAnimals, setAllAnimals] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [shelterList, setShelterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const pageLimit = 20;

  useEffect(() => {
    let isMounted = true;
    
    // fetch sido
    import('../api/animals.js').then((module) => {
      module.fetchSido().then(setSidoList);
    });

    function init() {
      const params = { page, limit: pageLimit, keyword };
      if (filters.sido) params.sido = filters.sido;
      if (filters.sigungu) params.sigungu = filters.sigungu;
      if (filters.shelterName) params.shelterName = filters.shelterName;
      if (filters.kind) params.kind = filters.kind;
      if (filters.status) params.state = filters.status;
      if (filters.gender) params.gender = filters.gender;
      if (filters.isNeutered) params.isNeutered = filters.isNeutered;

      fetchAnimalsPage(params)
        .then(animalsData => {
          if (!isMounted) return;
          const items = animalsData.items || [];
          setAllAnimals(items);
          setPagination(animalsData.pagination || null);
        })
        .catch(err => {
          if (!isMounted) return;
          setError('동물 데이터 에러');
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
        });
        fetchShelters(nextFilters.sido, '').then(shelters => {
          setShelterList(shelters);
        });
      } else {
        setSigunguList([]);
        setShelterList([]);
      }
      nextFilters = { ...nextFilters, sigungu: '', shelterName: '' };
      handleFilterChange(nextFilters);

    } else if (nextFilters.sigungu !== filters.sigungu) {
      if (nextFilters.sido) {
        fetchShelters(nextFilters.sido, nextFilters.sigungu).then(shelters => {
          setShelterList(shelters);
          nextFilters = { ...nextFilters, shelterName: '' };
          handleFilterChange(nextFilters);
        });
      } else {
        setShelterList([]);
        nextFilters = { ...nextFilters, shelterName: '' };
        handleFilterChange(nextFilters);
      }
    } else {
      handleFilterChange(nextFilters);
    }
  }

  const isSigunguDisabled = !filters.sido;
  const isShelterDisabled = !filters.sido;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">구조동물 피드</h1>
          <p className="text-sm text-gray-500">
            지역과 조건을 선택해서 입양 가능한 친구를 찾아보세요.
          </p>
        </div>

        <FilterBar
          sidoList={sidoList}
          sigunguList={sigunguList}
          shelterList={shelterList}
          filters={filters}
          onChange={handleCascadeChange}
          disabledSigungu={isSigunguDisabled}
          disabledShelter={isShelterDisabled}
        />

        <section className="flex items-center justify-between text-sm text-gray-600">
          <span>총 {pagination?.totalCount ?? allAnimals.length}마리</span>
        </section>

        {loading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && allAnimals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            조건에 맞는 동물이 없습니다.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
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

export default AnimalFeedPage;

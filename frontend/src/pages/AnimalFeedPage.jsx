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
  onlySocialized: false,
  onlyHealthy: false,
};

function applyFilter(animals, filters) {
  let result = animals;

  if (filters.sido) {
    result = result.filter((animal) => animal.jurisdiction.includes(filters.sido));
  }
  if (filters.sigungu) {
    result = result.filter((animal) => animal.jurisdiction.includes(filters.sigungu));
  }
  if (filters.shelterName) {
    result = result.filter((animal) => animal.shelterName === filters.shelterName);
  }
  if (filters.kind) {
    result = result.filter((animal) => animal.kind.includes(filters.kind));
  }
  if (filters.status) {
    result = result.filter((animal) => animal.status === filters.status);
  }
  if (filters.gender) {
    result = result.filter((animal) => animal.gender === filters.gender);
  }
  if (filters.isNeutered) {
    result = result.filter((animal) => animal.isNeutered === filters.isNeutered);
  }
  if (filters.onlySocialized) {
    result = result.filter(
      (animal) => animal.socialization && animal.socialization.trim() !== ''
    );
  }
  if (filters.onlyHealthy) {
    result = result.filter((animal) => animal.healthStatus === '양호');
  }

  return result;
}

function AnimalFeedPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [allAnimals, setAllAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
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

    async function init() {
      try {
        const animalsData = await fetchAnimalsPage({ page, limit: pageLimit, keyword });
        if (!isMounted) return;
        const items = animalsData.items || [];
        setAllAnimals(items);
        setFilteredAnimals(applyFilter(items, filters));
        setPagination(animalsData.pagination || null);
      } catch (err) {
        if (!isMounted) return;
        setError('동물 데이터를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [page]);

  function handleFilterChange(nextFilters) {
    setFilters(nextFilters);

    if (page !== 1) {
      setPage(1);
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const result = applyFilter(allAnimals, nextFilters);
      setFilteredAnimals(result);
    }, 300);
  }

  async function handleCascadeChange(nextFilters) {
    if (nextFilters.sido !== filters.sido) {
      const sidoCode = SIDO_LIST.find((item) => item.name === nextFilters.sido)?.code || '';
      const sigungu = nextFilters.sido ? await fetchSigungu(sidoCode) : [];
      setSigunguList(sigungu);
      setShelterList([]);
      nextFilters = { ...nextFilters, sigungu: '', shelterName: '' };
    }

    if (nextFilters.sigungu !== filters.sigungu) {
      const sigunguCode = sigunguList.find((item) => item.name === nextFilters.sigungu)?.code || '';
      const shelters = nextFilters.sigungu ? await fetchShelters(sigunguCode) : [];
      setShelterList(shelters);
      nextFilters = { ...nextFilters, shelterName: '' };
    }

    handleFilterChange(nextFilters);
  }

  const isSigunguDisabled = !filters.sido;
  const isShelterDisabled = !filters.sigungu;

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
          sidoList={SIDO_LIST}
          sigunguList={sigunguList}
          shelterList={shelterList}
          filters={filters}
          onChange={handleCascadeChange}
          disabledSigungu={isSigunguDisabled}
          disabledShelter={isShelterDisabled}
        />

        <section className="flex items-center justify-between text-sm text-gray-600">
          <span>총 {pagination?.totalCount ?? filteredAnimals.length}마리</span>
          {(filters.onlySocialized || filters.onlyHealthy) && (
            <span className="text-emerald-600">선택 조건 적용됨</span>
          )}
        </section>

        {loading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && filteredAnimals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            조건에 맞는 동물이 없습니다.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
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

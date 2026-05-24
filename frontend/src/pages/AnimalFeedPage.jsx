import React, { useEffect, useRef, useState } from 'react';
import { fetchAnimals, fetchSido, fetchSigungu, fetchShelters } from '../api/animals.js';
import FilterBar from '../components/FilterBar.jsx';
import AnimalCard from '../components/AnimalCard.jsx';

const DEFAULT_FILTERS = {
  sido: '',
  sigungu: '',
  shelterName: '',
  kind: '',
  status: '',
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
  const [allAnimals, setAllAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [shelterList, setShelterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const [animals, sido] = await Promise.all([fetchAnimals(), fetchSido()]);
        if (!isMounted) return;
        setAllAnimals(animals);
        setFilteredAnimals(animals);
        setSidoList(sido);
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
  }, []);

  function handleFilterChange(nextFilters) {
    setFilters(nextFilters);

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
      const sidoCode = sidoList.find((item) => item.name === nextFilters.sido)?.code || '';
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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
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
          <span>총 {filteredAnimals.length}마리</span>
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
      </div>
    </div>
  );
}

export default AnimalFeedPage;

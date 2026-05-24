import React, { useEffect, useRef, useState } from 'react';
import { fetchLostAnimals, fetchSido, fetchSigungu, fetchShelters } from '../api/animals.js';
import FilterBar from '../components/FilterBar.jsx';
import AnimalCard from '../components/AnimalCard.jsx';

// 필터 초기값
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

// 필터 조건에 맞는 동물만 걸러내는 함수
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

function LostAnimalPage() {
  // 분실동물 전체 목록
  const [allAnimals, setAllAnimals] = useState([]);
  // 필터 적용 후 보여줄 목록
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  // 현재 필터 상태
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  // 시도/시군구/보호소 드롭다운 목록
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [shelterList, setShelterList] = useState([]);
  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // 300ms debounce용 타이머 ref
  const debounceRef = useRef(null);

  // 마운트 시 분실동물 데이터 + 시도 목록 불러오기
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const [animals, sido] = await Promise.all([fetchLostAnimals(), fetchSido()]);
        if (!isMounted) return;
        setAllAnimals(animals);
        setFilteredAnimals(animals);
        setSidoList(sido);
      } catch (err) {
        if (!isMounted) return;
        setError('분실동물 데이터를 불러오지 못했습니다.');
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

  // 필터 변경 시 300ms debounce 후 필터 적용
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

  // 시도 → 시군구 → 보호소 연쇄 드롭다운 처리
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

  // 시도 미선택 시 시군구/보호소 비활성화
  const isSigunguDisabled = !filters.sido;
  const isShelterDisabled = !filters.sigungu;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">분실동물 탭</h1>
          <p className="text-sm text-gray-500">
            분실된 반려동물을 지역과 조건으로 찾아보세요.
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
          <span>총 {filteredAnimals.length}건</span>
          {(filters.onlySocialized || filters.onlyHealthy) && (
            <span className="text-emerald-600">선택 조건 적용됨</span>
          )}
        </section>

        {loading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && filteredAnimals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            조건에 맞는 분실동물이 없습니다.
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

export default LostAnimalPage;

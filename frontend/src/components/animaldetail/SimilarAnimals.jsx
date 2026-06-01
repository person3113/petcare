import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AnimalCard from '../AnimalCard';
import { fetchAnimals } from '../../api/animals';
import { SIDO_LIST } from '../../constants';

function SimilarAnimals({ currentAnimal }) {
  const [similarAnimals, setSimilarAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAnimal) return;

    async function getSimilarAnimals() {
      setLoading(true);
      try {
        // 백엔드 API 파라미터 매핑
        const kindMatch = currentAnimal.kind?.match(/\[.*?\]/)?.[0] || '';
        let upkind = '';
        if (kindMatch === '[개]') upkind = '417000';
        else if (kindMatch === '[고양이]') upkind = '422400';
        else upkind = '429900';

        const sidoName = currentAnimal.jurisdiction?.split(' ')?.[0] || '';
        const sidoCode = SIDO_LIST.find(s => s.name === sidoName)?.code || '';

        // 1. 같은 축종 + 같은 지역 + '보호중' 상태 (본인 제외를 위해 9마리 요청)
        const params = { upkind, upr_cd: sidoCode, state: '보호중', limit: 9 };
        let results = await fetchAnimals(params);
        results = results.filter((a) => a.id !== currentAnimal.id);

        // 2. 8마리 미만이면 지역 조건 해제 (같은 축종 + '보호중' 상태)
        if (results.length < 8) {
          const fallbackParams = { upkind, state: '보호중', limit: 9 };
          const fallbackResults = await fetchAnimals(fallbackParams);
          
          const existingIds = new Set(results.map((a) => a.id));
          existingIds.add(currentAnimal.id);
          
          for (const animal of fallbackResults) {
            if (!existingIds.has(animal.id)) {
              results.push(animal);
              existingIds.add(animal.id);
            }
            if (results.length >= 8) break;
          }
        }

        setSimilarAnimals(results.slice(0, 8));
      } catch (error) {
        console.error('비슷한 동물 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    getSimilarAnimals();
  }, [currentAnimal]);

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">비슷한 아이들을 찾고 있어요...</div>;
  }

  if (similarAnimals.length === 0) {
    return null; // 보여줄 동물이 없으면 렌더링 안 함
  }

  return (
    <section className="mt-12 w-full">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        비슷한 친구들도 가족을 기다리고 있어요
      </h2>
      <Swiper
        spaceBetween={16}
        slidesPerView={1.5} // 모바일 기준 1.5개
        breakpoints={{
          640: { slidesPerView: 2.5 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4 }, // 데스크탑 4개
        }}
        className="w-full"
      >
        {similarAnimals.map((animal) => (
          <SwiperSlide key={animal.id} className="h-auto">
            <AnimalCard animal={animal} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default SimilarAnimals;

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AnimalCard from '../AnimalCard';
import { fetchAnimals } from '../../api/animals';

function SimilarAnimals({ currentAnimal }) {
  const [similarAnimals, setSimilarAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentAnimal) return;

    async function getSimilarAnimals() {
      setLoading(true);
      try {
        const baseKind = currentAnimal.kind?.match(/\[.*?\]/)?.[0] || '';
        const sido = currentAnimal.jurisdiction?.split(' ')?.[0] || '';

        // 전체 동물 데이터를 넉넉히 가져와서 프론트엔드에서 필터링 (기본 limit 20이면 다른 축종만 있을 수 있으므로)
        const allAnimals = await fetchAnimals({ limit: 200 });
        
        // 1. 같은 축종 + 같은 지역 + '보호중' 상태
        let results = allAnimals.filter(
          (a) => a.id !== currentAnimal.id &&
                 a.status === '보호중' &&
                 a.kind?.includes(baseKind) &&
                 a.jurisdiction?.includes(sido)
        );

        // 2. 8마리 미만이면 지역 조건 해제 (같은 축종 + '보호중' 상태)
        if (results.length < 8) {
          const fallbackResults = allAnimals.filter(
            (a) => a.id !== currentAnimal.id &&
                   a.status === '보호중' &&
                   a.kind?.includes(baseKind)
          );
          
          const existingIds = new Set(results.map((a) => a.id));
          
          for (const animal of fallbackResults) {
            if (!existingIds.has(animal.id)) {
              results.push(animal);
              existingIds.add(animal.id);
            }
            if (results.length >= 8) break;
          }
        }

        // 최대 8마리만 유지
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

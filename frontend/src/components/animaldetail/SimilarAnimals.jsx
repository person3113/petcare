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
        const kindCategory = currentAnimal.kind?.match(/\[.*?\]/)?.[0] || '';
        const breed = currentAnimal.kind?.replace(/\[.*?\]\s*/, '').trim() || '';
        const sidoName = currentAnimal.jurisdiction?.split(' ')?.[0] || '';

        let results = [];
        const existingIds = new Set([currentAnimal.id]);

        const fetchAndAppend = async (params) => {
          if (results.length >= 8) return;
          const fetched = await fetchAnimals({ ...params, state: '보호중', limit: 10 });
          for (const animal of fetched) {
            if (!existingIds.has(animal.id)) {
              results.push(animal);
              existingIds.add(animal.id);
            }
            if (results.length >= 8) break;
          }
        };

        // 1. 정확한 품종 + 장소
        if (breed && sidoName) {
          await fetchAndAppend({ kind: breed, sido: sidoName });
        }

        // 2. 정확한 품종 + 장소 없으면 품종만
        if (breed && results.length < 8) {
          await fetchAndAppend({ kind: breed });
        }

        // 3. 품종 카테고리 + 장소
        if (kindCategory && kindCategory !== '[기타축종]' && results.length < 8) {
          if (sidoName) {
            await fetchAndAppend({ kind: kindCategory, sido: sidoName });
          }
          if (results.length < 8) {
            await fetchAndAppend({ kind: kindCategory });
          }
        }

        setSimilarAnimals(results);
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

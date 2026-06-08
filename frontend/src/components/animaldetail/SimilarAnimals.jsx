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

    function getSimilarAnimals() {
      setLoading(true);
      const kindCategory = currentAnimal.kind?.match(/\[.*?\]/)?.[0] || '';
      const breed = currentAnimal.kind?.replace(/\[.*?\]\s*/, '').trim() || '';
      const sidoName = currentAnimal.jurisdiction?.split(' ')?.[0] || '';

      let results = [];
      const existingIds = new Set([currentAnimal.id]);

      const loadAnimals = () => {
        if (breed && sidoName) {
          fetchAnimals({ kind: breed, sido: sidoName, state: '보호중', limit: 10 })
            .then(fetched => {
              appendAnimals(fetched);
              if (results.length < 8 && breed) {
                fetchAnimals({ kind: breed, state: '보호중', limit: 10 }).then(f2 => {
                  appendAnimals(f2);
                  if (results.length < 8 && kindCategory && kindCategory !== '[기타축종]' && sidoName) {
                    fetchAnimals({ kind: kindCategory, sido: sidoName, state: '보호중', limit: 10 }).then(f3 => {
                      appendAnimals(f3);
                      if (results.length < 8) {
                        fetchAnimals({ kind: kindCategory, state: '보호중', limit: 10 }).then(f4 => {
                          appendAnimals(f4);
                          finishLoading();
                        });
                      } else {
                        finishLoading();
                      }
                    });
                  } else {
                    finishLoading();
                  }
                });
              } else {
                finishLoading();
              }
            }).catch(handleError);
        } else {
          finishLoading();
        }
      };

      const appendAnimals = (fetched) => {
        for (const animal of fetched) {
          if (!existingIds.has(animal.id)) {
            results.push(animal);
            existingIds.add(animal.id);
          }
          if (results.length >= 8) break;
        }
      };

      const finishLoading = () => {
        setSimilarAnimals(results);
        setLoading(false);
      };

      const handleError = (error) => {
        console.log('비슷한 동물 에러', error);
        setLoading(false);
      };

      loadAnimals();
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

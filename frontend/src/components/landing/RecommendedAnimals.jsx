import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AnimalCard from '../AnimalCard';
import { fetchAnimals } from '../../api/animals';
import { Link } from 'react-router-dom';

function RecommendedAnimals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadAnimals() {
      fetchAnimals({ state: '보호중', limit: 30 })
        .then(results => {
          const sorted = [...results].sort((a, b) => {
            if (!a.noticeEdt) return 1;
            if (!b.noticeEdt) return -1;
            return a.noticeEdt.localeCompare(b.noticeEdt);
          });
          setAnimals(sorted.slice(0, 8));
        })
        .catch(error => {
          console.log('추천 입양 동물 에러', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    loadAnimals();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">추천 입양 동물을 찾고 있어요...</div>;
  }

  if (animals.length === 0) return null;

  return (
    <section className="mb-12 w-full animate-fade-in-up">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            이달의 추천 입양 동물
          </h2>
          <p className="mt-1 text-sm text-gray-500">공고 종료일이 임박하여 따뜻한 손길이 시급한 아이들이에요.</p>
        </div>
        <Link to="/animals" className="shrink-0 text-sm font-medium text-pink-600 hover:text-pink-800 transition">
          전체보기 &rarr;
        </Link>
      </div>
      <Swiper
        spaceBetween={16}
        slidesPerView={1.5}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4 },
        }}
        className="w-full pb-4"
      >
        {animals.map((animal) => (
          <SwiperSlide key={animal.id} className="h-auto">
            <AnimalCard animal={animal} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default RecommendedAnimals;

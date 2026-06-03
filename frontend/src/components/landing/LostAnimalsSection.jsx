import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AnimalCard from '../AnimalCard';
import { fetchLostAnimals } from '../../api/animals';
import { Link } from 'react-router-dom';

function LostAnimalsSection() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLostAnimals() {
      try {
        const results = await fetchLostAnimals();
        if (isMounted) {
          setAnimals(results.slice(0, 8));
        }
      } catch (error) {
        console.error('분실동물 로드 실패:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLostAnimals();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">분실 동물을 찾고 있어요...</div>;
  }

  if (animals.length === 0) return null;

  return (
    <section className="mb-12 w-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            애타게 가족을 찾고 있어요
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            최근 접수된 분실동물입니다.
          </p>
        </div>
        <Link to="/lost-animals" className="shrink-0 text-sm font-medium text-amber-600 hover:text-amber-800 transition">
          더보기 &rarr;
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
            <AnimalCard animal={animal} to={`/lost-animals/${animal.id}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default LostAnimalsSection;

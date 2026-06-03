import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { fetchPosts } from '../../api/posts';
import { Link } from 'react-router-dom';

function ReviewCard({ post }) {
  const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '';
  
  return (
    <Link to={`/community/${post.id}`} className="block h-full">
      <article className="flex h-full min-h-[160px] flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-xl">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">입양 성공</span>
            <span className="text-xs text-gray-500">{dateStr}</span>
          </div>
          <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{post.content}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800">
            {post.userNickname?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700">{post.userNickname}</span>
        </div>
      </article>
    </Link>
  );
}

function AdoptionReviewsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const results = await fetchPosts('adoption_review');
        const sorted = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted.slice(0, 5));
      } catch (error) {
        console.error('입양후기 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">따뜻한 후기를 불러오고 있어요...</div>;
  }

  if (posts.length === 0) return null;

  return (
    <section className="mb-12 w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            행복한 입양 후기
          </h2>
          <p className="mt-1 text-sm text-gray-500">새로운 가족을 만나 행복해진 친구들의 이야기입니다.</p>
        </div>
        <Link to="/community?category=입양후기" className="shrink-0 text-sm font-medium text-green-600 hover:text-green-800 transition">
          더보기 &rarr;
        </Link>
      </div>
      <Swiper
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
        }}
        className="w-full pb-6 pt-2"
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id} className="h-auto">
            <ReviewCard post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default AdoptionReviewsSection;

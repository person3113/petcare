import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../api/posts.js';

const CATEGORY_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'adoption_review', label: '입양후기' },
  { value: 'lost_sighting', label: '분실목격' },
];

function CommunityListPage() {
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchPosts(category);
        if (!isMounted) return;
        setPosts(data);
      } catch (err) {
        if (!isMounted) return;
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [category]);

  const summary = useMemo(() => {
    const total = posts.length;
    if (!category) {
      return `전체 ${total}건`;
    }
    const label = CATEGORY_OPTIONS.find((item) => item.value === category)?.label || '';
    return `${label} ${total}건`;
  }, [posts.length, category]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">커뮤니티 게시판</h1>
          <p className="text-sm text-gray-500">입양 후기와 분실 목격 정보를 나눠주세요.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value || 'all'}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === option.value
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link
            to="/community/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            글 작성
          </Link>
        </div>

        <div className="text-sm text-gray-500">{summary}</div>

        {loading && <p className="text-sm text-gray-500">로딩 중...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            아직 등록된 글이 없습니다.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-emerald-200"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {post.category === 'adoption_review' ? '입양후기' : '분실목격'}
                </span>
                <span className="text-xs text-gray-400">{post.createdAt}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{post.content}</p>
              <div className="mt-3 text-xs text-gray-500">작성자: {post.userNickname}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityListPage;

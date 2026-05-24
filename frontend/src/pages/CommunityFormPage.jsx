import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createPost, fetchPost, updatePost } from '../api/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORY_OPTIONS = [
  { value: 'adoption_review', label: '입양후기' },
  { value: 'lost_sighting', label: '분실목격' },
];

function CommunityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('adoption_review');
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    let isMounted = true;
    async function loadPost() {
      try {
        const data = await fetchPost(id);
        if (!isMounted) return;
        setTitle(data?.title || '');
        setContent(data?.content || '');
        setCategory(data?.category || 'adoption_review');
      } catch (err) {
        if (!isMounted) return;
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
      };
      const result = isEdit ? await updatePost(id, payload) : await createPost(payload);
      navigate(`/community/${result.id}`);
    } catch (err) {
      setError('저장에 실패했습니다.');
    }
  }

  if (loading) {
    return <p className="px-4 py-6 text-sm text-gray-500">로딩 중...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? '게시글 수정' : '게시글 작성'}
          </h1>
          <Link to="/community" className="text-sm text-gray-500">
            목록으로
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">카테고리</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-sm"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">제목</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-lg border border-gray-200 p-3 text-sm"
              placeholder="제목을 입력해 주세요"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">내용</label>
            <textarea
              rows={8}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="rounded-lg border border-gray-200 p-3 text-sm"
              placeholder="내용을 입력해 주세요"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            저장하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommunityFormPage;

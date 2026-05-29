import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createComment,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPost,
  updateComment,
} from '../api/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDetail() {
      setLoading(true);
      setError('');
      try {
        const [postData, commentData] = await Promise.all([
          fetchPost(id),
          fetchComments(id),
        ]);
        if (!isMounted) return;
        setPost(postData);
        setComments(commentData);
      } catch (err) {
        if (!isMounted) return;
        setError('게시글 정보를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function canEditPost() {
    return user && post && String(user.id) === String(post.userId);
  }

  async function handleDeletePost() {
    if (!post) return;
    const ok = window.confirm('게시글을 삭제할까요?');
    if (!ok) return;
    try {
      await deletePost(post.id);
      navigate('/community');
    } catch (err) {
      setError('게시글 삭제에 실패했습니다.');
    }
  }

  async function handleSubmitComment(event) {
    event.preventDefault();
    if (!commentInput.trim()) {
      setError('댓글 내용을 입력해 주세요.');
      return;
    }
    try {
      const created = await createComment(id, { content: commentInput.trim() });
      setComments((prev) => [...prev, created]);
      setCommentInput('');
      setError('');
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
    }
  }

  async function handleEditComment(commentId) {
    if (!editingContent.trim()) {
      setError('댓글 내용을 입력해 주세요.');
      return;
    }
    try {
      const updated = await updateComment(commentId, { content: editingContent.trim() });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, ...updated } : comment
        )
      );
      setEditingCommentId(null);
      setEditingContent('');
      setError('');
    } catch (err) {
      setError('댓글 수정에 실패했습니다.');
    }
  }

  async function handleDeleteComment(commentId) {
    const ok = window.confirm('댓글을 삭제할까요?');
    if (!ok) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
    }
  }

  if (loading) {
    return <p className="px-4 py-6 text-sm text-gray-500">로딩 중...</p>;
  }

  if (error && !post) {
    return <p className="px-4 py-6 text-sm text-red-500">{error}</p>;
  }

  if (!post) {
    return <p className="px-4 py-6 text-sm text-gray-500">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/community" className="text-sm text-gray-500">
            목록으로
          </Link>
          {canEditPost() && (
            <div className="flex gap-2 text-sm">
              <Link
                to={`/community/${post.id}/edit`}
                className="rounded-md border border-gray-200 px-3 py-1 text-gray-600"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={handleDeletePost}
                className="rounded-md border border-red-200 px-3 py-1 text-red-500"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {post.category === 'adoption_review' ? '입양후기' : '분실목격'}
            </span>
            <span className="text-xs text-gray-400">{post.createdAt}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{post.content}</p>
          <div className="mt-4 text-xs text-gray-500">작성자: {post.userNickname}</div>
        </article>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">댓글 {comments.length}개</h2>
          <div className="mt-4 flex flex-col gap-3">
            {comments.length === 0 && (
              <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
            )}
            {comments.map((comment) => {
              const isOwner = user && String(user.id) === String(comment.userId);
              const isEditing = editingCommentId === comment.id;
              return (
                <div
                  key={comment.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">{comment.userNickname}</span>
                    <span className="text-xs text-gray-400">{comment.createdAt}</span>
                  </div>
                  {isEditing ? (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        rows={3}
                        className="w-full rounded-md border border-gray-200 p-2 text-sm"
                        value={editingContent}
                        onChange={(event) => setEditingContent(event.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditComment(comment.id)}
                          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingContent('');
                          }}
                          className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-500"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                  )}

                  {isOwner && !isEditing && (
                    <div className="mt-3 flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        className="rounded-md border border-gray-200 px-2 py-1 text-gray-600"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="rounded-md border border-red-200 px-2 py-1 text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-6 flex flex-col gap-2">
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm"
              placeholder={user ? '댓글을 입력해 주세요.' : '로그인 후 댓글을 작성할 수 있어요.'}
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              disabled={!user}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!user}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                댓글 등록
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </form>
        </section>
      </div>
    </div>
  );
}

export default CommunityDetailPage;

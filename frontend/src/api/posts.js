import { request } from './http.js';

function fetchPosts(category, keyword) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (keyword) params.append('keyword', keyword);
  const queryStr = params.toString() ? `?${params.toString()}` : '';

  return request(`/api/posts${queryStr}`, { method: 'GET' })
    .then(data => data?.data || []);
}

function fetchPost(postId) {
  return request(`/api/posts/${postId}`, { method: 'GET' })
    .then(data => data?.data || null);
}

function fetchComments(postId) {
  return request(`/api/posts/${postId}/comments`, { method: 'GET' })
    .then(data => data?.data || []);
}

function createPost(payload) {
  return request('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(data => data?.data || null);
}

function updatePost(postId, payload) {
  return request(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then(data => data?.data || null);
}

function deletePost(postId) {
  return request(`/api/posts/${postId}`, { method: 'DELETE' })
    .then(() => true);
}

function createComment(postId, payload) {
  return request(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(data => data?.data || null);
}

function updateComment(commentId, payload) {
  return request(`/api/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then(data => data?.data || null);
}

function deleteComment(commentId) {
  return request(`/api/comments/${commentId}`, { method: 'DELETE' })
    .then(() => true);
}

export {
  fetchPosts,
  fetchPost,
  fetchComments,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
};

import { request } from './http.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

async function fetchPosts(category, keyword) {
  if (USE_MOCK) {
    const response = await fetch('/mock/community_posts.json');
    if (!response.ok) {
      throw new Error('게시글 데이터를 불러오지 못했습니다.');
    }
    const data = await response.json();
    const items = data?.data || [];
    let filtered = items;
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    if (keyword) {
      filtered = filtered.filter((item) => item.title.includes(keyword) || item.content.includes(keyword));
    }
    return filtered;
  }

  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (keyword) params.append('keyword', keyword);
  const queryStr = params.toString() ? `?${params.toString()}` : '';

  const data = await request(`/api/posts${queryStr}`, { method: 'GET' });
  return data?.data || [];
}

async function fetchPost(postId) {
  if (USE_MOCK) {
    const response = await fetch('/mock/community_posts.json');
    if (!response.ok) {
      throw new Error('게시글 데이터를 불러오지 못했습니다.');
    }
    const data = await response.json();
    const items = data?.data || [];
    return items.find((item) => String(item.id) === String(postId));
  }

  const data = await request(`/api/posts/${postId}`, { method: 'GET' });
  return data?.data || null;
}

async function fetchComments(postId) {
  if (USE_MOCK) {
    const response = await fetch('/mock/community_comments.json');
    if (!response.ok) {
      throw new Error('댓글 데이터를 불러오지 못했습니다.');
    }
    const data = await response.json();
    const items = data?.data || [];
    return items.filter((item) => String(item.postId) === String(postId));
  }

  const data = await request(`/api/posts/${postId}/comments`, { method: 'GET' });
  return data?.data || [];
}

async function createPost(payload) {
  if (USE_MOCK) {
    return {
      id: Date.now(),
      ...payload,
      userId: 1,
      userNickname: 'mock-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const data = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data?.data || null;
}

async function updatePost(postId, payload) {
  if (USE_MOCK) {
    return {
      id: postId,
      ...payload,
      userId: 1,
      userNickname: 'mock-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const data = await request(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data?.data || null;
}

async function deletePost(postId) {
  if (USE_MOCK) {
    return true;
  }

  await request(`/api/posts/${postId}`, { method: 'DELETE' });
  return true;
}

async function createComment(postId, payload) {
  if (USE_MOCK) {
    return {
      id: Date.now(),
      postId,
      userId: 1,
      userNickname: 'mock-user',
      content: payload.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const data = await request(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data?.data || null;
}

async function updateComment(commentId, payload) {
  if (USE_MOCK) {
    return {
      id: commentId,
      content: payload.content,
      updatedAt: new Date().toISOString(),
    };
  }

  const data = await request(`/api/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return data?.data || null;
}

async function deleteComment(commentId) {
  if (USE_MOCK) {
    return true;
  }

  await request(`/api/comments/${commentId}`, { method: 'DELETE' });
  return true;
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

import { request } from './http.js';

function getFavorites() {
  return request('/api/likes', { method: 'GET' });
}

function getFavoritesCount() {
  return request('/api/likes/count', { method: 'GET' });
}

function addFavorite(desertionNo) {
  return request(`/api/likes/${desertionNo}`, { method: 'POST' });
}

function removeFavorite(desertionNo) {
  return request(`/api/likes/${desertionNo}`, { method: 'DELETE' });
}

export { getFavorites, getFavoritesCount, addFavorite, removeFavorite };

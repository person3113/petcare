import { request } from './http.js';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function fetchAnimals(params = {}) {
  const query = buildQuery(params);
  return request(`/api/animals${query}`).then(data => data?.data?.items || []);
}

function fetchAnimalsPage(params = {}) {
  const query = buildQuery(params);
  return request(`/api/animals${query}`).then(data => data?.data || { items: [], pagination: null });
}

function fetchSido() {
  return request('/api/codes/sido').then(data => data?.data || []);
}

function fetchSigungu(sidoCode) {
  const query = buildQuery({ uprCd: sidoCode });
  return request(`/api/codes/sigungu${query}`).then(data => data?.data || []);
}

function fetchShelters(sidoName, sigunguName) {
  const query = buildQuery({ sido: sidoName, sigungu: sigunguName });
  return request(`/api/codes/shelters${query}`).then(data => data?.data || []);
}

// 분실동물 목록 불러오기
function fetchLostAnimals(params = {}) {
  const query = buildQuery(params);
  return request(`/api/lost-animals${query}`).then(data => data?.data?.items || []);
}

function fetchLostAnimalsPage(params = {}) {
  const query = buildQuery(params);
  return request(`/api/lost-animals${query}`).then(data => data?.data || { items: [], pagination: null });
}

export { fetchAnimals, fetchAnimalsPage, fetchSido, fetchSigungu, fetchShelters, fetchLostAnimals, fetchLostAnimalsPage };

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

async function fetchAnimals(params = {}) {
  const query = buildQuery(params);
  const data = await request(`/api/animals${query}`);
  return data?.data?.items || [];
}

async function fetchAnimalsPage(params = {}) {
  const query = buildQuery(params);
  const data = await request(`/api/animals${query}`);
  return data?.data || { items: [], pagination: null };
}

async function fetchSido() {
  const data = await request('/api/codes/sido');
  return data?.data || [];
}

async function fetchSigungu(sidoCode) {
  const query = buildQuery({ uprCd: sidoCode });
  const data = await request(`/api/codes/sigungu${query}`);
  return data?.data || [];
}

async function fetchShelters(sigunguCode) {
  const query = buildQuery({ orgCd: sigunguCode });
  const data = await request(`/api/codes/shelters${query}`);
  return data?.data || [];
}

// 분실동물 목록 불러오기 (Mock JSON)
async function fetchLostAnimals() {
  const data = await request('/api/lost-animals');
  return data?.data || [];
}

export { fetchAnimals, fetchAnimalsPage, fetchSido, fetchSigungu, fetchShelters, fetchLostAnimals };

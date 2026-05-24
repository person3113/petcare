async function fetchAnimals() {
  const response = await fetch('/mock/animals.json');
  if (!response.ok) {
    throw new Error('동물 데이터를 불러오지 못했습니다.');
  }
  const data = await response.json();
  return data?.data?.items || [];
}

async function fetchSido() {
  const response = await fetch('/mock/codes_sido.json');
  if (!response.ok) {
    throw new Error('시도 데이터를 불러오지 못했습니다.');
  }
  const data = await response.json();
  return data?.data || [];
}

async function fetchSigungu(sidoCode) {
  const response = await fetch('/mock/codes_sigungu.json');
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  const list = data?.data || [];
  return list.filter((item) => item.sidoCode === sidoCode);
}

async function fetchShelters(sigunguCode) {
  const response = await fetch('/mock/shelters.json');
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  const list = data?.data || [];
  return list.filter((item) => item.sigunguCode === sigunguCode);
}

// 분실동물 목록 불러오기 (Mock JSON)
async function fetchLostAnimals() {
  const response = await fetch('/mock/lost_animals.json');
  if (!response.ok) {
    throw new Error('분실동물 데이터를 불러오지 못했습니다.');
  }
  const data = await response.json();
  return data?.data?.items || [];
}

export { fetchAnimals, fetchSido, fetchSigungu, fetchShelters, fetchLostAnimals };

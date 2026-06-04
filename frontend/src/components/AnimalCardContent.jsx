import React from 'react';

// 포맷 유틸리티
export function formatKind(kind) {
  if (!kind) return { species: '미상', breed: '품종 미상' };
  
  const match = kind.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    const species = match[1].trim();
    const breed = match[2].trim() || '품종 미상';
    return { species, breed };
  }
  return { species: '미상', breed: kind.trim() };
}

export function formatAge(ageStr) {
  if (!ageStr) return '나이 미상';
  const yearMatch = ageStr.match(/(\d{4})/);
  if (yearMatch && ageStr.includes('년생')) {
    return `${yearMatch[1]}년생`;
  }
  return ageStr;
}

function AnimalCardContent({ animal, variant = 'list' }) {
  const { species, breed } = formatKind(animal.kind);
  const status = animal.status;
  
  // 구조동물은 보호소 우선, 분실동물(status === '분실')은 발견장소 우선
  const location = status === '분실' 
    ? (animal.discoveryPlace || animal.shelterName || '위치 미상') 
    : (animal.shelterName || animal.discoveryPlace || '위치 미상');
    
  const age = formatAge(animal.age);
  const gender = animal.gender || '미상';

  const isSwipe = variant === 'swipe';
  const paddingClass = isSwipe ? 'p-6' : 'p-4';
  const titleSizeClass = isSwipe ? 'text-xl' : 'text-base';
  const badgeSizeClass = isSwipe ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <div className={`flex flex-1 flex-col ${paddingClass}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            {species !== '미상' && (
              <span className={`rounded-md bg-indigo-50 font-medium text-indigo-700 ${badgeSizeClass}`}>
                {species}
              </span>
            )}
            <p className={`line-clamp-1 font-semibold text-gray-900 ${titleSizeClass}`}>
              {breed}
            </p>
          </div>
          <p className="line-clamp-1 text-sm text-gray-600">{location}</p>
        </div>
        {status && (
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status === '분실' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {status}
          </span>
        )}
      </div>
      
      <div className="mt-auto flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg font-medium text-gray-800">
          {gender}
        </div>
        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg font-medium text-gray-800">
          {age}
        </div>
      </div>
    </div>
  );
}

export default AnimalCardContent;

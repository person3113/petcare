import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function MatchResult() {
  const location = useLocation();
  const data = location.state || {};
  const items = data.items || [];
  const pagination = data.pagination;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '12px' }}>설문 결과</h1>
      <p style={{ color: '#666', marginBottom: '16px' }}>
        조건에 맞는 동물 목록입니다.
      </p>

      {items.length === 0 && (
        <p>결과가 없습니다. 조건을 바꿔서 다시 시도해 주세요.</p>
      )}

      {items.length > 0 && (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {items.map((animal) => (
            <div
              key={animal.id}
              style={{
                border: '1px solid #eee',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{animal.kind}</div>
              {animal.images?.[0] && (
                <img
                  src={animal.images[0]}
                  alt={animal.kind}
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <p style={{ margin: '8px 0 4px 0' }}>상태: {animal.status}</p>
              <p style={{ margin: '0 0 8px 0' }}>지역: {animal.jurisdiction}</p>
              <Link to={`/animal/${animal.id}`}>상세 보기</Link>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <p style={{ marginTop: '16px', color: '#666' }}>
          총 {pagination.totalCount}건, {pagination.page} / {pagination.totalPages} 페이지
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/survey">설문 다시하기</Link>
      </div>
    </div>
  );
}

export default MatchResult;

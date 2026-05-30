import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnimals } from '../api/animals.js';
import { fetchLostAnimals } from '../api/animals.js';
import { fetchPosts } from '../api/posts.js';

function SearchModal({ isOpen, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState({ animals: [], lostAnimals: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // 로컬스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // 모달 열릴 때 포커스 및 초기화
  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setResults({ animals: [], lostAnimals: [], posts: [] });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounce 적용 (0.5초)
  useEffect(() => {
    if (!keyword.trim()) {
      setResults({ animals: [], lostAnimals: [], posts: [] });
      return;
    }

    const delayDebounce = setTimeout(() => {
      performSearch(keyword);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const saveRecentSearch = (term) => {
    const termTrimmed = term.trim();
    if (!termTrimmed) return;
    const newSearches = [termTrimmed, ...recentSearches.filter(s => s !== termTrimmed)].slice(0, 5);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const removeRecentSearch = (term) => {
    const newSearches = recentSearches.filter(s => s !== term);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  const performSearch = async (term) => {
    setLoading(true);
    try {
      // Promise.all로 3개 API 동시 호출
      const [animalData, lostData, postData] = await Promise.all([
        fetchAnimals({ keyword: term, limit: 3 }),
        fetchLostAnimals({ keyword: term, limit: 3 }),
        fetchPosts(null, term)
      ]);
      setResults({
        animals: (animalData || []).slice(0, 3),
        lostAnimals: (lostData || []).slice(0, 3),
        posts: (postData || []).slice(0, 3)
      });
    } catch (error) {
      console.error('검색 실패', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (keyword.trim()) {
        saveRecentSearch(keyword);
        onClose();
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-[560px] shadow-2xl m-4" onClick={(e) => e.stopPropagation()}>
        {/* 검색 인풋 */}
        <div className="flex items-center border-2 border-gray-800 rounded-lg px-3 py-2 mb-4">
          <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 outline-none text-[15px]"
            placeholder="통합 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2">ESC</span>
        </div>

        {/* 검색어가 없을 때 최근 검색어 */}
        {!keyword.trim() && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">최근 검색</div>
            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <div key={idx} className="flex items-center border border-gray-300 rounded-full pl-3 pr-1 py-1 text-[13px] text-gray-700">
                    <span className="cursor-pointer mr-1" onClick={() => { setKeyword(term); }}>{term}</span>
                    <button className="text-gray-400 hover:text-gray-600 px-1 rounded-full" onClick={() => removeRecentSearch(term)}>×</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-400">최근 검색어가 없습니다.</div>
            )}
          </div>
        )}

        {/* 검색 결과 렌더링 */}
        {keyword.trim() && (
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="text-xs text-gray-400 mb-2">검색 결과 {loading && '(로딩중...)'}</div>
            
            {!loading && results.animals.length === 0 && results.lostAnimals.length === 0 && results.posts.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">일치하는 결과가 없습니다.</div>
            )}

            {/* 구조동물 */}
            {results.animals.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-1">구조 동물</div>
                {results.animals.map((animal) => (
                  <div key={animal.id} className="flex items-center gap-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => { onClose(); navigate(`/animal/${animal.id}`); }}>
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                       {animal.images?.[0] ? <img src={animal.images[0]} alt="thumb" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-800">{animal.kind || '품종 모름'}</div>
                      <div className="text-xs text-gray-500">{animal.shelterName}</div>
                    </div>
                    <span className="text-xs text-gray-400">{animal.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 분실동물 */}
            {results.lostAnimals.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-orange-500 mb-1">분실 동물</div>
                {results.lostAnimals.map((animal) => (
                  <div key={animal.id} className="flex items-center gap-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-orange-50" onClick={() => { onClose(); navigate(`/lost-animals/${animal.id}`); }}>
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
                      {animal.images?.[0] ? <img src={animal.images[0]} alt="thumb" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200"></div>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-800">{animal.kind || '품종 모름'}</div>
                      <div className="text-xs text-gray-500">{animal.discoveryPlace}</div>
                    </div>
                    <span className="text-xs text-orange-400">{animal.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 커뮤니티 */}
            {results.posts.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-semibold text-blue-500 mb-1">커뮤니티</div>
                {results.posts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50" onClick={() => { onClose(); navigate(`/community/${post.id}`); }}>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-800 truncate">{post.title}</div>
                      <div className="text-xs text-gray-500 truncate">{post.content}</div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{post.category === 'adoption_review' ? '입양후기' : '분실목격'}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        <div className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:text-gray-600" onClick={(e) => {
             if(keyword.trim()) {
                 saveRecentSearch(keyword);
                 onClose();
                 navigate(`/search?q=${encodeURIComponent(keyword)}`);
             }
        }}>
          Enter — 전체 결과 보기
        </div>
      </div>
    </div>
  );
}

export default SearchModal;

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchAnimalsPage } from '../api/animals.js';
import { fetchLostAnimals } from '../api/animals.js';
import { fetchPosts } from '../api/posts.js';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    animals: [],
    animalsCount: 0,
    lostAnimals: [],
    posts: []
  });

  useEffect(() => {
    if (!keyword) {
      setLoading(false);
      return;
    }

    const loadData = () => {
      setLoading(true);
      fetchAnimalsPage({ keyword, limit: 20 })
        .then(animalsRes => {
          fetchLostAnimals({ keyword })
            .then(lostAnimalsRes => {
              fetchPosts(null, keyword)
                .then(postsRes => {
                  setResults({
                    animals: animalsRes?.items || [],
                    animalsCount: animalsRes?.pagination?.totalCount || animalsRes?.items?.length || 0,
                    lostAnimals: lostAnimalsRes || [],
                    posts: postsRes || []
                  });
                  setLoading(false);
                })
                .catch(e => {
                  console.log("글 에러", e);
                  setLoading(false);
                });
            })
            .catch(e => {
              console.log("분실 에러", e);
              setLoading(false);
            });
        })
        .catch(e => {
          console.log("동물 에러", e);
          setLoading(false);
        });
    };

    loadData();
  }, [keyword]);

  if (!keyword) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <h2 className="text-xl text-gray-500 font-medium">검색어를 입력해주세요.</h2>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        "<span className="text-orange-500">{keyword}</span>" 검색 결과
      </h1>

      {loading ? (
        <div className="text-center py-20 text-gray-500">결과를 불러오는 중입니다...</div>
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* 구조 동물 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">구조 동물 ({results.animalsCount})</h2>
              {results.animals.length > 0 && (
                 <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => navigate(`/animals?keyword=${keyword}`)}>더보기 {'>'}</button>
              )}
            </div>
            {results.animals.length === 0 ? (
              <div className="text-sm text-gray-400 p-4 bg-gray-50 rounded-lg text-center">일치하는 구조 동물이 없습니다.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.animals.slice(0, 4).map(animal => (
                  <div key={animal.id} onClick={() => navigate(`/animal/${animal.id}`)} className="cursor-pointer group">
                    <div className="w-full aspect-square rounded-xl bg-gray-200 overflow-hidden mb-2">
                       {animal.images?.[0] ? <img src={animal.images[0]} alt="thumb" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full bg-gray-200"></div>}
                    </div>
                    <div className="text-sm font-semibold truncate">{animal.kind || '품종 모름'}</div>
                    <div className="text-xs text-gray-500 truncate">{animal.shelterName}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 분실 동물 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-orange-600">분실 동물 ({results.lostAnimals.length})</h2>
               {results.lostAnimals.length > 0 && (
                 <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => navigate(`/lost-animals?keyword=${keyword}`)}>더보기 {'>'}</button>
              )}
            </div>
            {results.lostAnimals.length === 0 ? (
              <div className="text-sm text-gray-400 p-4 bg-orange-50 rounded-lg text-center">일치하는 분실 동물이 없습니다.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.lostAnimals.slice(0, 4).map(animal => (
                  <div key={animal.id} onClick={() => navigate(`/lost-animals/${animal.id}`)} className="cursor-pointer group">
                    <div className="w-full aspect-square rounded-xl bg-gray-200 overflow-hidden mb-2">
                       {animal.images?.[0] ? <img src={animal.images[0]} alt="thumb" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full bg-gray-200"></div>}
                    </div>
                    <div className="text-sm font-semibold truncate">{animal.kind || '품종 모름'}</div>
                    <div className="text-xs text-gray-500 truncate">{animal.discoveryPlace}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 커뮤니티 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-600">커뮤니티 ({results.posts.length})</h2>
               {results.posts.length > 0 && (
                 <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => navigate(`/community?keyword=${keyword}`)}>더보기 {'>'}</button>
              )}
            </div>
            {results.posts.length === 0 ? (
              <div className="text-sm text-gray-400 p-4 bg-blue-50 rounded-lg text-center">일치하는 게시글이 없습니다.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.posts.slice(0, 5).map(post => (
                  <div key={post.id} onClick={() => navigate(`/community/${post.id}`)} className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 cursor-pointer transition-colors">
                     <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-gray-800 truncate pr-4">{post.title}</div>
                        <span className="text-xs text-gray-400 shrink-0">{post.category === 'adoption_review' ? '입양후기' : '분실목격'}</span>
                     </div>
                     <div className="text-sm text-gray-500 line-clamp-2">{post.content}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
}

export default SearchPage;

import React, { useState, useEffect } from 'react';
import UserProfile from "../components/mypage/UserProfile.jsx";
import SurveyHistory from "../components/mypage/SurveyHistory.jsx";
import FavoriteList from "../components/mypage/FavoriteList.jsx";
import { getFavoritesCount } from '../api/favorites.js';


function MyPage() {
  const [activeTab, setActiveTab] = useState('survey');
  const [favoriteCount, setFavoriteCount] = useState(0); //찜 개수를 위한

  useEffect(() => {
    getFavoritesCount()
        .then(res => {
          setFavoriteCount(res?.data ?? res ?? 0);
        });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <UserProfile favoriteCnt={favoriteCount}/>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('survey')}
            className={
              activeTab === 'survey'
                ? 'border-b-2 border-amber-400 px-4 py-2 text-sm font-semibold text-amber-600'
                : 'px-4 py-2 text-sm text-gray-500'
            }
          >
            설문 기록
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={
              activeTab === 'favorites'
                ? 'border-b-2 border-amber-400 px-4 py-2 text-sm font-semibold text-amber-600'
                : 'px-4 py-2 text-sm text-gray-500'}
          >
            찜한 동물
          </button>
        </div>

        <div className="mt-2">
          {activeTab === 'survey' && <SurveyHistory />}
          {activeTab === 'favorites' && <FavoriteList onFavoriteDeleted={() => setFavoriteCount(prev => Math.max(0, prev - 1))} />}
        </div>
      </div>
    </div>
  );
}

export default MyPage;

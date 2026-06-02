import React, { useState } from 'react';
import UserProfile from "../components/mypage/UserProfile.jsx";
import SurveyHistory from "../components/mypage/SurveyHistory.jsx";
import FavoriteList from "../components/mypage/FavoriteList.jsx";



function MyPage() {
  const [activeTab, setActiveTab] = useState('survey');

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <UserProfile/>
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
          {activeTab === 'favorites' && <FavoriteList />}
        </div>
      </div>
    </div>
  );
}

export default MyPage;

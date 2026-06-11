import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';


function UserProfile({favoriteCnt}){

    const { user }=useAuth();

    //로컬스토리지에 저장한 스와이프 수 가져오기
    const [todaySwipe] = useState(() => {
        const today = new Date().toLocaleDateString();
        const stats = JSON.parse(localStorage.getItem('daily_swipes') || '{"date":"","count":0}');
        return stats.date === today ? stats.count : 0;
    });

    if(!user){
        return(<div>사용자 정보 로딩 또는 로그인이 필요함.......</div>)
    }
    return(
        <div className="bg-white flex items-center justify-between rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex gap-6 items-center">
                <div className="w-24 h-24 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center text-4xl font-bold border border-orange-100 shrink-0">
                    {user.nickname.charAt(0)}
                </div>

                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800">{user.nickname}님</h2>
                    <p className="text-sm text-gray-500 mt-1">가입일: {user.createdAt || '정보 없음'}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center w-36 h-24 border border-gray-200 rounded-2xl bg-white">
                    <h2 className="text-sm text-gray-500 mb-1 font-medium">스와이프</h2>
                    <p className="text-2xl font-bold text-gray-800">{todaySwipe}</p>
                </div>
                <div className="flex flex-col items-center justify-center w-36 h-24 border border-gray-200 rounded-2xl bg-white">
                    <h2 className="text-sm text-gray-500 mb-1 font-medium">관심 동물</h2>
                    <p className="text-2xl font-bold text-gray-800">{favoriteCnt}</p>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
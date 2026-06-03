import { useAuth } from '../../context/AuthContext';
import React, { useState } from 'react';


function UserProfile({favoriteCnt}){

    const { user }=useAuth();

    //localstorage에 저장한 스와이프 수 가져오기
    const [todaySwipe] = useState(() => {
        const today = new Date().toLocaleDateString();
        const stats = JSON.parse(localStorage.getItem('daily_swipes') || '{"date":"","count":0}');
        return stats.date === today ? stats.count : 0;
    });

    const boxstyle={
        background: 'whilt',
        border: '2px solid #d1d5db',
        borderRadius: '25px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    }

    if(!user){
        return(<div>사용자 정보 로딩 또는 로그인이 필요함.......</div>)
    }
    return(
        <div className="bg-white flex flex-col rounded-lg p-10">
            <div className="flex gap-5">
                <div
                    style={{
                        backgroundColor: 'yellow',
                        width:'128px',
                        height:'128px',
                        borderRadius:'50%',
                        border: '1px solid yellow',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '50px',
                        textAlign:'center',
                        fontSize: '40px',
                    }}>
                    {user.nickname.charAt(0)}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <h2 style={{color:"black"}}>{user.nickname}님</h2>
                    <p className="text-xs">가입일: {user.createdAt}</p>
                </div>
            </div>
            <div className="flex gap-10 justify-center items-center pt-15">
                <div className="flex flex-col items-center justify-center w-[450px] h-[150px]"
                    style={boxstyle}>
                    <h2>스와이프</h2>
                    <p>{todaySwipe}</p>
                </div>
                <div className="flex flex-col items-center justify-center w-[450px] h-[150px]"
                style={boxstyle}>
                    <h2>관심 동물</h2>
                    <p>{favoriteCnt}</p>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>펫케어 홈</h1>
      <p>로그인 상태에 따라 기능이 열립니다.</p>
      <div>
        <p>{user ? '로그인됨' : '로그인 필요'}</p>
      </div>
    </div>
  );
}

export default Home;

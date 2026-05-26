import React from 'react'; //리엑트 파일이라는 의미
import { Outlet } from 'react-router-dom'; //Outlet을 사용하기 위해 import
import Navbar from '../components/Navbar.jsx'; // 나중에 만들 컴포넌트
import Footer from '../components/Footer.jsx'; // 나중에 만들 컴포넌트

function Layout() {
    //min-w-[375px]:최소 모바일 해상도 보장
    //max-w-[1200px]:pc화면 최대 크기
    //mx-auto:마진오토 px-4:패딩 x축(좌우) 16px"
  return (
    <div className="min-w-[375px] max-w-[1200px] mx-auto px-4">
      <header>
          <Navbar /> {/* 네비게이션 바 컴포넌트 */}
      </header>

      <main>       {/*상세 페이지의 내용이 바뀔 부분*/}
          <Outlet />
      </main>

      <footer>
        <Footer /> {/*  푸터 컴포넌트 */}

      </footer>
    </div>
  );
}

export default Layout; //이 컴포넌트를 추출하겠다(다른 파일에서 사용가능)
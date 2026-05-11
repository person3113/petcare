import React from 'react'; //리엑트 파일이라는 의미
import { Outlet } from 'react-router-dom'; //Outlet을 사용하기 위해 import
import Navbar from '../components/Navbar'; // 나중에 만들 컴포넌트
import Footer from '../components/Footer'; // 나중에 만들 컴포넌트

function Layout() {
  return (
    <div>
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
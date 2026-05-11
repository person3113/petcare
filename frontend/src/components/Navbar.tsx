import React from 'react'; //리엑트 파일이라는 의미
import { Link } from 'react-router-dom';

function Navbar() {
    return(
        <header>
            <div id="nav_logo">  {/* 로고 부분 */}
                <p>Logo</p>
            </div>
            <nav>
                <div id="menu"> {/* 메뉴 부분 */}
                    <Link to="#">입양하기</Link>  {/* 다른페이지로 가기 위한 링크 현재는 빈경로 */}
                    <Link to="#">인연찾기</Link>
                    <Link to="#">지도</Link>
                    <Link to="#">통계</Link>
                </div>
            </nav>
            <div>
                <button>로그인</button>
                <button>회원가입</button>
            </div>

        </header>
    )
}

export default Navbar;
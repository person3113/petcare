import React from 'react';
// import Home from './pages/Home.jsx'  // 홈이 있으면 나중에 추가
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
    const {user, loading } = useAuth();
    const navigate = useNavigate();

    // 페이지 복원 중 렌더링을 지연해서 깜박임 방지
    if(loading) return null;

    return (
        <nav>
            {/* 네비게이션바 우측 */}
            <div className="nav-logo">
                {/* 로고 이미지가 생긴다면 */}
                <span id = "nav-logo" onClick={()=>navigate('/')}>POING</span>
            </div>
            {/* 메뉴옵션들 */}
            <div className="nav-menu">
                <ul>
                    <li className="nav-menu-item" onClick={()=>navigate('')}>입양하기</li>
                    <li className="nav-menu-item" onClick={()=>navigate('')}>인연찾기</li>
                    <li className="nav-menu-item" onClick={()=>navigate('')}>지도</li>
                    <li className="nav-menu-item" onClick={()=>navigate('')}>통계</li>
                </ul>
            </div>
            {/* 네비게이션바 좌측 */}
            <div className="nav-left">
                {user ?
                    (   <>
                            {/* 유저가 로그인된 상태일때 프로필버튼 보여주기 */}
                            <button id="nav-profile" onClick={()=>navigate('/profile')}>profile</button>
                        </>
                    )
                    :(
                        <>
                            {/* 유저가 로그인하지 않았다면 회원가입/로그인을 보여주기 */}
                            <button id="nav-login" onClick={()=>navigate('/login')}>login</button>
                            <button id="nav-signup" onClick={()=>navigate('/signup')}>signup</button>
                        </>
                    )
                    }
            </div>
        </nav>
        );
    };

export default Navbar;
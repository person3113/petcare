import React from 'react'; //리엑트 파일이라는 의미
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            // 서버 응답 실패여도 프론트 상태는 초기화
        } finally {
            setUser(null);
            navigate('/');
        }
    }

    return(
        <header>
            <div id="nav_logo">  {/* 로고 부분 */}
                <p>Logo</p>
            </div>
            <nav>
                <div id="menu"> {/* 메뉴 부분 */}
                    <Link to="#">입양하기</Link>  {/* 다른페이지로 가기 위한 링크 현재는 빈경로 */}
                    <Link to="/lost-animals">분실동물</Link>
                    <Link to="/survey">인연찾기</Link>
                    <Link to="#">지도</Link>
                    <Link to="#">통계</Link>
                    <Link to="/mypage">마이페이지</Link>
                </div>
            </nav>
            <div>
                {user ? (
                    <>
                        <span>{user.nickname || user.email}</span>
                        <button type="button" onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/register">회원가입</Link>
                    </>
                )}
            </div>

        </header>
    )
}

export default Navbar;

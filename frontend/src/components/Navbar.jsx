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
        <header className="flex items-center justify-between px-10 py-5 border-b border-gray-200">
            <div id="nav_logo">  {/* 로고 부분 */}
                <p className="text-xl font-medium cursor-pointer">Logo</p>
            </div>
            <nav>
                <div id="menu" className="flex gap-8"> {/* 메뉴 부분 */}
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="#">입양하기</Link>  {/* 다른페이지로 가기 위한 링크 현재는 빈경로 */}
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="/lost-animals">분실동물</Link>
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="/survey">인연찾기</Link>
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="#">지도</Link>
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="#">통계</Link>
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="/community">커뮤니티</Link>
                    <Link className="text-sm text-gray-600 cursor-pointer hover:text-gray-900" to="/mypage">마이페이지</Link>
                </div>
            </nav>
            <div className="flex gap-3 items-center">
                {user ? (
                    <>
                        <span className="text-sm text-gray-600">{user.nickname || user.email}</span>
                        <button className="text-sm px-4 py-2 text-gray-600 rounded-md hover:bg-gray-50" type="button" onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link className="text-sm text-gray-600 hover:bg-gray-300" to="/login">로그인</Link>
                        <Link className="text-sm px-4 py-2 text-gray-600 hover:bg-gray-300" to="/register">회원가입</Link>
                    </>
                )}
            </div>

        </header>
    )
}

export default Navbar;

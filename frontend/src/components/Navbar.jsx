import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import Searchbar from './Searchbar.jsx';

function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            // 서버 응답 실패여도 프론트 상태는 초기화
        } finally {
            setUser(null);
            setIsDropdownOpen(false);
            navigate('/');
        }
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="custom-header">
            <div className="header-left">
                {/* 로고 부분 */}
                <div className="logo" onClick={() => navigate('/')}>
                    PETCARE
                </div>

                {/* 메뉴 부분 */}
                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/animalswipe/1" className={({ isActive }) => isActive ? 'active' : ''}>동물 스와이프</NavLink>
                    <NavLink to="/survey" className={({ isActive }) => isActive ? 'active' : ''}>인연찾기</NavLink>
                    
                    <span className="nav-separator">|</span>
                    
                    <NavLink to="/animals" className={({ isActive }) => isActive ? 'active' : ''}>입양하기</NavLink>
                    <NavLink to="/lost-animals" className={({ isActive }) => isActive ? 'active' : ''}>분실동물</NavLink>
                    
                    <span className="nav-separator">|</span>
                    
                    <NavLink to="/map" className={({ isActive }) => isActive ? 'active' : ''}>지도</NavLink>
                    <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>커뮤니티</NavLink>
                </nav>
            </div>

            <div className="header-right">
                {/* 검색창 */}
                <Searchbar />

                {user ? (
                    /* 로그인 상태 */
                    <div className="user-actions">
                        <span className="dot"></span>
                        <div className="user-dropdown-container">
                            <button type="button" className="nickname-btn" onClick={toggleDropdown}>
                                {user.nickname || user.email} {isDropdownOpen ? '▲' : '▼'}
                            </button>
                            {isDropdownOpen && (
                                <div className="user-dropdown-menu">
                                    <button 
                                        type="button" 
                                        className="dropdown-item" 
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/mypage');
                                        }}
                                    >
                                        마이페이지
                                    </button>
                                    <button 
                                        type="button" 
                                        className="dropdown-item" 
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* 비로그인 상태 */
                    <div className="guest-actions">
                        <Link to="/login" className="login-btn">로그인</Link>
                        <Link to="/register" className="register-btn">시작하기</Link>
                    </div>
                )}

                {/* 햄버거 메뉴 버튼 (모바일용) */}
                <button className="hamburger-btn" onClick={toggleMenu}>
                    ☰
                </button>
            </div>
        </div>
    );
}

export default Navbar;


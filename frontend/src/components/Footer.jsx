import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-white border border-gray-200 rounded-2xl p-8 my-8 text-left">
      {/* 상단 영역: 브랜드와 메뉴 컬럼들 */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8">
        
        {/* 브랜드 블록 */}
        <div className="max-w-xs">
          <h2 className="text-xl font-bold text-gray-900">Petcare</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            유기동물과 새 가족을<br />
            연결하는 매칭 서비스
          </p>
        </div>

        {/* 메뉴 링크 그룹 */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          {/* 서비스 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">서비스</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/survey" className="hover:underline hover:text-accent transition-colors">인연 찾기</Link></li>
              <li><Link to="/animalswipe/1" className="hover:underline hover:text-accent transition-colors">동물 스와이프</Link></li>
              <li><Link to="/animals" className="hover:underline hover:text-accent transition-colors">입양하기</Link></li>
              <li><Link to="/survey" className="hover:underline hover:text-accent transition-colors">매칭 테스트</Link></li>
              <li><Link to="/map" className="hover:underline hover:text-accent transition-colors">보호소 지도</Link></li>
              <li><Link to="/stats" className="hover:underline hover:text-accent transition-colors">통계</Link></li>
            </ul>
          </div>

          {/* 커뮤니티 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">커뮤니티</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/community" className="hover:underline hover:text-accent transition-colors">입양후기</Link></li>
              <li><Link to="/community" className="hover:underline hover:text-accent transition-colors">질문</Link></li>
              <li><Link to="/lost-animals" className="hover:underline hover:text-accent transition-colors">분실·목격</Link></li>
              <li><Link to="/community" className="hover:underline hover:text-accent transition-colors">일상</Link></li>
            </ul>
          </div>

          {/* 정보 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">정보</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/" className="hover:underline hover:text-accent transition-colors">공지사항</Link></li>
              <li><Link to="/" className="hover:underline hover:text-accent transition-colors">이용약관</Link></li>
              <li><Link to="/" className="hover:underline hover:text-accent transition-colors">개인정보처리방침</Link></li>
              <li><Link to="/" className="hover:underline hover:text-accent transition-colors">문의하기</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 하단 영역: 구분선 및 저작권 / SNS */}
      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © 2026 Petcare. All rights reserved.
        </p>

        {/* SNS 버튼 (react-icons 사용) */}
        <div className="flex gap-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-pink-50 hover:bg-pink-100 transition-colors flex items-center justify-center text-pink-600" aria-label="Instagram">
            <FaInstagram size={16} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-pink-50 hover:bg-pink-100 transition-colors flex items-center justify-center text-pink-600" aria-label="Facebook">
            <FaFacebookF size={14} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-pink-50 hover:bg-pink-100 transition-colors flex items-center justify-center text-pink-600" aria-label="Twitter">
            <FaTwitter size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

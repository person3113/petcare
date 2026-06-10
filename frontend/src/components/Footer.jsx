import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border border-gray-200 rounded-2xl p-8 my-8 text-left">
      {/* 상단 영역: 브랜드와 메뉴 컬럼들 */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8">
        
        {/* 브랜드 블록 */}
        <div className="max-w-xs">
          <h2 className="text-xl font-bold !text-text-a">Petcare</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            유기동물과 새 가족을<br />
            연결하는 매칭 서비스
          </p>
        </div>

        {/* 메뉴 링크 그룹 */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          {/* 서비스 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold !text-text-a mb-3">서비스</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:underline">인연 찾기</a></li>
              <li><Link to="/animalswipe/1" className="hover:underline">동물 스와이프</Link></li>
              <li><a href="#" className="hover:underline">입양하기</a></li>
              <li><a href="#" className="hover:underline">매칭 테스트</a></li>
              <li><a href="#" className="hover:underline">보호소 지도</a></li>
              <li><a href="#" className="hover:underline">통계</a></li>
            </ul>
          </div>

          {/* 커뮤니티 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold !text-text-a mb-3">커뮤니티</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:underline">입양후기</a></li>
              <li><a href="#" className="hover:underline">질문</a></li>
              <li><a href="#" className="hover:underline">분실·목격</a></li>
              <li><a href="#" className="hover:underline">일상</a></li>
            </ul>
          </div>

          {/* 정보 컬럼 */}
          <div>
            <h3 className="text-sm font-semibold !text-text-a mb-3">정보</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#" className="hover:underline">공지사항</a></li>
              <li><a href="#" className="hover:underline">이용약관</a></li>
              <li><a href="#" className="hover:underline">개인정보처리방침</a></li>
              <li><a href="#" className="hover:underline">문의하기</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 하단 영역: 구분선 및 저작권 / SNS */}
      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400">
          © 2026 Petcare. All rights reserved.
        </p>

        {/* SNS 버튼 (Figma에 명시된 심플한 핑크빛 사각형 버튼 구조) */}
        <div className="flex gap-2">
          <a href="#" className="w-8 h-8 rounded bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center text-xs text-accent font-semibold" aria-label="Instagram">IG</a>
          <a href="#" className="w-8 h-8 rounded bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center text-xs text-accent font-semibold" aria-label="Facebook">FB</a>
          <a href="#" className="w-8 h-8 rounded bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center text-xs text-accent font-semibold" aria-label="Twitter">TW</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

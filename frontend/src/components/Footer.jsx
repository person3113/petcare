import React from 'react'; //리엑트 파일이라는 의미

function Footer(){
    return(
    <footer className="border-t auto">
        <div id="footer_logo" className="flex justify-between gap-2">  {/* 로고 부분 */}
            <h1 className="text-xl text-gray-600 mt-2">Logo</h1>
            <p className="text-sm text-gray">유기동물과 새 가족을 연결하는 매칭 서비스</p>
        </div>
        <div className="flex flex-col gap-3">  {/* footer내용 부분 */}
            <h4 className="text-sm font-medium text-gray-900">서비스</h4>
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">입양하기</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">인연찾기</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">매칭 테스트</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">보호소 지도</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">통계</li>
            </ul>

            <h4 className="text-sm font-medium text-gray-900">커뮤니티</h4>
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">입양후기</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">질문</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">분실 목격</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">일상</li>
            </ul>

            <h4 className="text-sm font-medium text-gray-900">정보</h4>
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">공지사항</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">이용약관</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">개인정보처리방침</li>
                <li className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">문의하기</li>
            </ul>
        </div>
    </footer>

    )

}

export default Footer;
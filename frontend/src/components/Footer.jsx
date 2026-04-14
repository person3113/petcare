import React from 'react'; //리엑트 파일이라는 의미

function Footer(){
    return(
    <footer>
        <div id="footer_logo">  {/* 로고 부분 */}
            <h1>Logo</h1>
            <p>유기동물과 새 가족을 연결하는 매칭 서비스</p>
        </div>
        <div>  {/* footer내용 부분 */}
            <h4>서비스</h4>
            <ul>
                <li>입양하기</li>
                <li>인연찾기</li>
                <li>매칭 테스트</li>
                <li>보호소 지도</li>
                <li>통계</li>
            </ul>

            <h4>커뮤니티</h4>
            <ul>
                <li>입양후기</li>
                <li>질문</li>
                <li>분실 목격</li>
                <li>일상</li>
            </ul>

            <h4>정보</h4>
            <ul>
                <li>공지사항</li>
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>문의하기</li>
            </ul>
        </div>
    </footer>

    )

}

export default Footer;
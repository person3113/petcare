import React,{ useState } from 'react';

function Searchbar(){

    const [searchText, setSearchText] = useState(''); //검색창내용, 그 값을 바꿀수있는 전용함수

    const SearchHandle=(event)=>{
        event.preventDefault(); //페이지 새로고침 방지

        //검색어 없을 경우
        if (searchText.trim().length === 0){
            alert("내용을 입력해주세요");
            return;
        }

        console.log("검색 내용", searchText);

        //todo:검색결과 페이지로 이동하는 부분
    }


    return (
        <form onSubmit={SearchHandle} className="header-search">
            <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="검색어를 입력하세요..."
                className="search-input"
            />
            <button type="submit" className="search-btn">검색</button>
        </form>
    );
}

export default Searchbar;

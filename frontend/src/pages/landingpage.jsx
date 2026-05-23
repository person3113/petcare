import React from 'react';
import ShowValue from '/components/landing/showvalue.jsx';
import { useNavigate } from "react-router-dom";

function Landing () {
    const navigate = useNavigate();
    return (
        <>
            <div className="landing-wrapper">
                {/* 만들어지고 나서 위치 수정하기, 일단 몰라서 임의로 작성해둠 */}
                <button onClick={()=>navigate('/findFriend')}>인연찾기</button>
                <button onClick={()=>navigate('/List')}>목록보기</button>
                <ShowValue />
            </div>
            <div className="">
                <button onClick={()=>navigate('/Swipe')}>스와이프</button>
                <button onClick={()=>navigate('/filterList')}>필터 목록</button>
                <button onClick={()=>navigate('/List')}>5문항 설문</button>
            </div>
            <div className="chartdata-section">
            </div>
        </>
        )
    }

export default Landing;
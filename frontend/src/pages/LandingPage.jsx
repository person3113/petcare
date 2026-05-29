import React from 'react';
import ShowValue from '../components/landing/ShowValue.jsx';
import { useNavigate } from "react-router-dom";
import Nav from '../components/Navbar.jsx';

function Landing () {
    const navigate = useNavigate();
    return (
        <>
            <div className="landing-wrapper">
                <Nav />
                {/* 만들어지고 나서 위치 수정하기, 일단 몰라서 임의로 작성해둠 */}
                <button onClick={()=>navigate('/matching')}>인연찾기</button>
                <button onClick={()=>navigate('/animals')}>목록보기</button>
                <ShowValue />
            </div>
            <div className="">
                <button onClick={()=>navigate('/animalswipe/:id')}>스와이프</button>
                <button onClick={()=>navigate('/animals')}>필터 목록</button>
                <button onClick={()=>navigate('/matching')}>5문항 설문</button>
            </div>
            <div className="chartdata-section">
                
            </div>
        </>
        )
    }

export default Landing;
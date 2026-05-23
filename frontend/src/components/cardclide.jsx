import React, {useState, useEffect} from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";  // 화살표 아이콘 호출, 사용 아이콘 Simple Line Icons
// css를 별도로 사용한다면 여기에 ~


function CardSlide(){
    const[now, setNow] = useState(0);  // 카드 슬라이드의 인덱스, 불러올거니깐 0으로 세팅
    // 서버통해서 DB 연동하기
    useEffect(()=>{
        // 데이터 가져오기
    },[]);

    // 자동 넘기기
    useEffect(()=>{
        // 일정시간마다 슬라이드가 넘어가도록 타이머로 시간 세팅
        const timer=setInterval(()=>{
            (prev => prev === cards.length - 1 ? 0 : prev + 1);
        };

        // 시간이 지났다면 타이머를 리셋
        return()=> clearInterval(timer);
    }, 5000);   // 시간 설정 5초

},[cards]);  // 만약 유저에 의해서 슬라이드가 넘어가도 타이머를 리셋하도록 의존성 추가

    // 이전카드
    const prevCard=()=>{
        // 인뎃스가 0이라면 카드인덱스의 가장 뒤로 아니면 인덱스-1
        setNow(prev => prev === 0 ? cards.length - 1 : prev - 1)
    }

    // 다음 카드
    const nextCard=()=>{
        // 인데스가 카드 인덱스의 마지막이라면 0으로 아니면 다음 인덱스로
        setNow(prev => prev === cards.length - 1 ? 0 : prev + 1)
    }

    return (
        <div className="card-slide">
            {/* 스왑하는 아이콘은 리액트 아이콘에서 호출 */}
            <button onClick={prevCard}><SlArrowLeft /></button>

            {/* 카드 부분, 임시로 두는 이름 */}
            <div className="card">
                <img scr={cards.[now].image} alt={cards[now].name} /> {/* 이미지 */}
                <p>{cards[now].name}</p>   {/* 이름 */}
                <p>{cards[now].intro}</p>  {/* 짧은 소개 */}
            </div>

            <button onClick={nextCard}><SlArrowRight /></button>
        </div>
    );
}
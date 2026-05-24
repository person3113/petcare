import React, { useState, useEffect } from 'react';
//AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/animalswipe/SwipeCard';
import SwipeSideBox from '../components/animalswipe/SwipeSideBox.jsx';

function AnimalSwipePage() {
    const [animals, setAnimals] = useState([]);//동물 정보 받을 곳
    const [nowIndex, setnowIndex] = useState(0); // 현재 보고 있는 카드의 인덱스
    const [exitX, setexitX] = useState(0); // 카드가 어느 방향으로 날아갈지 결정 (500 또는 -500)
    const [likeAnimal,setlikeAnimal]=useState(()=>{  //찜한 동물id 리스트 저장
        const saved = localStorage.getItem('likedId_list');
        const savedDate = localStorage.getItem('liked_date'); //찜한 날짜 저장
        const today = new Date().toLocaleDateString(); //오늘 날짜

        //데이터 존재하고, 오늘날짜랑 저장된 날짜 같으면(**오늘** 찜한 동물 있으면 이어서)
        if(saved && savedDate === today){
            return JSON.parse(saved); //문자열로 저장된 배열을 배열로 변환해서 리턴
        }
        //데이터 없거나 오늘날짜랑 저장된 날짜 다르면 빈배열(오늘 찜한 동물 없는 경우 또는 다음날 되면)
        else{
            return [];
        }
    });

    // 데이터 읽어오는 코드
    useEffect(() => {
        fetch('/mock/animals.json') //mock데이터 가져오기
            .then((res) => res.json())
            .then((mockData) => {
                //데이터 요청 성공했는지 and mockData의 data안의 items이 진짜 존재하는지
                if (mockData.success && mockData.data.items) {
                    setAnimals(mockData.data.items); //진짜 존재하면 넣기
                }
            })
            .catch((err) => console.error("데이터 로딩 실패:", err));
    }, []);


    //찜한 동물을 저장한 배열이 바뀌었을때 이를 localstorage에 저장
    useEffect(() => {
        const today = new Date().toLocaleDateString();

        //배열 문자열로 변환해서 저장
        localStorage.setItem('likedId_list', JSON.stringify(likeAnimal));
        localStorage.setItem('liked_date', today); //찜한 날짜도 저장
    }, [likeAnimal]); //찜한 동물 내용이 바뀔때마다 실행


    //데이터 안들어왔으면
    if (animals.length === 0) {
        return <div style={{ textAlign: 'center', margin: '50px' }}>데이터 로딩 중...</div>;
    }

    //동물 카드 무한루프를 위한 index(다 봤으면 index 0부터 다시)
    // usestate인 nowindex값이 바뀌면 컴포넌트 다시 시작하고 여기서 바뀐 currentAnimal로 dom그림
    const currentAnimal = animals[nowIndex % animals.length];

    //찜하기를 했을때 찜 개수 올려줄 함수
    const LikeCnt=(Id)=>{
        setlikeAnimal((prev)=> {
            //중복인 경우
            if(prev.includes(Id)){
                console.log("이미 찜한 동물");
                return prev;
            }
            //중복이 아닌 경우
            console.log("찜한 동물 추가:", Id);
            return [...prev,Id];
        });
    }

    return (
        <div className="Swipe-page" style={{
            height: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden', //부모 넘어가면 없애기
            backgroundColor: '#f9fafb'
        }}>
            <h2 className="Swipe-title" style={{color:"black", margin:'20px'}}>동물 친구 찾기</h2>

            <div style={{ 
                width: '100%', 
                maxWidth: '1200px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
            }}>
                {/* 카드 부분 */}
                <div style={{ flex:1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '340px', height: '520px' }}>
                        <AnimatePresence custom={exitX}>
                            <SwipeCard
                                //key가 바뀌어야 AnimatePresence(바로 아래자식의)가 카드 교체로 인식하고 애니메이션을 실행
                                key={currentAnimal.id + '-' + nowIndex}
                                currentAnimal={currentAnimal} //카드의 현재 동물
                                exitX={exitX} //어느 방향으로 밀었는지 나타낼값
                                setexitX={setexitX}
                                setnowIndex={setnowIndex}
                                onLike={LikeCnt}
                            />
                        </AnimatePresence>
                    </div>
                    {/* 하단 방향 설명 부분*/}
                    <div style={{ marginTop: '30px', display: 'flex', gap: '60px', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', opacity: 0.4 }}>
                            <div>👈</div>
                            <div style={{marginTop: '5px' }}>PASS</div>
                        </div>
                        <div style={{ textAlign: 'center', opacity: 0.4 }}>
                            <div>👉</div>
                            <div style={{ marginTop: '5px'}}>LIKE</div>
                        </div>
                    </div>
                </div>

                {/* 사이드바 컴포넌트 */}
                <div style={{ width:'350px', right:'20px'}}>
                    <SwipeSideBox LikeCnt={likeAnimal.length}/>
                </div>
            </div>

        </div>
    );
}

export default AnimalSwipePage;

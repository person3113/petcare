import React, { useState, useEffect } from 'react';
//motion:html태그에 애니메이션 사용가능,AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { motion, AnimatePresence } from 'framer-motion';
import { addFavorite } from '../api/favorites.js';

function AnimalSwipePage() {
    const [animals, setAnimals] = useState([]);//동물 정보 받을 곳
    const [nowIndex, setnowIndex] = useState(0); // 현재 보고 있는 카드의 인덱스
    const [exitX, setExitX] = useState(0); // 카드가 어느 방향으로 날아갈지 결정 (500 또는 -500)

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

    //데이터 안들어왔으면
    if (animals.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>데이터 로딩 중...</div>;
    }

    // 드래그가 끝났을 때 판단 async:기다려야 하는 함수임을 선언, await: 이 작업이 끝날때까지 대기
    const handleDragEnd = async (event, info, animal) => {
        //info.offset.x: 카드가 처음 위치에서 가로로 이동한 픽셀 값
        if (info.offset.x > 100) { //오른쪽으로 100픽셀 이상 밀었을때
            setExitX(500); // 오른쪽으로 날아가기 설정
            console.log(`${animal.kind} 찜하기!`); //찜하기
            try {
                await addFavorite(animal.id);
            } catch (err) {
                console.log("찜하기 API 호출 실패 (로그인 필요)",err);
            }
            //카드 인덱스 증가
            setnowIndex((prev) => prev + 1);
            
        } else if (info.offset.x < -100) {//왼쪽으로 100픽셀이상 밀었을때
            setExitX(-500); // 왼쪽으로 날아가기 설정
            console.log(`${animal.kind} 패스!`);
            // 다음 카드로 넘어가기 (인덱스 증가)
            setnowIndex((prev) => prev + 1);
        }
    };


    //동물 카드 무한루프를 위한 index(다 봤으면 index 0부터 다시)
    // usestate인 nowindex값이 바뀌면 컴포넌트 다시 시작하고 여기서 바뀐 currentAnimal로 dom그림
    const currentAnimal = animals[nowIndex % animals.length];

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
            
            <div style={{ position: 'relative', width: '340px', height: '520px' }}>
                <AnimatePresence custom={exitX}> {/*custom:하나의 카드가 어느방향으로 갔는지 exitX기억*/}
                    <motion.div
                        //key가 바뀌어야 AnimatePresence가 카드 교체로 인식하고 애니메이션을 실행
                        key={currentAnimal.id + '-' + nowIndex}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            cursor: 'grab'
                        }}
                        drag="x" //가로로 이동
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, info) => handleDragEnd(e, info, currentAnimal)}
                        
                        // 나타날 때 애니메이션: 선명해지며 살짝 위로 올라오는
                        initial={{ scale: 0.9, opacity: 0, y: 10 }} //초기값:크기 0.9,투명,y축 10만큼 아래
                        animate={{ scale: 1, opacity: 1, y: 0 }} //애니메이션: 크가1,선명,원래위치
                        
                        // 사라질 때 실행(exitX 방향으로 날아감)
                        exit={{ 
                            x: exitX,  //이 값이 왼,오 결정
                            opacity: 0, //날아가면서 투명해짐
                            rotate: exitX > 0 ? 25 : -25, // 날아갈 때 살짝 회전(+:시게방향,-:반시계)
                            transition: { duration: 0.3 } //0.3초동안
                        }}
                    >
                        {/* 카드 UI 디자인 */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: '28px',//모서리 둥글게
                            boxShadow: '0 15px 35px rgba(0,0,0,0.12)',//그림자
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <img 
                                src={currentAnimal.images[0]} 
                                alt={currentAnimal.kind} 
                                style={{ 
                                    width: '100%', 
                                    height: '360px', 
                                    objectFit: 'cover', 
                                    pointerEvents: 'none' //브라우져의 이미지파일 드래그 기능없애기
                                }} 
                            />
                            <div style={{ padding: '24px', flex:1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '24px'}}>{currentAnimal.kind}</h3>
                                    <span>{currentAnimal.gender}</span>
                                </div>
                                <p>나이: {currentAnimal.age}</p>
                                <p>색: {currentAnimal.color}</p>
                                <div>보호소: {currentAnimal.shelterName}</div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 하단 방향 설명 부분*/}
            <div style={{ margin: '30px', display: 'flex', gap: '60px' }}>
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
    );
}

export default AnimalSwipePage;

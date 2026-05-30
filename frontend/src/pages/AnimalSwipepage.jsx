import React, { useState, useEffect } from 'react';
//AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/animalswipe/SwipeCard';
import SwipeSideBox from '../components/animalswipe/SwipeSideBox.jsx';

function AnimalSwipePage() {
    const [animals, setAnimals] = useState([]);//전체 동물 정보 받을 곳
    const [filterAnimals, setFilterAnimals] = useState([]);//필터링되서 실제 화면에 나오는 동물 정보

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
    const [filter, setFilter] = useState({ //사이드 박스의 필터를 위한것
        //필터링 조건들 저장할 곳 (예시로 시도, 시군구 넣어봄)
        sido: '',  //시도
        sigungu: '',  //시군구
        shelterName: '',
        kind: '',
        status: '',
        gender: '',
        isNeutered: '',
        onlySocialized: false, //사회화 정보 여부
        onlyHealthy: false,   //건강상태 양호
    });


    // 데이터 읽어오는 코드
    useEffect(() => {
        fetch('/mock/animals.json') //mock데이터 가져오기
            .then((res) => res.json())
            .then((mockData) => {
                //데이터 요청 성공했는지 and mockData의 data안의 items이 진짜 존재하는지
                if (mockData.success && mockData.data.items) {
                    setAnimals(mockData.data.items); //진짜 존재하면 넣기
                    setFilterAnimals(mockData.data.items); //처음에는 필터링 안된 전체 목록
                }
            })
            .catch((err) => console.log("데이터 로딩 실패", err));
    }, []);


    //찜한 동물을 저장한 배열이 바뀌었을때 이를 localstorage에 저장
    useEffect(() => {
        const today = new Date().toLocaleDateString();

        //배열 문자열로 변환해서 저장
        localStorage.setItem('likedId_list', JSON.stringify(likeAnimal));
        localStorage.setItem('liked_date', today); //찜한 날짜도 저장
    }, [likeAnimal]); //찜한 동물 내용이 바뀔때마다 실행


    //데이터 안들어왔으면
    if (animals.length === 0 || filterAnimals.length === 0) {
        return <div className="py-12 text-center text-sm text-gray-500">데이터 로딩 중...</div>;
    }

    //동물 카드 무한루프를 위한 index(다 봤으면 index 0부터 다시)
    // usestate인 nowindex값이 바뀌면 컴포넌트 다시 시작하고 여기서 바뀐 currentAnimal로 dom그림
    const currentAnimal = filterAnimals.length > 0
        ? filterAnimals[nowIndex % filterAnimals.length] : null;

    //찜하기를 했을때 찜 개수 올려줄 함수
    const LikeCnt=(Id)=>{
        setlikeAnimal((prev)=> {
            //중복인 경우
            if(prev.includes(Id)){
                console.log("이미 찜한 동물");
                return prev;
            }
            //중복이 아닌 경우
            console.log("찜한 동물 추가", Id);
            return [...prev,Id];
        });
    }

    //==========================필터를 위한 부분================================

    //필터를 위해 데이터를 다시 불러오거나(API 호출), 목록을 걸러주는 함수
    const FilterChange = (newFilter)=>{
        setFilter(newFilter);

        //원본(Animals)에서 조건에 맞는 것만 걸러내기
        const FilterList = animals.filter(animal => {
            // 만약 축종 필터가 선택되어 있고, 동물의 축종과 다르면 탈락!
            if (newFilter.kind !== "" && animal.kind !== newFilter.kind) {
                return false;
            }
            if(newFilter.status !== "" && animal.processState !== newFilter.status){
                return false;
            }
            if(newFilter.gender !== "" && animal.sexCd !== newFilter.gender){
                return false;
            }
            if(newFilter.sido !== "" && !animal.careAddr.includes(newFilter.sido)){
                return false;
            }

            return true; // 모든 조건을 통과하면 합격!
        });

        //걸러진 결과만 저장
        setFilterAnimals(FilterList);

        //인덱스를 다시 0으로 돌려서 첫 번째 카드부터 보여주기
        setnowIndex(0);
    }



    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">동물 친구 찾기</h2>

                <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
                {/* 카드 부분 */}
                    <div className="flex flex-1 flex-col items-center">
                        <div className="relative h-[520px] w-[340px] items-start">
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
                        <div className="mt-8 flex gap-16 text-center text-sm text-gray-500">
                            <div>
                                <div>👈</div>
                                <div className="mt-1">PASS</div>
                            </div>
                            <div>
                                <div>👉</div>
                                <div className="mt-1">LIKE</div>
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 컴포넌트 */}
                    <div className="w-full max-w-xs">
                        <SwipeSideBox
                            LikeCnt={likeAnimal.length}
                            filter={filter}
                            onFilterChange={(e)=>{
                                const {name,value} = e.target;
                                const finalValue = type === 'checkbox' ? checked : value;
                                FilterChange({...filter, [name]: finalValue});
                            }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AnimalSwipePage;

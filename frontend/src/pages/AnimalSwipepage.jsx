import React, { useState, useEffect } from 'react';
//AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/animalswipe/SwipeCard';
import SwipeSideBox from '../components/animalswipe/SwipeSideBox.jsx';
import { fetchAnimals, fetchSido, fetchSigungu, fetchShelters } from '../api/animals.js';
import { addFavorite, getFavorites } from '../api/favorites.js';

function AnimalSwipePage() {
    const [animals, setAnimals] = useState([]);//전체 동물 정보 받을 곳
    const [filterAnimals, setFilterAnimals] = useState([]);//필터링되서 실제 화면에 나오는 동물 정보

    const [nowIndex, setnowIndex] = useState(0); // 현재 보고 있는 카드의 인덱스
    const [exitX, setexitX] = useState(0); // 카드가 어느 방향으로 날아갈지 결정 (500 또는 -500)
    const [likeAnimal, setlikeAnimal] = useState([]); //찜한 동물id 리스트 저장 (서버에서 불러옴)

    // 필터 드롭다운 옵션 목록
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [shelterList, setShelterList] = useState([]);

    const [filter, setFilter] = useState({ //사이드 박스의 필터를 위한것
        //필터링 조건들 저장할 곳
        sido: '',       //시도
        sigungu: '',    //시군구
        shelterName: '',
        kind: '',
        status: '',
        gender: '',
        isNeutered: '',
        onlySocialized: false, //사회화 정보 여부
        onlyHealthy: false,    //건강상태 양호
    });


    // 데이터 읽어오는 코드
    useEffect(() => {
        fetchAnimals({ limit: 500 })
            .then((items) => {
                setAnimals(items);
                setFilterAnimals(items);
            })
            .catch((err) => console.log("데이터 로딩 실패", err));
    }, []);

    // 찜 목록 서버에서 불러오기
    useEffect(() => {
        getFavorites()
            .then((data) => {
                const list = data?.data || [];
                const ids = list.map((item) => item.desertionNo).filter(Boolean);
                setlikeAnimal(ids);
            })
            .catch((err) => {
                if (err?.status !== 401) {
                    console.log("찜 목록 불러오기 실패", err);
                }
            });
    }, []);

    // 시도 목록 초기 로딩
    useEffect(() => {
        fetchSido()
            .then((list) => setSidoList(list))
            .catch((err) => console.log('시도 목록 불러오기 실패', err));
    }, []);

    // 시도가 바뀌면 시군구 목록 새로 불러오기
    useEffect(() => {
        if (!filter.sido) {
            setSigunguList([]);
            setShelterList([]);
            return;
        }
        const sidoCode = sidoList.find((item) => item.name === filter.sido)?.code || '';
        fetchSigungu(sidoCode)
            .then((list) => setSigunguList(list))
            .catch((err) => console.log('시군구 목록 불러오기 실패', err));
    }, [filter.sido]);

    // 시군구가 바뀌면 보호소 목록 새로 불러오기
    useEffect(() => {
        if (!filter.sigungu) {
            setShelterList([]);
            return;
        }
        const sigunguCode = sigunguList.find((item) => item.name === filter.sigungu)?.code || '';
        fetchShelters(sigunguCode)
            .then((list) => setShelterList(list))
            .catch((err) => console.log('보호소 목록 불러오기 실패', err));
    }, [filter.sigungu]);

    //동물 카드 무한루프를 위한 index(다 봤으면 index 0부터 다시)
    // usestate인 nowindex값이 바뀌면 컴포넌트 다시 시작하고 여기서 바뀐 currentAnimal로 dom그림
    const currentAnimal = filterAnimals.length > 0
        ? filterAnimals[nowIndex % filterAnimals.length] : null;

    // 최초 로딩 전 (동물 데이터 자체가 아직 없음)
    if (animals.length === 0) {
        return <div className="py-12 text-center text-sm text-gray-500">데이터 로딩 중...</div>;
    }

    // 필터 결과가 없는 경우 (데이터는 있지만 조건에 맞는 동물이 없음)
    if (!currentAnimal) {
        return <div className="py-12 text-center text-sm text-gray-500">조건에 맞는 동물이 없습니다.</div>;
    }

    //찜하기를 했을때 찜 개수 올려줄 함수
    const LikeCnt = (Id) => {
        setlikeAnimal((prev) => {
            //중복인 경우
            if (prev.includes(Id)) {
                console.log("이미 찜한 동물");
                return prev;
            }
            //중복이 아닌 경우
            console.log("찜한 동물 추가", Id);
            return [...prev, Id];
        });
    }

    const handleLike = async (Id) => {
        try {
            await addFavorite(Id);
            LikeCnt(Id);
        } catch (err) {
            if (err?.status !== 401) {
                console.log("찜하기 API 호출 실패", err);
            }
        }
    };

    //==========================필터를 위한 부분================================

    //필터를 위해 데이터를 다시 불러오거나(API 호출), 목록을 걸러주는 함수
    const FilterChange = (newFilter) => {
        // 시도가 바뀌면 하위 시군구·보호소 선택값 초기화
        if (newFilter.sido !== filter.sido) {
            newFilter = { ...newFilter, sigungu: '', shelterName: '' };
        }
        // 시군구가 바뀌면 하위 보호소 선택값 초기화
        if (newFilter.sigungu !== filter.sigungu) {
            newFilter = { ...newFilter, shelterName: '' };
        }

        setFilter(newFilter);

        //원본(Animals)에서 조건에 맞는 것만 걸러내기
        const FilterList = animals.filter(animal => {
            // kind는 "믹스견", "[개] 믹스견" 형태라 includes로 체크
            if (newFilter.kind !== '' && !animal.kind?.includes(newFilter.kind)) {
                return false;
            }
            // status 필드명은 API 응답 기준
            if (newFilter.status !== '' && animal.status !== newFilter.status) {
                return false;
            }
            // gender 필드명은 API 응답 기준
            if (newFilter.gender !== '' && animal.gender !== newFilter.gender) {
                return false;
            }
            // 시도는 jurisdiction(관할) 필드에 포함 여부로 체크
            if (newFilter.sido !== '' && !animal.jurisdiction?.includes(newFilter.sido)) {
                return false;
            }
            // 시군구도 jurisdiction 필드에 포함 여부로 체크
            if (newFilter.sigungu !== '' && !animal.jurisdiction?.includes(newFilter.sigungu)) {
                return false;
            }
            // 보호소 이름 일치 여부
            if (newFilter.shelterName !== '' && animal.shelterName !== newFilter.shelterName) {
                return false;
            }
            // 중성화 일치 여부
            if (newFilter.isNeutered !== '' && animal.isNeutered !== newFilter.isNeutered) {
                return false;
            }
            // 사회화 정보 여부
            if (newFilter.onlySocialized && (!animal.socialization || animal.socialization.trim() === '')) {
                return false;
            }
            // 건강 상태 양호 여부
            if (newFilter.onlyHealthy && animal.healthStatus !== '양호') {
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
                                    onLike={handleLike}
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
                            sidoList={sidoList}
                            sigunguList={sigunguList}
                            shelterList={shelterList}
                            onFilterChange={(e) => {
                                const {name, value, type, checked} = e.target;
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

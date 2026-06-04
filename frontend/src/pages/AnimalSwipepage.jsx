import React, {useState, useEffect, useMemo} from 'react';
//AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/animalswipe/SwipeCard';
import SwipeSideBox from '../components/animalswipe/SwipeSideBox.jsx';
import { fetchAnimals, fetchSido, fetchSigungu, fetchShelters } from '../api/animals.js';
import { addFavorite, getFavorites } from '../api/favorites.js';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function AnimalSwipePage() {
    const [animals, setAnimals] = useState([]);//전체 동물 정보 받을 곳
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ //사이드 박스의 필터를 위한것
        //필터링 조건들 저장할 곳
        sido: '',       //시도
        sigungu: '',    //시군구
        shelterName: '',
        kind: '',
        status: '',
        gender: '',
        isNeutered: '',
    });

    const [nowIndex, setnowIndex] = useState(0); // 현재 보고 있는 카드의 인덱스
    const [exitX, setexitX] = useState(0); // 카드가 어느 방향으로 날아갈지 결정 (500 또는 -500)
    const [likeAnimal, setlikeAnimal] = useState([]); //찜한 동물id 리스트 저장 (서버에서 불러옴)
    const [todaylike, setTodaylike] = useState(()=>{
        //오늘의 찜 localstorage에 저장한거 가져오기
        const today = new Date().toLocaleDateString();
        const stats = JSON.parse(localStorage.getItem('daily_likes') || '{"date":"","count":0}');

        return stats.date === today ? stats.count : 0; //오늘날짜면 저장한 수,다른날이면 0
    }); //오늘의 찜 개수

    const [initialLiked, setInitialLiked] = useState([]); // 최초 찜한 동물 목록 (스와이프 인덱스 꼬임 방지용)

    // 필터 드롭다운 옵션 목록
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [shelterList, setShelterList] = useState([]);


    const filterAnimals = useMemo(() => {
        return animals.filter(animal => {
            // 이미 찜한 동물 제외 (최초 로딩 기준)
            const animalId = animal.id || animal.desertionNo;
            if (initialLiked.includes(animalId)) {
                return false;
            }

            // kind는 "믹스견", "[개] 믹스견" 형태라 includes로 체크
            if (filter.kind !== '' && !animal.kind?.includes(filter.kind)) {
                return false;
            }
            // status 필드명은 API 응답 기준
            if (filter.status !== '' && animal.status !== filter.status) {
                return false;
            }
            // gender 필드명은 API 응답 기준
            if (filter.gender !== '' && animal.gender !== filter.gender) {
                return false;
            }
            // 시도는 jurisdiction(관할) 필드에 포함 여부로 체크
            if (filter.sido !== '' && !animal.jurisdiction?.includes(filter.sido)) {
                return false;
            }
            // 시군구도 jurisdiction 필드에 포함 여부로 체크
            if (filter.sigungu !== '' && !animal.jurisdiction?.includes(filter.sigungu)) {
                return false;
            }
            // 보호소 이름 일치 여부
            if (filter.shelterName !== '' && animal.shelterName !== filter.shelterName) {
                return false;
            }
            // 중성화 일치 여부
            if (filter.isNeutered !== '' && animal.isNeutered !== filter.isNeutered) {
                return false;
            }

            return true; // 모든 조건 통과
        });
    }, [animals, filter, initialLiked]); //전체 동물 데이터 또는 필터 조건이 바뀔때마다 랜더링


    // 필터가 변경될 때마다 데이터 재요청
    useEffect(() => {
        setLoading(true);
        const params = { limit: 500 };
        if (filter.sido) params.sido = filter.sido;
        if (filter.sigungu) params.sigungu = filter.sigungu;
        if (filter.shelterName) params.shelterName = filter.shelterName;
        if (filter.kind) params.kind = filter.kind;
        if (filter.status) params.state = filter.status; // API 파라미터는 state
        if (filter.gender) params.gender = filter.gender;
        if (filter.isNeutered) params.isNeutered = filter.isNeutered;

        fetchAnimals(params)
            .then((items) => {
                setAnimals(items);
            })
            .catch((err) => console.log("데이터 로딩 실패", err))
            .finally(() => setLoading(false));
    }, [filter]);

    // 기타 초기 로딩 (찜 목록, 시도 목록)
    useEffect(() => {
        // 찜 목록 서버에서 불러오기
        getFavorites()
            .then((data) => {
                const list = data?.data || [];
                const ids = list.map((item) => item.desertionNo).filter(Boolean);
                setlikeAnimal(ids);
                setInitialLiked(ids); // 최초 로딩 시 찜 목록 저장
            })
            .catch((err) => {
                if (err?.status !== 401) {
                    console.log("찜 목록 불러오기 실패", err);
                }
            });

        // 시도 목록 초기 로딩
        fetchSido()
            .then((list) => setSidoList(list))
            .catch((err) => console.log('시도 목록 불러오기 실패', err));

    }, []);



    //동물 카드 무한루프를 위한 index(다 봤으면 index 0부터 다시)
    // usestate인 nowindex값이 바뀌면 컴포넌트 다시 시작하고 여기서 바뀐 currentAnimal로 dom그림
    const currentAnimal = filterAnimals.length > 0
        ? filterAnimals[nowIndex % filterAnimals.length] : null;

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

    //찜하기 반영함수
    const handleLike = async (Id) => {
        try {
            await addFavorite(Id);
            LikeCnt(Id);

            //오늘의 찜 수 저장
            const today = new Date().toLocaleDateString();
            const stats = JSON.parse(localStorage.getItem('daily_likes') || '{"date":"","count":0}');
            if (stats.date === today) stats.count += 1;
            else { stats.date = today; stats.count = 1; }

            localStorage.setItem('daily_likes', JSON.stringify(stats));
            setTodaylike(stats.count); // 오늘의 찜 업데이트
        } catch (err) {
            if (err?.status !== 401) {
                console.log("찜하기 API 호출 실패", err);
            }
        }
    };

    //==========================필터를 위한 부분================================

    //필터를 위해 데이터를 다시 불러오거나(API 호출), 목록을 걸러주는 함수
    const FilterChange = async (newFilter) => {
        //시도가 바뀌면
        if (newFilter.sido !== filter.sido) {
            const sidoCode = sidoList.find((item) => item.name === newFilter.sido)?.code || '';
            let sigungu = [];
            let shelters = [];
            
            if (newFilter.sido) {
                try {
                    if (sidoCode) sigungu = await fetchSigungu(sidoCode);
                    shelters = await fetchShelters(newFilter.sido, '');
                } catch (err) {
                    console.log('하위 목록 불러오기 실패', err);
                }
            }
            setSigunguList(sigungu);
            setShelterList(shelters);
            
            newFilter = { ...newFilter, sigungu: '', shelterName: '' };
        }
        //시군구가 바뀌었을 때
        else if (newFilter.sigungu !== filter.sigungu) {
            let shelters = [];
            if (newFilter.sido) {
                try {
                    shelters = await fetchShelters(newFilter.sido, newFilter.sigungu);
                } catch (err) {
                    console.log('보호소 목록 불러오기 실패', err);
                }
            }
            setShelterList(shelters);
            newFilter = { ...newFilter, shelterName: '' };
        }

        setFilter(newFilter);

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
                        {loading ? (
                            <div className="flex h-[520px] w-[340px] items-center justify-center">
                                <div className="py-12 text-center text-sm text-gray-500">데이터 로딩 중...</div>
                            </div>
                        ) : currentAnimal ? (
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
                        </div>) : (<div className="flex h-[520px] w-[340px] items-center justify-center">
                                <div className="py-12 text-center text-sm text-gray-500">조건에 맞는 동물이 없습니다.</div>
                            </div>)}
                        {/* 하단 방향 설명 부분*/}
                        <div className="mt-8 flex gap-16 text-center text-sm text-gray-500">
                            <div className="flex flex-col items-center">
                                <ArrowLeft size={24} className="mb-1 text-gray-400" />
                                <div>PASS</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <ArrowRight size={24} className="mb-1 text-gray-400" />
                                <div>LIKE</div>
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 컴포넌트 */}
                    <div className="w-full max-w-xs">
                        <SwipeSideBox
                            LikeCnt={todaylike} //오늘 찜한 수
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

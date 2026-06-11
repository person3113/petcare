import React, {useState, useEffect, useMemo} from 'react';
//AnimatePresence:컴포넌트가 사라질 때 애니메이션 효과 주는 컴포넌트
import { AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/animalswipe/SwipeCard';
import SwipeSideBox from '../components/animalswipe/SwipeSideBox.jsx';
import { fetchAnimals, fetchSido, fetchSigungu, fetchShelters } from '../api/animals.js';
import { addFavorite, getFavorites } from '../api/favorites.js';
import { fetchMySurvey } from '../api/survey.js';
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
        status: '보호중',
        gender: '',
        isNeutered: '',
    });

    const [nowIndex, setnowIndex] = useState(0); // 현재 보고 있는 카드의 인덱스
    const [exitX, setexitX] = useState(0); // 카드가 어느 방향으로 날아갈지 결정(500 또는 -500)
    const [likeAnimal, setlikeAnimal] = useState([]); //찜한 동물id 리스트 저장 (서버에서 불러옴)
    const [todaylike, setTodaylike] = useState(()=>{
        //오늘의 찜 저장한거 가져오기
        const today = new Date().toLocaleDateString();
        const stats = JSON.parse(localStorage.getItem('daily_likes') || '{"date":"","count":0}');

        return stats.date === today ? stats.count : 0; //오늘날짜면 저장한 수,다른날이면 0
    }); //오늘의 찜 개수

    const [initialLiked, setInitialLiked] = useState([]); // 최초 찜한 동물 목록 (스와이프 인덱스 꼬임 방지용)
    const [mySurvey, setMySurvey] = useState(null); // 내 설문기록

    // 필터 드롭다운 옵션 목록
    const [sidoList, setSidoList] = useState([]);
    const [sigunguList, setSigunguList] = useState([]);
    const [shelterList, setShelterList] = useState([]);


    const filterAnimals = animals.filter(animal => {
        // 이미 찜한 동물 제외
        const animalId = animal.id || animal.desertionNo;
        if (initialLiked.includes(animalId)) {
            return false;
        }

        if (filter.kind !== '' && !animal.kind?.includes(filter.kind)) {
            return false;
        }
        if (filter.status !== '' && filter.status !== '전체' && animal.status !== filter.status) {
            return false;
        }
        if (filter.gender !== '' && animal.gender !== filter.gender) {
            return false;
        }
        if (filter.sido !== '' && !animal.jurisdiction?.includes(filter.sido)) {
            return false;
        }
        if (filter.sigungu !== '' && !animal.jurisdiction?.includes(filter.sigungu)) {
            return false;
        }
        if (filter.shelterName !== '' && animal.shelterName !== filter.shelterName) {
            return false;
        }
        if (filter.isNeutered !== '' && animal.isNeutered !== filter.isNeutered) {
            return false;
        }

        return true; // 모든 조건 통과
    });


    // 필터가 변경될 때마다 데이터 재요청
    useEffect(() => {
        setLoading(true);
        const params = { limit: 500 };
        if (filter.sido) params.sido = filter.sido;
        if (filter.sigungu) params.sigungu = filter.sigungu;
        if (filter.shelterName) params.shelterName = filter.shelterName;
        if (filter.kind) params.kind = filter.kind;
        if (filter.status) params.state = filter.status;
        if (filter.gender) params.gender = filter.gender;
        if (filter.isNeutered) params.isNeutered = filter.isNeutered;

        fetchAnimals(params)
            .then((items) => {
                setAnimals(items);
            })
            .catch((err) => console.log("에러", err))
            .finally(() => setLoading(false));
    }, [filter]);

    // 기타 초기 로딩(찜목록, 시도 목록, 설문)
    useEffect(() => {
        // 설문 기록 불러오기
        fetchMySurvey()
            .then(res => setMySurvey(res?.data || null))
            .catch(err => {
                if (err?.status !== 401) console.log("설문 에러", err);
            });

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
                    console.log("찜 에러", err);
                }
            });

        // 시도 목록 초기 로딩
        fetchSido()
            .then((list) => setSidoList(list))
            .catch((err) => console.log('지역 에러', err));

    }, []);



    // 현재 동물 세팅
    const currentAnimal = filterAnimals.length > 0
        ? filterAnimals[nowIndex % filterAnimals.length] : null;

    //찜하기를 했을때 찜 개수 올려줄 함수
    const LikeCnt = (Id) => {
        setlikeAnimal((prev) => {
            //중복인 경우
            if (prev.includes(Id)) {
                console.log("중복");
                return prev;
            }
            //중복이 아닌 경우
            console.log("추가", Id);
            return [...prev, Id];
        });
    }

    //찜하기 반영함수
    const handleLike = (Id) => {
        addFavorite(Id)
            .then(() => {
                LikeCnt(Id);

                //오늘의 찜 수 저장
                const today = new Date().toLocaleDateString();
                const statsStr = localStorage.getItem('daily_likes');
                const stats = statsStr ? JSON.parse(statsStr) : {date:"", count:0};
                if (stats.date === today) stats.count += 1;
                else { stats.date = today; stats.count = 1; }

                localStorage.setItem('daily_likes', JSON.stringify(stats));
                setTodaylike(stats.count); // 오늘의 찜 업데이트
            })
            .catch(err => {
                if (err?.status !== 401) {
                    console.log("찜 에러", err);
                }
            });
    };

    //==========================필터를 위한 부분================================

    //필터를 위해 데이터를 다시 불러오거나, 목록을 걸러주는 함수
    const FilterChange = (newFilter) => {
        //시도가 바뀌면
        if (newFilter.sido !== filter.sido) {
            const sidoCode = sidoList.find((item) => item.name === newFilter.sido)?.code || '';
            
            if (newFilter.sido) {
                if (sidoCode) {
                    fetchSigungu(sidoCode)
                        .then(sigungu => {
                            setSigunguList(sigungu);
                        })
                        .catch(err => {
                            console.log('시군구 에러', err);
                        });
                } else {
                    setSigunguList([]);
                }

                fetchShelters(newFilter.sido, '')
                    .then(shelters => {
                        setShelterList(shelters);
                    })
                    .catch(err => {
                        console.log('보호소 에러', err);
                    });

                newFilter = { ...newFilter, sigungu: '', shelterName: '' };
                setFilter(newFilter);
                setnowIndex(0);

            } else {
                setSigunguList([]);
                setShelterList([]);
                newFilter = { ...newFilter, sigungu: '', shelterName: '' };
                setFilter(newFilter);
                setnowIndex(0);
            }
        }
        //시군구가 바뀌었을 때
        else if (newFilter.sigungu !== filter.sigungu) {
            if (newFilter.sido) {
                fetchShelters(newFilter.sido, newFilter.sigungu)
                    .then(shelters => {
                        setShelterList(shelters);
                        newFilter = { ...newFilter, shelterName: '' };
                        setFilter(newFilter);
                        setnowIndex(0);
                    })
                    .catch(err => {
                        console.log('에러', err);
                    });
            } else {
                setShelterList([]);
                newFilter = { ...newFilter, shelterName: '' };
                setFilter(newFilter);
                setnowIndex(0);
            }
        } else {
            setFilter(newFilter);
            setnowIndex(0);
        }
    }

    const applySurveyFilter = (survey) => {
        let kind = '';
        if(survey.upkind === '417000')kind = '[개]';
        else if (survey.upkind === '422400') kind = '[고양이]';
        else if (survey.upkind === '429900') kind = '[기타축종]';

        let gender = '';
        if(survey.sexCd === 'M') gender = '수컷';
        else if(survey.sexCd === 'F') gender = '암컷';

        let isNeutered = '';
        if (survey.neuterYn === 'Y') isNeutered = '예';
        else if (survey.neuterYn ==='N') isNeutered = '아니오';
        else if (survey.neuterYn ==='U')isNeutered = '미상';

        let status = '전체';
        if(survey.state) status = survey.state;

        let sidoName = '';
        if(survey.uprCd) {
            sidoName = sidoList.find(s => s.code === survey.uprCd)?.name || '';
        }

        const newFilter ={
            sido: sidoName,
            sigungu: '',
            shelterName: '',
            kind,
            status,
            gender,
            isNeutered
        };

        FilterChange(newFilter);
    };



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
                                    //key가 바뀌어야 카드 교체로 인식
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
                            mySurvey={mySurvey}
                            applySurveyFilter={applySurveyFilter}
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

import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../../api/favorites.js'; //사용자가 찜한 동물 목록
import AnimalCard from '../AnimalCard.jsx';
import {fetchMySurvey} from "../../api/survey.js";

function FavoriteList({ onFavoriteDeleted }) {
    const [favor, setFavor]= useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        getFavorites()

        .then((res) => {
            const data = res?.data || res || [];
            setFavor(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
            setError(err?.message || '찜 목록을 불러오지 못했습니다.');
        })
        .finally(() => {
            setLoading(false);
        })
    },[])

    const handleRemoveFavorite = async (e, desertionNo) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await removeFavorite(desertionNo);
            setFavor(prev => prev.filter(animal => animal.desertionNo !== desertionNo));
            if (onFavoriteDeleted) {
                onFavoriteDeleted();
            }
        } catch (err) {
            alert('찜 삭제에 실패했습니다.');
        }
    };

    if(loading){
        return <div>찜한 동물 로딩중....</div>;
    }
    if(error){
        return <div>에러: {error}</div>;
    }

    //찜한 동물이 없을 경우
    if(favor.length === 0){
        return(
            <div>
                <p>아직 찜한 동물이 없습니다.</p>
                <div className="mt-5 text-right">
                    <Link
                        to="/animals"
                        className="inline-block rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-500 hover:bg-amber-50"
                    >
                        찜하러 가기
                    </Link>
                </div>
            </div>
        )
    }

    return(
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favor.map((animal) => {
                //데이터 동물카드에서 사용할 수 있게 이름 변환
                const animalForCard = {
                    id: animal.desertionNo, //동물 번호
                    kind: animal.kind,
                    images: [animal.imageUrl], // 문자열로 된거를 리스트로
                    shelterName: animal.shelterName || animal.shelterTel || '보호소 정보 없음', // shelterName 우선
                    status: animal.processState,
                    gender: animal.gender || '정보 없음', // 찜 데이터에 있는 성별 적용
                    age: animal.age || '정보 없음'     // 찜 데이터에 있는 나이 적용
                };
                return(
                    <div key={animal.desertionNo} className="relative group">
                        <AnimalCard animal={animalForCard} to={`/animal/${animalForCard.id}`} />
                        <button
                            onClick={(e) => handleRemoveFavorite(e, animal.desertionNo)}
                            className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500"
                            title="찜 삭제"
                        >
                            삭제
                        </button>
                    </div>
                )
            })}
        </div>
    )
}

export default FavoriteList;

import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { getFavorites } from '../../api/favorites.js'; //사용자가 찜한 동물 목록
import AnimalCard from '../AnimalCard.jsx';
import {fetchMySurvey} from "../../api/survey.js";

function FavoriteList() {
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
                    images: [animal.popfiles], // 문자열로 된거를을 리스트로
                    shelterName: animal.shelterTel || '보호소 정보 없음', // 현재 찜 데이터에 있는 전화번호를 이름 위치에 표시
                    status: animal.processState,
                    gender: '정보 없음', // 찜 데이터에 없는 정보는 기본값 설정
                    age: '정보 없음'     //기본값 설정
                };
                return(
                    <AnimalCard animal={animalForCard} to={`/animal/${animalForCard.id}`} />
                )
            })}
        </div>
    )
}

export default FavoriteList;

import React,{useState, useEffect} from 'react';
import { useParams,Link } from 'react-router-dom';
import { request } from '../api/http.js';
import AnimalInfoBox from '../components/animaldetail/AnimalInfoBox';
import AnimalImg from '../components/animaldetail/AnimalImg';
import AnimalInfoTab from '../components/animaldetail/AnimalInfoTab';
import SimilarAnimals from '../components/animaldetail/SimilarAnimals';


function AnimalDetailpage(){

    const {id} = useParams(); //url경로에 있는 파라미터 id가져오기 (/animal/id)
    const [animal,SetAnimal] = useState(null); //동물 상세정보를 저장할 state
    const [loding,SetLoding] = useState(true); //로딩 상태를 저장할 state

    //컴포넌트가 처음 나타나는 한번 데이터를 가져오기 위해 useEffect사용(안쓰면 데이터가져올때 usetate가 바뀌어서 다시가져오는 무한에 빠짐)
    useEffect(()=>{
        function fetchAnimal() {
            request(`/api/animals/${id}`, { method: 'GET' })
                .then(data => {
                    SetAnimal(data?.data || data);
                })
                .catch(err => {
                    console.log("데이터 에러", err)
                })
                .finally(() => {
                    SetLoding(false); //로딩 끝내기
                });
        }

        fetchAnimal();
    },[id]) //id가 바뀔때마다 다시 데이터 받아오기

    if(loding){return(<div>...로딩중...</div>)}
    if(!animal){return(<div>데이터가 없습니다</div>)}

    const safeImages = Array.isArray(animal.images) ? animal.images : [];


    return(
        <div className="mx-auto max-w-5xl py-6">
            {/*페이지 경로*/}
            <div className="path ml-6">
                <Link to="/" className="text-sm text-gray-500 hover:underline">메인 화면</Link>
                <span>&gt;</span>
                <Link to="/animals" className="text-sm text-gray-500 hover:underline">인연 찾기</Link>
                <span>&gt;</span>
                <span className="text-sm text-accent">인연 상세</span>
            </div>
            {/*여기에 동물 상세페이지 컴포넌트들 넣기*/}
            <div className="mt-6 flex flex-col gap-10 lg:flex-row">
                <div className="min-w-[320px] flex-1">
                    <AnimalImg images={safeImages} />
                </div>
                <div className="min-w-[320px] flex-1">
                    <AnimalInfoBox animal={animal} onFavoriteChange={SetAnimal} />
                </div>

            </div>
            <AnimalInfoTab animal={animal} />
            <SimilarAnimals currentAnimal={animal} />
        </div>
    )
}

export default AnimalDetailpage;

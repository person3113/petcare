import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import AnimalInfoBox from '../components/animaldetail/AnimalInfoBox';
import AnimalImg from '../components/animaldetail/AnimalImg';
import AnimalInfoTab from '../components/animaldetail/AnimalInfoTab';

function AnimalDetailpage(){

    const {id} = useParams(); //url경로에 있는 파라미터 id가져오기 (/animal/id)
    const [animal,SetAnimal] = useState(null); //동물 상세정보를 저장할 state
    const [loding,SetLoding] = useState(true); //로딩 상태를 저장할 state

    //컴포넌트가 처음 나타나는 한번 데이터를 가져오기 위해 useEffect사용(안쓰면 데이터가져올때 usetate가 바뀌어서 다시가져오는 무한에 빠짐)
    useEffect(()=>{
        //fetch:데이터 요청, .then: 데이터 요청 성공했을때 .catch: 데이터 요청 실패했을때
        fetch('/mock/animal_detail.json') //데이터 받아올 api주소 여기에 넣기:useParams으로 가져온 id사용해서 그 동물정보 가져오기**********
            .then(res => res.json())
            .then(json=>{
                //데이터 요청 성공했으니 animal에 값 넣고, loding상태 false로 세팅
                SetAnimal(json.data);
                SetLoding(false);
            })
            .catch(err => {
                console.log("err:데이터로드 실패" , err)
                SetLoding(false); //로딩 끝내기
            }); //데이터 요청 실패시 에러메세지

    },[id]) //id가 바뀔때마다 다시 데이터 받아오기

    if(loding){return(<div>...로딩중...</div>)}
    if(!animal){return(<div>데이터가 없습니다</div>)}


    return(
        <div>
            <h1>동물 상세 페이지 확인용</h1>
            <p>동물의 id:{id}</p>
            {/*todo:현재 페이지 위치 나타내는부분 ex)메인화면>입양하기>동물상세정보 */}
            {/*여기에 동물 상세페이지 컴포넌트들 넣기*/}
            <div style={{
                display: 'flex',
                gap: '40px',     //좌우 컴포넌트 사이 간격
                marginBottom: '40px',
                flexWrap: 'wrap', //화면이 좁아질 때 컴포넌트가 아래로 내려가도록
            }}>
                <div style={{ flex: 1, minWidth: '320px' }}>
                    <AnimalImg images={animal.images} />
                </div>
                <div style={{ flex: 1, minWidth: '320px' }}>
                    <AnimalInfoBox animal={animal} />
                </div>

            </div>
            <AnimalInfoTab animal={animal} />
        </div>
    )
}

export default AnimalDetailpage;
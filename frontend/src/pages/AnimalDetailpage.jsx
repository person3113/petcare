import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

function AnimalDetailpage(){

    const {id} = useParams(); //url경로에 있는 파라미터 id가져오기 (/animal/id)
    const [animal,SetAnimal] = useState(null); //동물 상세정보를 저장할 state
    const [loding,SetLoding] = useState(true); //로딩 상태를 저장할 state

    //컴포넌트가 처음 나타나는 한번 데이터를 가져오기 위해 useEffect사용(안쓰면 데이터가져올때 usetate가 바뀌어서 다시가져오는 무한에 빠짐)
    useEffect(()=>{
        //fetch:데이터 요청, .then: 데이터 요청 성공했을때 .catch: 데이터 요청 실패했을때
        fetch('api-url자리')
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
            {/*여기에 동물 상세페이지 컴포넌트들 넣기*/}
        </div>
    )
}

export default AnimalDetailpage;
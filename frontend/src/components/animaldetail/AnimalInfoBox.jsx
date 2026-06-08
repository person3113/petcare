import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favorites.js';
import Tag from '../Tag';
import Button from '../Button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LuMessageSquareHeart } from "react-icons/lu";

function AnimalInfoBox({animal, onFavoriteChange}) {

    if(!animal)return(<div>데이터 로드 안됨</div>)

    const {
        kind, //종
        age,  //나이
        gender,  //성별
        weight,  //무게
        shelterName,  //보호소 이릅
        status,       //보호 상태:보호중 또는 입양가능 등
        isNeutered,   //중성화여부
        healthStatus,  //건강상태
        discoveryDate, //발견날짜
        discoveryPlace, //발견장소
        liked,
        geminiIntro,
    } = animal;

    console.log(animal)

    const [favoriteLoading, setFavoriteLoading] = useState(false);

    async function handleToggleFavorite() {
        if (favoriteLoading) {
            return;
        }
        if (!animal.id) {
            alert('동물 정보가 올바르지 않습니다.');
            return;
        }
        setFavoriteLoading(true);
        try {
            if (liked) {
                await removeFavorite(animal.id);
                console.log('찜하기 삭제 성공');
            } else {
                await addFavorite(animal.id);
                console.log('찜하기 추가 성공');
            }
            const updated = { ...animal, liked: !liked };
            onFavoriteChange?.(updated);
        } catch (error) {
            console.log('찜하기 처리 실패', error);
            alert('찜하기 처리에 실패했습니다.');
        } finally {
            setFavoriteLoading(false);
        }
    }

    return(
        <div className="max-w-[600px] p-5 text-left">

            {/*타이틀: 품종 및 보호 상태 */}
            <div className="flex items-center gap-3">
                <h1 className="!text-4xl font-bold m-0">
                    {kind} {/* ex) [개] 믹스견 */}
                </h1>
                <span className="rounded bg-statusbg px-2 py-1 text-sm font-medium text-accent">
                {status}
                </span>
            </div>


            <div className="mt-1 rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
                {/*종 · 나이 · 성별 · 체중 · 보호소명*/}
                <h2 className="!text-accent">기본 정보</h2>
                <hr className="text-accent"></hr>
                <div className="pt-6 text-sm text-gray-600">
                    <p className="flex"><span className="w-25">종</span> <span>{kind?.replace(/\[.*\\]\s*/, '')}</span></p>
                    <p className="flex"><span className="w-25">나이</span> <span>{age}</span></p>
                    <p className="flex"><span className="w-25">성별</span> <span>{gender}</span></p>
                    <p className="flex"><span className="w-25">무게</span> <span>{weight}</span></p>
                    <p className="flex"><span className="w-25">보호소</span> <span>{shelterName}</span></p>
                    <p className="flex"><span className="w-25">발견 날짜</span> <span>{discoveryDate}</span></p>
                    <p className="flex"><span className="w-25">발견 장소</span> <span>{discoveryPlace}</span></p>
                </div>
            </div>

            <div className="bg-statusbg p-4 rounded-lg m-2">
                {/*AI 1줄 소개*/}
                <h2 className="!text-accent flex gap-2">AI 1줄 소개 <span><LuMessageSquareHeart className="text-accent" size={24} /></span></h2>
                <div className="mt-4 text-sm text-gray-700">
                    <p>{geminiIntro || '이 아이의 소개글을 준비 중이에요.'}</p>
                </div>
            </div>

            {/* 태그 부분: 데이터에 배열 형식의 태그가 없으므로, 핵심 정보를 태그 형태로 시각화 */}
            <div className="mt-5 flex flex-wrap gap-2">
                <Tag keyword="중성화" result={isNeutered === '아니오' ? '미완료' : '완료'}/>
                <Tag keyword="건강" result={healthStatus}/>
                <Tag keyword={"성별"}/>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                    text={favoriteLoading ? "..." : (liked ?  <FaHeart size={24}/>:<FaRegHeart size={24}/>)}
                    flex={0.4}
                    bgColor="none" // 원하면 배경 추가
                    textColor="#ef4444"
                    onClick={handleToggleFavorite}
                />
                <Button
                    text="입양 신청하기"
                    flex={1.5}
                    bgColor="#f59e0b"
                    textColor="white"
                />
                <Button
                    text="보호소 연락"
                    flex={1.1}
                    bgColor="white"
                    textColor="#444"
                    onClick={() => alert(`${shelterName} 연락처: ${animal.shelterTel}`)}
                    border="1px solid #ddd"
                />
            </div>
        </div>
    )
}

export default AnimalInfoBox;

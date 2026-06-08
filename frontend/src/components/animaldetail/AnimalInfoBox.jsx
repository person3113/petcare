import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favorites.js';
import Tag from '../Tag';
import Button from '../Button';

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
        isLiked,
        geminiIntro,
    } = animal;

    const [favoriteLoading, setFavoriteLoading] = useState(false);

    function handleToggleFavorite() {
        if (favoriteLoading) {
            return;
        }
        if (!animal.id) {
            alert('동물 정보가 올바르지 않습니다.');
            return;
        }
        setFavoriteLoading(true);
        
        if (isLiked) {
            removeFavorite(animal.id)
                .then(() => {
                    const updated = { ...animal, isLiked: !isLiked };
                    onFavoriteChange?.(updated);
                })
                .catch((error) => {
                    console.log('찜하기 처리 실패', error);
                    alert('찜하기 처리에 실패했습니다.');
                })
                .finally(() => {
                    setFavoriteLoading(false);
                });
        } else {
            addFavorite(animal.id)
                .then(() => {
                    const updated = { ...animal, isLiked: !isLiked };
                    onFavoriteChange?.(updated);
                })
                .catch((error) => {
                    console.log('찜하기 처리 실패', error);
                    alert('찜하기 처리에 실패했습니다.');
                })
                .finally(() => {
                    setFavoriteLoading(false);
                });
        }
    }

    return(
        <div className="max-w-[600px] p-5 text-left">

            {/*타이틀: 품종 및 보호 상태 */}
            <div className="flex items-center gap-3">
                <h1 className="!text-4xl font-bold">
                    {kind} {/* ex) [개] 믹스견 */}
                </h1>
                <span className="rounded bg-statusbg px-2 py-1 text-sm font-medium text-accent">
                {status}
                </span>
            </div>


            {/*종 · 나이 · 성별 · 체중 · 보호소명*/}
            <h2>기본 정보</h2>
            <div className="pt-6 text-sm text-gray-600">
                <p>종: {kind?.replace(/\[.*\\]\s*/, '')}</p>
                <p>나이: {age}</p>
                <p>성별: {gender}</p>
                <p>무게: {weight}</p>
                <p>보호소: {shelterName}</p>
                <p>발견 날짜: {discoveryDate}</p>
                <p>발견 장소: {discoveryPlace}</p>
            </div>

            {/*AI 1줄 소개*/}
            <h2>AI 1줄 소개</h2>
            <div className="mt-4 text-sm text-gray-700">
                <p>{geminiIntro || '이 아이의 소개글을 준비 중이에요.'}</p>
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
                    text={favoriteLoading ? "..." : (isLiked ? "❤️" : "🤍")}
                    flex={0.4}
                    bgColor="none" // 원하면 배경 추가
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

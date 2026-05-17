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
    } = animal;

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
            if (isLiked) {
                await removeFavorite(animal.id);
            } else {
                await addFavorite(animal.id);
            }
            const updated = { ...animal, isLiked: !isLiked };
            onFavoriteChange?.(updated);
        } catch (error) {
            console.log('찜하기 처리 실패', error);
            alert('찜하기 처리에 실패했습니다.');
        } finally {
            setFavoriteLoading(false);
        }
    }

    return(
        <div className="animal-info-box" style={{ padding: '20px', maxWidth: '600px', textAlign: 'left' }}>

            {/*타이틀: 품종 및 보호 상태 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <h1 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold' }}>
                    {kind} {/* ex) [개] 믹스견 */}
                </h1>
                <span style={{
                    background: '#eef2ff', color: '#4f46e5',
                    padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: '500'
                }}>
                {status}
                </span>
            </div>


            {/*종 · 나이 · 성별 · 체중 · 보호소명*/}
            <h2>기본 정보</h2>
            <div style={{ color: '#666', fontSize: '16px', margin: '0 0 50px 0',paddingTop: '40px' }}>
                <p>종: {kind.replace(/\[.*\\]\s*/, '')}</p>
                <p>나이: {age}</p>
                <p>성별: {gender}</p>
                <p>무게: {weight}</p>
                <p>보호소: {shelterName}</p>
                <p>발견 날짜: {discoveryDate}</p>
                <p>발견 장소: {discoveryPlace}</p>
            </div>

            {/* 태그 부분: 데이터에 배열 형식의 태그가 없으므로, 핵심 정보를 태그 형태로 시각화 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
                <Tag keyword="중성화" result={isNeutered === '아니오' ? '미완료' : '완료'}/>
                <Tag keyword="건강" result={healthStatus}/>
                <Tag keyword={"성별"}/>
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                text={favoriteLoading ? "처리중..." : (isLiked ? "찜됨" : "찜하기")}
                flex={1}
                bgColor={isLiked ? "#e11d48" : "#222"}
                textColor="white"
                onClick={handleToggleFavorite}
                />
                <Button
                    text="보호소 연락"
                    flex={1}
                    bgColor="white"
                    textColor="#222"
                    onClick={() => alert('보호소 연락 버튼을 눌렀음.')}
                />
            </div>
        </div>
    )
}

export default AnimalInfoBox;

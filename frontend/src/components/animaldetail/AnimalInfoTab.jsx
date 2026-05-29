import React,{useState} from "react";

function AnimalInfoTab({ animal }) {
    //탭 상태: 건강탭,보호소탭,성향탭
    const [nowTab, setNowTab] = useState('health'); //기본값은 건강탭

    const {
        //건강정보
        healthStatus,
        isNeutered,
        weight,
        color,

        //보호소 정보
        shelterName,  //보호소 이름
        shelterTel,   //보호소 전화번호
        shelterAddr,  //보호소 주소
        noticeNumber, //공고번호

        //성향정보
        description, //성향정보
        socialization, //사회성

    }=animal;

    return(
        <div className="mt-10">
            {/*탭 버튼 부분*/}
            <nav className="flex gap-3">
                <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    onClick={() => setNowTab('health')}
                >
                    건강 정보
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    onClick={() => setNowTab('shelter')}
                >
                    보호소 정보
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    onClick={() => setNowTab('personality')}
                >
                    성향 정보
                </button>
            </nav>
            <section className="mt-5 rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700">
            {/*자바스크립트의 &&연산자는 앞이 참이면 뒤를 그리고, 거짓이면 무시함*/}
            {/*건강탭 내용*/}
            {nowTab === 'health' && (
                <div>
                    <h4>건강정보</h4>
                    <p>건강 상태: {healthStatus}</p>
                    <p>중성화 여부: {isNeutered}</p>
                    <p>무게: {weight}</p>
                    <p>색깔: {color}</p>
                </div>
            )}
            {/*보호소탭 내용*/}
            {nowTab === 'shelter' && (
                <div>
                    <h4>보호소정보</h4>
                    <p>보호소 이름: {shelterName}</p>
                    <p>보호소 전화번호: {shelterTel}</p>
                    <p>보호소 주소: {shelterAddr}</p>
                    <p>공고번호: {noticeNumber}</p>
                </div>
            )}
            {/*성향탭 내용*/}
            {nowTab === 'personality' && (
                <div>
                    <h4>성향정보</h4>
                    <p>성향: {description}</p>
                    <p>사회성: {socialization}</p>
                </div>
            )}
            </section>
        </div>
    )
}

export default AnimalInfoTab;

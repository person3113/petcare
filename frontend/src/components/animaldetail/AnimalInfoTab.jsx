import React,{useState} from "react";

// 운영시간 포맷팅 유틸
const formatHours = (wStart, wEnd, wkStart, wkEnd, closed) => {
    let str = [];
    if (wStart && wEnd) str.push(`평일 ${wStart}~${wEnd}`);
    if (wkStart && wkEnd) str.push(`주말 ${wkStart}~${wkEnd}`);
    let closedStr = closed ? `휴무: ${closed}` : '';
    if (str.length === 0 && !closedStr) return "운영시간 정보 없음";
    
    return [str.join(' | '), closedStr].filter(Boolean).join(' | ');
}

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
        
        // 추가 보호소 상세 정보
        weekStartTime,
        weekEndTime,
        weekendStartTime,
        weekendEndTime,
        closedDays,
        vetPersonCnt,
        specsPersonCnt,
        medicalCnt,
        quarantineCnt,
        feedCnt,
        targetAnimals,

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
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${nowTab === 'health' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setNowTab('health')}
                >
                    건강 정보
                </button>
                <button
                    type="button"
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${nowTab === 'shelter' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setNowTab('shelter')}
                >
                    보호소 정보
                </button>
                <button
                    type="button"
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${nowTab === 'personality' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setNowTab('personality')}
                >
                    성향 정보
                </button>
            </nav>
            <section className="mt-5 rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
            
            {/*건강탭 내용*/}
            {nowTab === 'health' && (
                <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">🏥 건강정보</h4>
                    <p className="flex items-center gap-2"><span className="text-gray-500 w-24">건강 상태</span> <span className="font-medium">{healthStatus || '정보 없음'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-gray-500 w-24">중성화 여부</span> <span className="font-medium">{isNeutered || '정보 없음'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-gray-500 w-24">몸무게</span> <span className="font-medium">{weight || '정보 없음'}</span></p>
                    <p className="flex items-center gap-2"><span className="text-gray-500 w-24">모색</span> <span className="font-medium">{color || '정보 없음'}</span></p>
                </div>
            )}
            
            {/*보호소탭 내용*/}
            {nowTab === 'shelter' && (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">🏢 기본 정보</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p className="flex flex-col"><span className="text-xs text-gray-500 mb-1">보호소 이름</span> <span className="font-bold text-gray-900">{shelterName || '정보 없음'}</span></p>
                            <p className="flex flex-col"><span className="text-xs text-gray-500 mb-1">연락처</span> <span className="font-medium">{shelterTel || '정보 없음'}</span></p>
                            <p className="flex flex-col md:col-span-2"><span className="text-xs text-gray-500 mb-1">주소</span> <span className="font-medium">{shelterAddr || '정보 없음'}</span></p>
                            <p className="flex flex-col md:col-span-2"><span className="text-xs text-gray-500 mb-1">운영시간</span> <span className="font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{formatHours(weekStartTime, weekEndTime, weekendStartTime, weekendEndTime, closedDays)}</span></p>
                            <p className="flex flex-col"><span className="text-xs text-gray-500 mb-1">공고번호</span> <span className="font-medium text-blue-600">{noticeNumber || '정보 없음'}</span></p>
                            <p className="flex flex-col"><span className="text-xs text-gray-500 mb-1">구조대상동물</span> <span className="font-medium">{targetAnimals || '정보 없음'}</span></p>
                        </div>
                    </div>
                    
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">🩺 시설 및 인력 정보</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                            <p className="flex items-center gap-2"><span className="text-gray-500">수의사</span> <span className="font-bold text-gray-900">{vetPersonCnt != null ? `${vetPersonCnt}명` : '-'}</span></p>
                            <p className="flex items-center gap-2"><span className="text-gray-500">사양관리사</span> <span className="font-bold text-gray-900">{specsPersonCnt != null ? `${specsPersonCnt}명` : '-'}</span></p>
                            <p className="flex items-center gap-2"><span className="text-gray-500">진료실</span> <span className="font-bold text-gray-900">{medicalCnt != null ? `${medicalCnt}실` : '-'}</span></p>
                            <p className="flex items-center gap-2"><span className="text-gray-500">격리실</span> <span className="font-bold text-gray-900">{quarantineCnt != null ? `${quarantineCnt}실` : '-'}</span></p>
                            <p className="flex items-center gap-2"><span className="text-gray-500">사육실</span> <span className="font-bold text-gray-900">{feedCnt != null ? `${feedCnt}실` : '-'}</span></p>
                        </div>
                    </div>
                </div>
            )}
            
            {/*성향탭 내용*/}
            {nowTab === 'personality' && (
                <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">🐾 성향정보</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">성향 및 특징</p>
                        <p className="font-medium leading-relaxed">{description || '등록된 성향 정보가 없습니다.'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">사회성</p>
                        <p className="font-medium leading-relaxed">{socialization || '등록된 사회성 정보가 없습니다.'}</p>
                    </div>
                </div>
            )}
            </section>
        </div>
    )
}

export default AnimalInfoTab;

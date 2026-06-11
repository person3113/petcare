import React from 'react';

function LostAnimalDetailSection({ animal }) {
    if (!animal) return null;

    const {
        discoveryDate, 
        discoveryPlace, // 분실장소+상세 주소 (백엔드에서 합쳐서 줌)
        jurisdiction
    } = animal;

    const formatDate = (dateString) => {
        if (!dateString) return '정보 없음';
        const date = new Date(dateString.replace(' ', 'T'));
        if (isNaN(date)) return dateString;
        
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes() === 0 ? '00' : date.getMinutes()}분`;
    };

    return (
        <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-100 pb-2">
                상세 정보
            </h3>
            
            <section className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
                <div className="space-y-4">
                    <p className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 border-b border-gray-50 pb-3">
                        <span className="text-gray-500 font-medium md:w-32">분실 일시</span>
                        <span className="font-bold text-gray-900">{formatDate(discoveryDate)}</span>
                    </p>
                    
                    <p className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 border-b border-gray-50 pb-3">
                        <span className="text-gray-500 font-medium md:w-32">분실 장소</span>
                        <span className="font-medium text-gray-800">{discoveryPlace || '정보 없음'}</span>
                    </p>
                    
                    <p className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <span className="text-gray-500 font-medium md:w-32">담당 관할기관</span>
                        <span className="font-medium text-accent">{jurisdiction || '정보 없음'}</span>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default LostAnimalDetailSection;

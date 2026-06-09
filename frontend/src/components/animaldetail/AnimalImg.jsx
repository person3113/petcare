import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';

function AnimalImg(props) {
    const [validImages, setValidImages] = useState(() => Array.from(new Set(props.images || [])));

    //현재 이미지 인덱스
    const [nowimg, setNowimg] = useState(0);


    useEffect(() => {
        // 이미지가 1장 이하면 타이머 필요 없음
        if (validImages.length <= 1) return;

        const timer = setInterval(() => {
            setNowimg((prev) => {
                // 다음 사진이 있으면 +1, 마지막이면 0
                return prev >= validImages.length - 1 ? 0 : prev + 1;
                });
            }, 3000); // 3초

        // 타이머 제거, 에러 방지용
        return () => clearInterval(timer);
        }, [validImages.length]); // 타이머 재설정

    // 인덱스 초과 방지
    useEffect(() => {
        if (nowimg >= validImages.length && validImages.length > 0) {
            setNowimg(validImages.length - 1);
        }
    }, [validImages.length, nowimg]);

    const handleImageError = (failedSrc) => {
        setValidImages(prev => prev.filter(img => img !== failedSrc));
    };

    return(
        <div className="max-w-[600px] p-5">
            {/*이미지 부분*/}
            {validImages.length > 0 ? (
                //이미지 슬라이드 부분
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gray-100">
                    <div
                        className="flex h-full w-full transition-transform duration-500 ease-out"
                        //왼쪽으로 x축 이동
                        style={{ transform: `translateX(-${nowimg * 100}%)`}}>
                        {validImages.map((img, index) => (
                            <img
                                key={img} 
                                src={img}
                                alt="동물사진"
                                onError={() => handleImageError(img)}
                                className="h-full w-full flex-shrink-0 object-cover"
                            />
                        ))}
                    </div>
                    {/*현재위치 표시*/}
                    {validImages.length > 1 && (
                        <div className="absolute bottom-4 left-0 flex w-full justify-center gap-2">
                            {validImages.map((_, index) => (
                                <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 
                                ${index === nowimg ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

            ) : (
                <div className="flex flex-col h-[450px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    <PawPrint className="w-12 h-12 mb-3 opacity-50" />
                    <span className="font-medium text-base">사진 없음</span>
                </div>
            )}

        </div>
    )
}

export default AnimalImg;

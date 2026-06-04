import React,{useState, useEffect}from 'react';

function AnimalImg(props) {
    const images = props.images || [];

    //현재 보여주는 이미지 인덱스(이미지 슬라이드를 위한)
    const [nowimg, setNowimg] = useState(0);


    useEffect(() => {
        // 이미지가 1장 이하면 타이머 필요 없음
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setNowimg((prev) => {
                // 다음 사진이 있으면 +1, 마지막이면 다시 0
                return prev === images.length - 1 ? 0 : prev + 1;
                });
            }, 3000); // 3초(3000ms)마다 안의 함수 실행

        // 컴포넌트가 사라질 때 타이머 제거 (에러 방지용)
        return () => clearInterval(timer);
        }, [images.length]); // 이미지 개수가 바뀔 때만 타이머 재설정

    return(
        <div className="max-w-[600px] p-5">
            {/*이미지 부분*/}
            {images.length > 0 ? (
                //이미지 슬라이드 부분
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gray-100">
                    <div
                        className="flex h-full w-full transition-transform duration-500 ease-out"
                        //왼쪽으로 x축 이동 ex)인덱스0이면 0*100%라서 제자리 다음 사진은 -100%이동
                        style={{ transform: `translateX(-${nowimg * 100}%)`}}>
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt="동물사진"
                                //flex-shrink-0:가로로 나열된 이미지 크기 유지용
                                className="h-full w-full flex-shrink-0 object-cover"
                            />
                        ))}
                    </div>
                    {/*사진이 여러개일때 하단에 현재위치 표시점 부분*/}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 flex w-full justify-center gap-2">
                            {images.map((_, index) => (
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
                <div className="flex h-[450px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
                    사진 없음
                </div>
            )}

        </div>
    )
}

export default AnimalImg;

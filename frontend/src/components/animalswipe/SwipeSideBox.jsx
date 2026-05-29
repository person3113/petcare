import React from 'react';


function SwipeSideBox({LikeCnt}) {

    return(
        <div className="flex flex-col items-center">
            {/*오늘의 찜 부분*/}
            <div className="flex h-[200px] w-[300px] flex-col items-center justify-center rounded-[25px] border-2 border-gray-300 bg-white">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">오늘의 찜</h2>
                <h2 className="text-3xl font-bold text-gray-900">{LikeCnt}</h2>
            </div>
            {/*다른 필터링 등 사이드바에 넣을 내용 여기 추가*/}
        </div>

    )
}

export default SwipeSideBox;

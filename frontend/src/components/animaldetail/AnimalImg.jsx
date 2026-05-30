import React from 'react';

function AnimalImg(props) {
    const images = props.images || [];

    return(
        <div className="max-w-[600px] p-5">
            {/*이미지 부분*/}
            {images[0] ? (
                <img
                    src={images[0]}
                    alt="동물사진"
                    className="h-[450px] w-full rounded-xl object-cover"
                />
            ) : (
                <div className="flex h-[450px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500">
                    사진 없음
                </div>
            )}
        </div>
    )
}

export default AnimalImg;

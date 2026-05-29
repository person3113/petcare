import React from 'react';

function AnimalImg(props) {
    const images = props.images;

    return(
        <div className="max-w-[600px] p-5">
            {/*이미지 부분*/}
            <img
                src={images[0]}
                alt="동물사진"
                className="h-[450px] w-full rounded-xl object-cover"
            />
        </div>
    )
}

export default AnimalImg;

import React from 'react';

function AnimalImg(props) {
    const images = props.images;

    return(
        <div className="animal-img" style={{ padding: '20px', maxWidth: '600px' }}>
            {/*이미지 부분*/}
            <img src={images[0]} alt="동물사진"
                 style={{
                     width: '100%',
                     height: '450px',
                     objectFit: 'cover', //이미지 비율유지
                     borderRadius: '12px', //모서리 둥글게
                     marginBottom: '20px'
                 }}/>
        </div>
    )
}

export default AnimalImg;
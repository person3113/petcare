import React from 'react';


function SwipeSideBox({LikeCnt}) {

    const sideBoxstyle={
        margin: '20px',
        width: '300px',
        height: '200px',
        background: 'white',
        borderRadius: '25px',
        border: '2px solid #C1C1C1',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
    }

    return(
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            {/*오늘의 찜 부분*/}
            <div style={sideBoxstyle}>
                <h2 style={{margin:'40px',color: 'black',}}>오늘의 찜</h2>
                <h2 style={{color: 'black'}}>{LikeCnt}</h2>
            </div>
            {/*다른 필터링 등 사이드바에 넣을 내용 여기 추가*/}
        </div>

    )
}

export default SwipeSideBox;
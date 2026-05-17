import React from 'react';

function Button({
         text,           // 버튼에 들어갈 글자
         onClick,        // 클릭 시 실행할 함수
         bgColor = '#222',    // 배경색 (기본값 설정)
         textColor = '#fff',  // 글자색 (기본값 설정)
         width = 'auto',      // 가로 너비
         flex = 'none',       // flex (none이면 글자크기만큼 버튼)
         border = 'none'      // 테두리
     }) {

    const buttonStyle = {
        backgroundColor: bgColor,
        color: textColor,
        width: width,
        flex: flex,
        border: border,
        padding: '15px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.2s'
    };


    return (
        <button
        style={buttonStyle}
        onClick={onClick}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
            {text}
        </button>
    )
}

export default Button;
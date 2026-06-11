import React from 'react';

// variant를 쓰면 미리 정해진 색상 스타일이 적용됨.
const variantStyles = {
    primary:   { backgroundColor: '#f59e0b', color: '#fff',     border: 'none' },
    secondary: { backgroundColor: '#fff',    color: '#f59e0b',  border: '1px solid #f59e0b' },
    danger:    { backgroundColor: '#ef4444', color: '#fff',     border: 'none' },
};

function Button({
         text,                // 버튼에 들어갈 글자
         onClick,             // 클릭 시 실행할 함수
         variant,             // 'primary' | 'secondary' | 'danger' (선택)
         bgColor,             // 배경색(직접 지정 시 variant보다 우선)
         textColor,           // 글자색(직접 지정 우선)
         width = 'auto',      // 가로 너비
         flex = 'none',       // flex (none이면 글자크기만큼 버튼)
         border,              // 테두리 (직접 지정 우선)
     }) {

    // variant 기본값
    const base = variant ? variantStyles[variant] : { backgroundColor: bgColor ?? '#222', color: textColor ?? '#fff', border: border ?? 'none' };

    const buttonStyle = {
        backgroundColor: bgColor ?? base.backgroundColor,
        color: textColor ?? base.color,
        border: border ?? base.border,
        width: width,
        flex: flex,
        padding: '15px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.2s',
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
            {text}
        </button>
    );
}

export default Button;

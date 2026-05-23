// userState는 백엔드에 적용하는 것에 맞춰서 추후 변경
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const[email, setEmail] = useState('');          // 이메일
    const[pwd, setPwd] = useState('');              // 비밀번호
    const[username, setUsername] = useState('');    // 사용자 이름
    const[error, setError]=useState('');           // 에러 메시지

    const passToLogin=()=>{
            // 회원가입 후 로그인으로 이동
            // 이동시켜주는 함수 nevigate()가 미완성, 추후 완성에 따라서 수정 필요
            navigate('/login');
        }

    const submitSignup=(event)=>{   // event는 폼 작성에서 발생하는 이벤트에 대한 객체
        event.preventDefault();     // 어떠한 동작으로도 입력된 state값을 날아가지 않게 해줌

        try{
            // 회원가입 성공시 로그인 페이지로 이동
            navigate('/login');
        }
        catch(error){
            // 이메일 형식 오류 -> 약간 완벽하게 불가능 (임시; 현재 모습으로는 형식 검사 완전X)
            // 정규식으로 검사하는 것도 검토 칠요 -> 이경우 더 많은 특수문자 반영이 쉬워짐
            if(!email.includes('@') || !email.includes('.'))
                setError('이메일 형식이 올바르지 않습니다.');
            // 비밀번호 형식 오류 -> 8자 이상 + 특수문자 포함 (포함시킬거 고려)
            else if(pwd.length < 8)
                setError('비밀번호는 8자 이상이여야 합니다.');
            else if(!pwd.includes('!') || !pwd.includes('!@'))
                setError('비밀번호는 특수문자를 포함해야 합니다.');
            // 사용자 이름 형식 오류 -> 2자 이상 + 특수문자 포함 불가 (포함시킬건지 고려)
            else if(username.length < 2)
                setError('사용자 이름은 2자 이상이여야 합니다.');
            // else if(username.includes('!') || username.includes('@'))
                // setError('사용자 이름은 특수문자를 포함할 수 없습니다.');
            // 이미 존재하는 이메일
            else setError('이미 존재하는 이메일입니다.');
        }
    }

    return(
        <div>
            {/* 회원가입 폼 */}
            <form onSubmit={submitSignup}>
                {/* event객체로 onChange로 set변수들을 저장 */}
                <input type="text" value={username} onChange={event=>setUsername(event.target.value)} placeholder="insert your username"/>
                <input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="insert your email"/>
                <input type="password" value={pwd} onChange={event=>setPwd(event.target.value)} placeholder="insert your password"/>

                <button type="submit">Submit</button>   {/* 회원가입 버튼 */}
                <button type="button" onClick={passToLogin}>로그인으로 이동</button>   {/* 회원가입과 별개로 정말 로그인으로 이동하는 버튼 */}
            </form>
        </div>
    );
}

export default Signup;
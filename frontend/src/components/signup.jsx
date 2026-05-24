import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { register } from '../api/auth.js';

function Signup() {
    const navigate = useNavigate();
    const[email, setEmail] = useState('');          // 이메일
    const[pwd, setPwd] = useState('');              // 비밀번호
    const[username, setUsername] = useState('');    // 사용자 이름
    const[error, setError]=useState('');           // 에러 메시지
    const[loading, setLoading] = useState(false);


    const submitSignup = async (event) => {   // event는 폼 작성에서 발생하는 이벤트에 대한 객체
        event.preventDefault();     // 어떠한 동작으로도 입력된 state값을 날아가지 않게 해줌
        setError('');

        // 이메일 정규식 검사
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('이메일 형식이 올바르지 않습니다.');
            return;
        }
        // 비밀번호 형식 오류 -> 8자 이상
        if(pwd.length < 8) {
            setError('비밀번호는 8자 이상이여야 합니다.');
            return;
        }
        // 특수문자 포함
        if(!/[!@#$%^&*]/.test(pwd)) {
            setError('비밀번호는 특수문자를 포함해야 합니다.');
            return;
        }
        // 닉네임 길이 오류 -> 2자 이상
        if(username.length < 1) {
            setError('닉네임은 2자 이상이여야 합니다.');
            return;
        }
        // 닉네임에는 특수문자 미포함
        if(/[!@#$%^&*]/.test(pwd)) {
            setError('닉네임에는 특수문자를 포함되면 안됩니다.');
            return;
        }

        setLoading(true);
        try{
            // 회원가입 성공시 로그인 페이지로 이동
            await login({emil,password:pwd});
            navigate('/login');
        }
        catch(err){
            setError(err?.message || '회원가입에 실패하였습니다. 다시 시도해주세요.');
        }
        finally{
            setLoading(false);
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
                {error && <p>{error}</p>}
                <button type="submit">Submit</button>   {/* 회원가입 버튼 */}
                <button type="button" onClick={()=>navigate('/login')}>로그인으로 이동</button>   {/* 회원가입과 별개로 정말 로그인으로 이동하는 버튼 */}
            </form>
        </div>
    );
}

export default Signup;
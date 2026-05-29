import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../qpi/auth.js';

function Login() {
    const navigate = useNavigate();
    const[email, setEmail] = useState('');  // 이메일
    const[pwd, setPwd] = useState('');      // 비밀번호
    const[error, setError] = useState('');  // 에러 메시지
    const[loading, setLoading] = useState(false);

    // 로그인 버튼 클릭시 일어나는 이벤트
    const submitLogin = async (event) => {
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
        // 매칭되는 이메일 및 비밀번호 없음 -> 옵션 결정해주기

        setLoading(true);
        // 검사후 로그인 여부 결정
        try{
            // 만약 로그인을 성공했다면 메인 페이지로
            // (네비게이션의 로그인 옵셕을 제외하고 프로필로 교체)
            await login({emil,password:pwd});
            navigate('/');
        }
        catch(err){
            setError(err?.message || '로그인에 실패하였습니다. 다시 시도해주세요.');
        }
        finally{
            setLoading(false);
        }
    }

    const passToSignup=()=>{
        // 로그인 버튼 옆에 회원가입으로 이동하는 버튼
        // 이동시켜주는 함수 nevigate() 미완성, 추후 수정 필요
        navigate('/singup');
    }
    return (
        <div>
            {/* 로그인 폼 */}
            <form onSubmit={submitLogin}>

                {/* 이메일과 패스워드값을 받고 서버에서 비교후 로그인 성공 여부 판단 */}
                <input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="insert your email"/>
                <input type="password" value={pwd} onChange={event=>setPwd(event.target.value)} placeholder="insert your password"/>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>Submit</button>   {/* 로그인 버튼 */}
                <button type="button" onClick={()=>navigate('/signup')}>회원가입으로 이동</button>   {/* 회원가입으로 페이지를 이동해주는 버튼 */}
            </form>
       </div>
    );
}

export default Login;
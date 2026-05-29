import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
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

    try {
      const data = await login(form);
      const user = data?.data || data;
      setUser(user || null);
      navigate('/');
    } catch (err) {
      setError(err?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

export default Login;

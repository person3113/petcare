import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth.js';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
  });
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

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-email">이메일</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-password">비밀번호</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="register-nickname">닉네임</label>
          <input
            id="register-nickname"
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default Register;

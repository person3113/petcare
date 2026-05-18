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

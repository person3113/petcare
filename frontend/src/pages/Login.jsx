import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('이메일 형식이 올바르지 않습니다.');
        return;
    }
    // 비밀번호 형식 오류 -> 8자 이상
    if(form.password.length < 8) {
        setError('비밀번호는 8자 이상이여야 합니다.');
        return;
    }
    // 특수문자 포함
    if(!/[!@#$%^&*]/.test(form.password)) {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">계정이 없으신가요?
            <Link to ="/register" className="font-bold text-black hover:underline">회원가입하러가기</Link></p>
      </div>
    </div>
  );
}

export default Login;

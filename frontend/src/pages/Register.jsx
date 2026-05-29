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
    // 닉네임 길이 오류 -> 2자 이상
    if(form.nickname.length < 2) {
        setError('닉네임은 2자 이상이여야 합니다.');
        return;
    }
    // 닉네임에는 특수문자 미포함
    if(/[!@#$%^&*]/.test(form.nickname)) {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="register-nickname" className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
              id="register-nickname"
              name="nickname"
              type="text"
              value={form.nickname}
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
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );

export default Register;

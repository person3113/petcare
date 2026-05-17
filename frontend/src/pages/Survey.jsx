import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchQuiz } from '../api/match.js';

function Survey() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    upkind: '',
    sexCd: '',
    neuterYn: '',
    uprCd: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        page: 1,
        limit: 20,
      };
      const data = await matchQuiz(payload);
      navigate('/match-result', { state: data?.data || data });
    } catch (err) {
      setError(err?.message || '설문 매칭에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '26px', marginBottom: '12px' }}>간단 설문</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        원하는 조건을 간단히 선택하면 추천 동물을 보여줍니다.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="survey-upkind">축종</label>
          <select
            id="survey-upkind"
            name="upkind"
            value={form.upkind}
            onChange={handleChange}
          >
            <option value="">선택 안함</option>
            <option value="417000">개</option>
            <option value="422400">고양이</option>
            <option value="429900">기타</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="survey-sex">성별</label>
          <select
            id="survey-sex"
            name="sexCd"
            value={form.sexCd}
            onChange={handleChange}
          >
            <option value="">선택 안함</option>
            <option value="M">수컷</option>
            <option value="F">암컷</option>
            <option value="Q">미상</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="survey-neuter">중성화</label>
          <select
            id="survey-neuter"
            name="neuterYn"
            value={form.neuterYn}
            onChange={handleChange}
          >
            <option value="">선택 안함</option>
            <option value="Y">예</option>
            <option value="N">아니오</option>
            <option value="U">미상</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="survey-upr">지역(시도코드)</label>
          <input
            id="survey-upr"
            name="uprCd"
            type="text"
            placeholder="예: 6110000"
            value={form.uprCd}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="survey-state">상태</label>
          <select
            id="survey-state"
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            <option value="">선택 안함</option>
            <option value="notice">공고중</option>
            <option value="protect">보호중</option>
          </select>
        </div>

        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '매칭 중...' : '추천 보기'}
        </button>
      </form>
    </div>
  );
}

export default Survey;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchQuiz, buildMatchParams } from '../api/match.js';
import { fetchSido } from '../api/animals.js';

// 설문 5문항 페이지
// 각 문항 응답을 모아 buildMatchParams로 변환 후 API 호출
function Survey() {
  const navigate = useNavigate();

  // 폼 상태: 5문항 각 선택값
  const [form, setForm] = useState({
    upkind: '',    // 축종
    sexCd: '',     // 성별
    neuterYn: '',  // 중성화 여부
    uprCd: '',     // 지역(시도 코드)
    state: '',     // 보호 상태
  });

  // 시도 목록 상태 (드롭다운 옵션용)
  const [sidoList, setSidoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 마운트 시 시도 목록 불러오기
  useEffect(() => {
    fetchSido()
      .then((list) => setSidoList(list))
      .catch(() => setSidoList([])); // 실패해도 빈 배열로 graceful 처리
  }, []);

  // 드롭다운/셀렉트 변경 핸들러
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 폼 제출 핸들러
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 빈 값 제거 후 payload 변환
      const payload = buildMatchParams(form);
      const data = await matchQuiz(payload);
      // 결과 페이지로 데이터 전달
      navigate('/match-result', { state: data?.data || data });
    } catch (err) {
      setError(err?.message || '설문 매칭에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-lg">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">🐾 간단 설문</h1>
          <p className="mt-2 text-sm text-gray-500">
            원하는 조건을 선택하면 어울리는 동물을 추천해 드립니다.
          </p>
        </div>

        {/* 설문 폼 카드 */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* 문항 1: 축종 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="survey-upkind" className="text-sm font-semibold text-gray-700">
                1. 어떤 동물을 원하시나요?
              </label>
              <select
                id="survey-upkind"
                name="upkind"
                value={form.upkind}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">선택 안함 (상관없어요)</option>
                <option value="417000">🐶 개</option>
                <option value="422400">🐱 고양이</option>
                <option value="429900">🐾 기타</option>
              </select>
            </div>

            {/* 문항 2: 성별 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="survey-sex" className="text-sm font-semibold text-gray-700">
                2. 선호하는 성별이 있나요?
              </label>
              <select
                id="survey-sex"
                name="sexCd"
                value={form.sexCd}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">선택 안함 (상관없어요)</option>
                <option value="M">수컷</option>
                <option value="F">암컷</option>
                <option value="Q">미상</option>
              </select>
            </div>

            {/* 문항 3: 중성화 여부 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="survey-neuter" className="text-sm font-semibold text-gray-700">
                3. 중성화 여부를 고려하시나요?
              </label>
              <select
                id="survey-neuter"
                name="neuterYn"
                value={form.neuterYn}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">선택 안함 (상관없어요)</option>
                <option value="Y">중성화 완료</option>
                <option value="N">중성화 안됨</option>
                <option value="U">미상</option>
              </select>
            </div>

            {/* 문항 4: 지역(시도) — 텍스트 input → 드롭다운으로 교체 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="survey-upr" className="text-sm font-semibold text-gray-700">
                4. 어느 지역의 동물을 찾으시나요?
              </label>
              <select
                id="survey-upr"
                name="uprCd"
                value={form.uprCd}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">선택 안함 (전국)</option>
                {/* 시도 목록을 mock JSON에서 불러와서 옵션으로 렌더링 */}
                {sidoList.map((sido) => (
                  <option key={sido.code} value={sido.code}>
                    {sido.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 문항 5: 보호 상태 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="survey-state" className="text-sm font-semibold text-gray-700">
                5. 보호 상태를 선택해 주세요.
              </label>
              <select
                id="survey-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="">선택 안함 (상관없어요)</option>
                <option value="notice">공고중</option>
                <option value="protect">보호중</option>
              </select>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? '매칭 중...' : '추천 동물 보기 →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Survey;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMySurvey } from '../../api/survey.js';
import { matchQuiz, buildMatchParams } from '../../api/match.js';

function SurveyHistory() {
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matchLoading, setMatchLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMySurvey()
            .then((data) => {
                setSurvey(data?.data || null);
            })
            .catch((err) => {
                setError(err?.message || '설문 기록을 불러오지 못했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    function labelUpkind(value) {
        if (value === '417000') return '개';
        if (value === '422400') return '고양이';
        if (value === '429900') return '기타';
        return '상관없음';
    }

    function labelSex(value) {
        if (value === 'M') return '수컷';
        if (value === 'F') return '암컷';
        if (value === 'Q') return '미상';
        return '상관없음';
    }

    function labelNeuter(value) {
        if (value === 'Y') return '중성화 완료';
        if (value === 'N') return '미중성';
        if (value === 'U') return '미상';
        return '상관없음';
    }

    function labelState(value) {
        if (value === 'notice') return '공고중';
        if (value === 'protect') return '보호중';
        return '상관없음';
    }

    function handleFindMatches() {
        if (!survey) return;
        setMatchLoading(true);
        setError('');
        
        const payload = buildMatchParams(survey);
        matchQuiz(payload)
            .then(response => {
                const data = response?.data || {};
                navigate('/match-result', {
                    state: {
                        items: data.items || [],
                        pagination: data.pagination || null,
                        criteria: payload,
                    },
                });
            })
            .catch(err => {
                setError(err?.message || '동물 매칭 데이터를 불러오는데 실패했습니다.');
            })
            .finally(() => {
                setMatchLoading(false);
            });
    }

    if(loading) {
        return (
            <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm border border-gray-100">
                불러오는 중...
            </div>
        )
    }
    if(error) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-sm text-red-600 shadow-sm border border-red-100">
                에러: {error}
            </div>
        )
    }

    if(!survey) {
        return(
            <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm border border-gray-100">
                아직 설문 기록이 없습니다.
                <div className="mt-4">
                    <Link
                        to="/survey"
                        className="inline-block rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-500 hover:bg-amber-50"
                    >
                        설문 하러가기
                    </Link>
                </div>
            </div>
        )
    }

    return(
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">내 설문 기록</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span className="text-gray-500">축종</span>
                    <span>{labelUpkind(survey.upkind)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">성별</span>
                    <span>{labelSex(survey.sexCd)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">중성화</span>
                    <span>{labelNeuter(survey.neuterYn)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">지역(시도)</span>
                    <span>{survey.uprCd || '상관없음'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">보호 상태</span>
                    <span>{labelState(survey.state)}</span>
                </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
                <Link
                    to="/survey"
                    className="inline-block rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-500 transition hover:bg-amber-50"
                >
                    설문 다시하기
                </Link>
                <button
                    onClick={handleFindMatches}
                    disabled={matchLoading}
                    className="inline-block rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
                >
                    {matchLoading ? '가져오는 중...' : '맞춤 동물 찾기'}
                </button>
            </div>
        </div>
    )
}

export default SurveyHistory;
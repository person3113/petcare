import { request } from './http.js';

// 설문 폼 응답 객체를 API에 보낼 파라미터 객체로 변환하는 함수
// 선택 안함(빈 문자열) 필드는 payload에서 제외함
function buildMatchParams(form) {
  const params = {};

  if (form.upkind)   params.upkind   = form.upkind;
  if (form.sexCd)    params.sexCd    = form.sexCd;
  if (form.neuterYn) params.neuterYn = form.neuterYn;
  if (form.uprCd)    params.uprCd    = form.uprCd;
  if (form.state)    params.state    = form.state;

  // 페이지네이션 고정값
  params.page  = 1;
  params.limit = 20;

  return params;
}

function matchQuiz(payload) {
  return request('/api/match/quiz', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { buildMatchParams, matchQuiz };

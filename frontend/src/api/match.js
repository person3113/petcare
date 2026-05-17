import { request } from './http.js';

function matchQuiz(payload) {
  return request('/api/match/quiz', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { matchQuiz };

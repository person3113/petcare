import { request } from './http.js';

function saveSurvey(payload) {
  return request('/api/surveys', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function fetchMySurvey() {
  return request('/api/surveys/me', {
    method: 'GET',
  });
}

export { saveSurvey, fetchMySurvey };

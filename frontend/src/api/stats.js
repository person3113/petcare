import { request } from './http.js';

function getStatsSummary() {
  return request('/api/stats/summary', { method: 'GET' });
}

function getStatsChart() {
  return request('/api/stats/chart', { method: 'GET' });
}

export { getStatsSummary, getStatsChart };

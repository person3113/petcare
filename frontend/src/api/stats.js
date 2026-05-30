import { request } from './http.js';

function getStatsSummary() {
  return request('/api/stats/summary', { method: 'GET' });
}

function getStatsChart() {
  return request('/api/stats/chart', { method: 'GET' });
}

function getRealtimeSummary() {
  return request('/api/stats/realtime-summary', { method: 'GET' });
}

function getRegionalRates(startDate, endDate) {
  return request(`/api/stats/regional-rates?startDate=${startDate}&endDate=${endDate}`, { method: 'GET' });
}

function getNationalStatus(startDate, endDate) {
  return request(`/api/stats/national-status?startDate=${startDate}&endDate=${endDate}`, { method: 'GET' });
}

export { getStatsSummary, getStatsChart, getRealtimeSummary, getRegionalRates, getNationalStatus };

import { request } from './http.js';

function getStatsSummary() {
  return request('/api/stats/summary', { method: 'GET' });
}

function getStatsChart() {
  return request('/api/stats/chart', { method: 'GET' });
}

function getRealtimeSummary() {
  return request('/api/stats/v2/realtime-summary', { method: 'GET' });
}

function getRegionalRates(startDate, endDate) {
  return request(`/api/stats/regional-rates?startDate=${startDate}&endDate=${endDate}`, { method: 'GET' });
}

function getNationalStatus(startDate, endDate) {
  return request(`/api/stats/national-status?startDate=${startDate}&endDate=${endDate}`, { method: 'GET' });
}

function getGlobalStats() {
  return request('/api/stats/v2/global', { method: 'GET' });
}

function getFilteredStats(startDate = '', endDate = '', sido = '') {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (sido) params.append('sido', sido);
  
  const queryString = params.toString();
  return request(`/api/stats/v2/details${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
}

export { getStatsSummary, getStatsChart, getRealtimeSummary, getRegionalRates, getNationalStatus, getGlobalStats, getFilteredStats };

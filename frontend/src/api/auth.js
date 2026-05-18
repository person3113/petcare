import { request } from './http.js';

function register(payload) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function login(payload) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function logout() {
  return request('/api/auth/logout', {
    method: 'POST',
  });
}

function me() {
  return request('/api/auth/me', {
    method: 'GET',
    skipAuthError: true,
  });
}

export { register, login, logout, me };

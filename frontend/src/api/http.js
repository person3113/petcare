const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }).then(response => {
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const result = isJson ? response.json() : response.text();

    return result.then(data => {
      if (!response.ok) {
        const message =
          isJson && data && data.message
            ? data.message
            : '요청 처리 중 오류가 발생했습니다.';
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        if (response.status === 401 && !options.skipAuthError) {
          window.location.href = '/login';
        }
        throw error;
      }
      return data;
    });
  });
}

export { request };

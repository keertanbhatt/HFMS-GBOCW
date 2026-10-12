const API_URL = 'https://earlobe-lard-amendment.ngrok-free.dev/api';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = localStorage.getItem('hfms_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  if (API_URL.includes('ngrok')) {
    headers['ngrok-skip-browser-warning'] = '69420';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export const api = {
  login: (userId, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
    }),
  getShramSevaWindow: () => request('/shram-seva/window'),
  submitShramSevaEntry: (payload) =>
    request('/shram-seva/entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getShramSevaStats: ({ range = 'cumulative', date } = {}) => {
    const params = new URLSearchParams();
    if (range) params.set('range', range);
    if (date) params.set('date', date);
    const qs = params.toString();
    return request(`/shram-seva/stats${qs ? `?${qs}` : ''}`);
  },
  getShramSevaKendraEntries: (userId, { range = 'cumulative', date } = {}) => {
    const params = new URLSearchParams();
    if (range) params.set('range', range);
    if (date) params.set('date', date);
    const qs = params.toString();
    return request(`/shram-seva/kendra/${userId}/entries${qs ? `?${qs}` : ''}`);
  },
  getSummary: (financialYearId) =>
    request(
      `/dashboard/summary${financialYearId ? `?financialYearId=${financialYearId}` : ''}`,
    ),
  getSchemes: (financialYearId, search = '') => {
    const params = new URLSearchParams();
    if (financialYearId) params.set('financialYearId', financialYearId);
    if (search) params.set('search', search);
    const qs = params.toString();
    return request(`/dashboard/schemes${qs ? `?${qs}` : ''}`);
  },
  getCharts: (financialYearId) =>
    request(
      `/dashboard/charts${financialYearId ? `?financialYearId=${financialYearId}` : ''}`,
    ),
  getAnalytics: (financialYearId) =>
    request(
      `/dashboard/analytics${financialYearId ? `?financialYearId=${financialYearId}` : ''}`,
    ),
  getScheme: (id, financialYearId) =>
    request(
      `/schemes/${id}${financialYearId ? `?financialYearId=${financialYearId}` : ''}`,
    ),
};

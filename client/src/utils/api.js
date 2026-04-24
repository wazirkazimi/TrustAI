import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodtrust_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('foodtrust_token');
      localStorage.removeItem('foodtrust_user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  getMe:    ()      => api.get('/auth/me'),
};

// ─── Scan ────────────────────────────────────────────────────────────────────
export const scanAPI = {
  scanImage:   (formData) => api.post('/scan/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  scanBarcode: (barcode)  => api.post('/scan/barcode', { barcode }),
  getHistory:  ()         => api.get('/scan/history'),
  getScanById: (id)       => api.get(`/scan/${id}`),
};

// ─── Search ──────────────────────────────────────────────────────────────────
export const searchAPI = {
  search:        (q, page = 1) => api.get('/search', { params: { q, page } }),
  getCategories: ()            => api.get('/search/categories'),
};

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reportAPI = {
  create: (data) => api.post('/report', data),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const userAPI = {
  updateHealthMode: (healthMode) => api.put('/user/mode', { healthMode }),
  updateVeg:        (vegFilter)  => api.put('/user/veg', { vegFilter }),
  getBookmarks:     ()           => api.get('/user/bookmarks'),
  bookmark:         (scanId)     => api.post(`/user/bookmark/${scanId}`),
};

export default api;

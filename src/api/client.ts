import axios from 'axios';
import { getToken, clearToken } from '../utils/auth.utils.ts';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token to headers

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401 errors globally
api.interceptors.response.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        clearToken();
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;
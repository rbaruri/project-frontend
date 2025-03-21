import axios, { InternalAxiosRequestConfig } from 'axios';

// Remove /api from base URL since it's already included in the backend routes
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
    baseURL,
    withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        
        // Don't set Content-Type for FormData, let the browser set it with the boundary
        if (!(config.data instanceof FormData)) {
            config.headers.set('Content-Type', 'application/json');
        }

        // Log the complete URL for debugging
        const fullUrl = `${baseURL}${config.url}`;
        console.log('Making request to:', fullUrl);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/authentication/login';
        }
        return Promise.reject(error);
    }
);

export default api;

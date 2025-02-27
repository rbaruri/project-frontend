import axios from 'axios';

const baseURL = 'http://localhost:5000';

export const api = axios.create({
    baseURL,
    withCredentials: true // Enable sending cookies with requests
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Don't set Content-Type for FormData, let the browser set it with the boundary
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
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
            // Clear user data on unauthorized
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

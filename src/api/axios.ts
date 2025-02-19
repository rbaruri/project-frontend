import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: true // Enable if you're using cookies
});

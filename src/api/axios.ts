import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    withCredentials: false  // Change this to false since we don't need credentials
});

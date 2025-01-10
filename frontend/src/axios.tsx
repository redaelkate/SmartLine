// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://d0rgham.pythonanywhere.com/',  // Your Django backend URL
});

// Add a request interceptor to include the token in the header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Token ${token}`;  // For Token Authentication
            // config.headers['Authorization'] = `Bearer ${token}`;  // For JWT Authentication
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
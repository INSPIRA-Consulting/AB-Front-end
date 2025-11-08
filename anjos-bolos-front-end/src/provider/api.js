import axios from "axios";

const IP_API = import.meta.env.VITE_IP_API || 'localhost';
const BASE_URL = `/api`;

console.log('🔧 API Configuration:', {
    VITE_IP_API: import.meta.env.VITE_IP_API,
    IP_API,
    BASE_URL
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token dinamicamente em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (resp) => resp,
    (error) => {
        if (error?.response?.status === 404 || error?.response?.status === 400) {
            console.warn("API request failed:", error.response.status, error.config?.url);
        }
        return Promise.reject(error);
    }
);

export default api;

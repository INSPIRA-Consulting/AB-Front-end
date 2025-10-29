import axios from "axios";

const IP_API = import.meta.env.VITE_IP_API || 'localhost';
const BASE_URL = `http://${IP_API}:8080`;

console.log('🔧 API Configuration:', {
    VITE_IP_API: import.meta.env.VITE_IP_API,
    IP_API,
    BASE_URL,
    allEnvVars: import.meta.env
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
});

// Log de requisições
api.interceptors.request.use(
    (config) => {
        console.log('📤 Request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (resp) => {
        console.log('✅ Response:', resp.config.url, resp.status);
        return resp;
    },
    (error) => {
        console.error('❌ Response Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            fullURL: error.config?.baseURL + error.config?.url
        });
        
        if (error?.response?.status === 404 || error?.response?.status === 400) {
            console.warn("API request failed:", error.response.status, error.config?.url);
        }
        return Promise.reject(error);
    }
);

export default api;

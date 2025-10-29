import axios from "axios";

// Em produção e desenvolvimento, usa caminho relativo /api
// O Nginx (produção) ou Vite proxy (dev) fazem o roteamento para o backend
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Log apenas em desenvolvimento para debug
if (import.meta.env.DEV) {
    console.log('🔧 API configurada com baseURL:', '/api');
    console.log('📍 Modo:', import.meta.env.MODE);
}

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

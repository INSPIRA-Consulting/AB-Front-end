import axios from "axios";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

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

import axios from "axios";

const BASE_URL = `http://${import.meta.env.VITE_IP_API}:8080`;

const api = axios.create({
    baseURL: BASE_URL,
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

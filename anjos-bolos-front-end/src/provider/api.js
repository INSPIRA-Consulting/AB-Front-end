import axios from "axios";

const BASE_URL = `http://${import.meta.env.IP_API}:8080`;

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

export async function uploadImagemProduto(id, file) {
    if (!id || !file) throw new Error("ID e arquivo são obrigatórios");
    const formData = new FormData();
    formData.append('imagem', file);
    return api.patch(`/produtos/${id}/imagem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export default api;

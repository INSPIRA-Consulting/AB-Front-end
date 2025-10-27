import axios from "axios";

// Usa a URL da API definida no .env (Vite expõe variáveis que começam com VITE_)
// Fallbacks ajudam em ambientes locais quando a env não está configurada
const BASE_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.INSPIRA_API_URL ||
    "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
    // headers: { "Content-Type": "application/json" }
});

// Opcional: loga a URL final quando ocorrer 404/400 para facilitar debug
api.interceptors.response.use(
    (resp) => resp,
    (error) => {
        if (error?.response && (error.response.status === 404 || error.response.status === 400)) {
            const cfg = error.config || {};
            const fullUrl = `${cfg.baseURL || ""}${cfg.url || ""}`;
            // Mostra detalhes úteis no console sem quebrar o fluxo do app
            // eslint-disable-next-line no-console
            console.warn("API request failed:", {
                status: error.response.status,
                method: cfg.method,
                url: fullUrl,
                data: cfg.data,
            });
        }
        return Promise.reject(error);
    }
);

// Upload da imagem do produto para o endpoint PATCH /produtos/{id}/imagem
// Campo do formulário deve se chamar 'imagem' conforme backend
export async function uploadImagemProduto(id, file) {
    if (!id) throw new Error("Produto id é obrigatório para upload da imagem");
    if (!file) throw new Error("Arquivo de imagem é obrigatório");
    const formData = new FormData();
    formData.append('imagem', file);
    const response = await api.patch(`/produtos/${id}/imagem`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
}

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Injeta o token em toda requisição
api.interceptors.request.use((config) => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuario?.token) {
    config.headers.Authorization = `Bearer ${usuario.token}`;
  }
  return config;
});

// Redireciona para login se 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
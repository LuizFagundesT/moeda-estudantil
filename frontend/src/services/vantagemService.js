import api from "./api";

export const vantagemService = {
  listarTodas: () => api.get("/vantagens"),
  listarAtivas: () => api.get("/vantagens/ativas"),
  listarPorEmpresa: (empresaId) => api.get(`/vantagens/empresa/${empresaId}`),
  buscarPorId: (id) => api.get(`/vantagens/${id}`),
  criar: (empresaId, dados) => api.post(`/vantagens/empresa/${empresaId}`, dados),
  atualizar: (id, dados) => api.put(`/vantagens/${id}`, dados),
  deletar: (id) => api.delete(`/vantagens/${id}`),
};

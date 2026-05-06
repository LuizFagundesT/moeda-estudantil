import api from "./api";

export const empresaService = {
  listar: () => api.get("/empresas"),
  buscarPorId: (id) => api.get(`/empresas/${id}`),
  atualizar: (id, dados) => api.put(`/empresas/${id}`, dados),
  deletar: (id) => api.delete(`/empresas/${id}`),
};

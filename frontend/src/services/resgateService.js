import api from "./api";

export const resgateService = {
  resgatar: (alunoId, vantagemId) =>
    api.post(`/resgates/aluno/${alunoId}/vantagem/${vantagemId}`),

  listarPorEmpresa: (empresaId) =>
    api.get(`/resgates/empresa/${empresaId}`),

  listarPorAluno: (alunoId) =>
    api.get(`/resgates/aluno/${alunoId}`),

  atualizarStatus: (resgateId, status) =>
    api.patch(`/resgates/${resgateId}/status/${status}`),
};

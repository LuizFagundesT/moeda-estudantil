import api from "./api";

export const alunoService = {

  // Cadastro (público — usa endpoint de auth)
  cadastrar: (dados) =>
    api.post("/auth/register/aluno", dados),

  // Login
  login: (dados) =>
    api.post("/auth/login", dados),

  // Listar todos
  listar: () =>
    api.get("/alunos"),

  // Buscar por ID
  buscarPorId: (id) =>
    api.get(`/alunos/${id}`),

  // Atualizar
  atualizar: (id, dados) =>
    api.put(`/alunos/${id}`, dados),

  // Deletar
  deletar: (id) =>
    api.delete(`/alunos/${id}`),
};
import api from "./api"; // seu axios instance já configurado com baseURL e interceptor de token

export const professorService = {
  listar:       ()          => api.get("/professores"),
  buscarPorId:  (id)        => api.get(`/professores/${id}`),
  atualizar:    (id, data)  => api.put(`/professores/${id}`, data),
  deletar:      (id)        => api.delete(`/professores/${id}`),
  saldo:        (id)        => api.get(`/professores/${id}/saldo`),
  extrato:      (id)        => api.get(`/professores/${id}/extrato`),
  enviarMoedas: (id, body)  => api.post(`/professores/${id}/enviar-moedas`, body),
};
package com.moeda_estudantil.backend.dto;

/**
 * Evento publicado na fila quando um aluno resgata uma vantagem.
 */ 
public record ResgateEmailEventoDTO(
        String nomeAluno,
        String emailAluno,
        String tituloVantagem,
        String nomeEmpresa,
        String codigoCupom,
        Integer moedasGastas,
        Double saldoRestante
) {}
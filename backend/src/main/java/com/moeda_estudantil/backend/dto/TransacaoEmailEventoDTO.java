package com.moeda_estudantil.backend.dto;

/**
 * Evento publicado na fila quando um professor envia moedas para um aluno.
 */
public record TransacaoEmailEventoDTO(
        String nomeAluno,
        String emailAluno,
        String nomeProfessor,
        Double quantidadeMoedas,
        String descricao,
        Double novoSaldoAluno
) {}
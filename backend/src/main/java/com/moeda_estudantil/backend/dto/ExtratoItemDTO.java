package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.enums.TipoTransacao;
import lombok.Data;

import java.time.LocalDateTime;

// ─── Item do extrato (professor ou aluno) ────────────────────────────────────
@Data
public class ExtratoItemDTO {

    private Long id;
    private Double valor;
    private TipoTransacao tipo;
    private String descricao;
    private LocalDateTime data;

    // Para o extrato do professor, exibe para qual aluno foi enviado
    private String nomeAluno;
    private Long alunoId;
}
package com.moeda_estudantil.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// ─── Envio de moedas de professor para aluno ────────────────────────────────
@Data
public class EnviarMoedasRequestDTO {

    @NotNull(message = "ID do aluno é obrigatório")
    private Long alunoId;

    @NotNull(message = "Quantidade de moedas é obrigatória")
    @Min(value = 1, message = "O valor mínimo de envio é 1 moeda")
    private Double quantidade;

    @NotBlank(message = "O motivo do reconhecimento é obrigatório")
    private String motivo;
}
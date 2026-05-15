package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import lombok.Data;

// ─── Resposta geral de professor ────────────────────────────────────────────
@Data
public class ProfessorDTO {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String departamento;
    private String universidade;
    private Double saldoMoedas;
    private TipoUsuario tipo;
    private Endereco endereco;
}
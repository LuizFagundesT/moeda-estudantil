package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// ─── Atualização de dados do professor ──────────────────────────────────────
// (professores são pré-cadastrados via seeder; este DTO serve para PUT /professores/{id})
@Data
public class ProfessorUpdateRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    private String email;

    private String cpf;

    @NotBlank(message = "Departamento é obrigatório")
    private String departamento;

    @NotBlank(message = "Universidade é obrigatória")
    private String universidade;

    private Endereco endereco;
}
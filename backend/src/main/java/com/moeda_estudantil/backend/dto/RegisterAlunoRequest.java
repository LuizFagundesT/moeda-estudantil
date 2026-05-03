package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterAlunoRequest {
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String matricula;
    private String rg;
    private Endereco endereco;
}
package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterEmpresaRequest {
    private String nome;
    private String email;
    private String senha;
    private String cnpj;
    private String nomeFantasia;
    private Endereco endereco;
}
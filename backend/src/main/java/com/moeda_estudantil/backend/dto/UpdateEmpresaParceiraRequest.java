package com.moeda_estudantil.backend.dto;

import lombok.*;

@Getter
@Setter

public class UpdateEmpresaParceiraRequest {

    private String nome;
    private String cpf;
    private String cnpj;
    private String nomeFantasia;
}
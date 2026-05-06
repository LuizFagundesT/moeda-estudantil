package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import lombok.*;

@Getter
@Setter

public class UpdateEmpresaParceiraRequest {

    private String nome;
    private String email;
    private String cpf;
    private String cnpj;
    private String nomeFantasia;
    private Endereco endereco;
}
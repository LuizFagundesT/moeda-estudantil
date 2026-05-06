package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Endereco;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAlunoRequest {
    private String nome;
    private String curso;
    private Endereco endereco;
}
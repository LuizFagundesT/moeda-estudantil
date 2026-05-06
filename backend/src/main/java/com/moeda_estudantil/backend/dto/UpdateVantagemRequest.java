package com.moeda_estudantil.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateVantagemRequest {

    private String titulo;
    private String descricao;
    private Integer custoMoedas;
    private String fotoUrl;
    private Integer quantidadeDisponivel;
    private Boolean ativa;
}

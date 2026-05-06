package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Transacao;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TransacaoResponse {

    private Double valor;
    private String tipo;
    private String descricao;
    private LocalDateTime data;

    public TransacaoResponse(Transacao transacao) {
        this.valor = transacao.getValor();
        this.tipo = transacao.getTipo().name();
        this.descricao = transacao.getDescricao();
        this.data = transacao.getData();
    }
}
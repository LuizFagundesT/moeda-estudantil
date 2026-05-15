package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.moeda_estudantil.backend.enums.TipoTransacao;

import java.time.LocalDateTime;

@Entity
@Data
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valor;

    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo; // ENTRADA ou SAIDA

    private String descricao;

    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    // Professor que originou o envio (null para transações de resgate)
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;
}
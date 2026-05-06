package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "vantagens")
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, length = 1200)
    private String descricao;

    @Column(nullable = false)
    private Integer custoMoedas;

    @Column(length = 1000)
    private String fotoUrl;

    private Integer quantidadeDisponivel;

    private Boolean ativa = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_parceira_id")
    private EmpresaParceira empresaParceira;
}

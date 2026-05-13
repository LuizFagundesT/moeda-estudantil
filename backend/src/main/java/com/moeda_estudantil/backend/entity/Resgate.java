package com.moeda_estudantil.backend.entity;

import com.moeda_estudantil.backend.enums.StatusResgate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "resgates")
public class Resgate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigoCupom;

    @Column(nullable = false)
    private LocalDateTime dataResgate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusResgate status = StatusResgate.GERADO;

    @Column(nullable = false)
    private Integer custoMoedas;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "empresa_parceira_id")
    private EmpresaParceira empresaParceira;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vantagem_id")
    private Vantagem vantagem;
}

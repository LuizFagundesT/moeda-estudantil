package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "usuarios")
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    private String cpf;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    @Embedded
    private Endereco endereco;
}
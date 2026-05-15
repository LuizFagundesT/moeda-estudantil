package com.moeda_estudantil.backend.entity;

import com.moeda_estudantil.backend.entity.Usuario;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Professor extends Usuario {

    private String departamento;
    private String universidade;
    @Column(nullable=false)
    private Double saldoMoedas = 0.0;
}
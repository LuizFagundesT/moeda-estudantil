package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Aluno extends Usuario {

    private String matricula;
    private String rg;
    private String curso;
    private String instituicao;
    private Double saldoMoedas = 0.0;
}
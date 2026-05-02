package com.moeda_estudantil.backend.entity;

import com.moeda_estudantil.backend.entity.Usuario;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Aluno extends Usuario {

    private String matricula;
    private String rg;
}

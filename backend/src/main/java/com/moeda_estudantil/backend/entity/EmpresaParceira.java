package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import com.moeda_estudantil.backend.entity.Usuario;

import lombok.*;

@Getter
@Setter
@Entity

public class EmpresaParceira extends Usuario {

    private String cnpj;
    private String nomeFantasia;
}
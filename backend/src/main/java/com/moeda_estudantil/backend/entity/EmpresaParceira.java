package com.moeda_estudantil.backend.entity;

import jakarta.persistence.*;
import com.moeda_estudantil.backend.entity.Usuario;
import lombok.Data;

@Entity
@Data
public class EmpresaParceira extends Usuario {

    private String cnpj;
    private String nomeFantasia;
}
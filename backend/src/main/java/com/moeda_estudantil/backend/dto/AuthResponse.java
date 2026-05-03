package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.enums.TipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String nome;
    private String email;
    private TipoUsuario tipo;
}
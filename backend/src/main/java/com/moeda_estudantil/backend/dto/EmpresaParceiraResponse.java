package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.EmpresaParceira;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaParceiraResponse {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String cnpj;
    private String nomeFantasia;

    public static EmpresaParceiraResponse fromEntity(EmpresaParceira empresa) {
        return EmpresaParceiraResponse.builder()
                .id(empresa.getId())
                .nome(empresa.getNome())
                .email(empresa.getEmail())
                .cpf(empresa.getCpf())
                .cnpj(empresa.getCnpj())
                .nomeFantasia(empresa.getNomeFantasia())
                .build();
    }
}
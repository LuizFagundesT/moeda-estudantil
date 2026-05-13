package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Resgate;
import com.moeda_estudantil.backend.enums.StatusResgate;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ResgateResponse {
    private Long id;
    private String codigoCupom;
    private LocalDateTime dataResgate;
    private StatusResgate status;
    private Integer custoMoedas;

    private Long alunoId;
    private String alunoNome;
    private String alunoEmail;

    private Long empresaId;
    private String empresaNomeFantasia;

    private Long vantagemId;
    private String vantagemTitulo;
    private String vantagemFotoUrl;
    private String vantagemDescricao;

    public static ResgateResponse fromEntity(Resgate resgate) {
        return ResgateResponse.builder()
                .id(resgate.getId())
                .codigoCupom(resgate.getCodigoCupom())
                .dataResgate(resgate.getDataResgate())
                .status(resgate.getStatus())
                .custoMoedas(resgate.getCustoMoedas())
                .alunoId(resgate.getAluno().getId())
                .alunoNome(resgate.getAluno().getNome())
                .alunoEmail(resgate.getAluno().getEmail())
                .empresaId(resgate.getEmpresaParceira().getId())
                .empresaNomeFantasia(resgate.getEmpresaParceira().getNomeFantasia())
                .vantagemId(resgate.getVantagem().getId())
                .vantagemTitulo(resgate.getVantagem().getTitulo())
                .vantagemFotoUrl(resgate.getVantagem().getFotoUrl())
                .vantagemDescricao(resgate.getVantagem().getDescricao())
                .build();
    }
}

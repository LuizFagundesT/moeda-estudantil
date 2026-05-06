package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Vantagem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VantagemResponse {

    private Long id;
    private String titulo;
    private String descricao;
    private Integer custoMoedas;
    private String fotoUrl;
    private Integer quantidadeDisponivel;
    private Boolean ativa;
    private Long empresaId;
    private String empresaNomeFantasia;

    public static VantagemResponse fromEntity(Vantagem vantagem) {
        return VantagemResponse.builder()
                .id(vantagem.getId())
                .titulo(vantagem.getTitulo())
                .descricao(vantagem.getDescricao())
                .custoMoedas(vantagem.getCustoMoedas())
                .fotoUrl(vantagem.getFotoUrl())
                .quantidadeDisponivel(vantagem.getQuantidadeDisponivel())
                .ativa(vantagem.getAtiva())
                .empresaId(vantagem.getEmpresaParceira().getId())
                .empresaNomeFantasia(vantagem.getEmpresaParceira().getNomeFantasia())
                .build();
    }
}

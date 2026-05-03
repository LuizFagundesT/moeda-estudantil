package com.moeda_estudantil.backend.dto;

import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.Endereco;
import lombok.Getter;

@Getter
public class AlunoResponse {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String matricula;
    private String curso;
    private String instituicao;
    private Double saldoMoedas;
    private Endereco endereco;

    public AlunoResponse(Aluno aluno) {
        this.id          = aluno.getId();
        this.nome        = aluno.getNome();
        this.email       = aluno.getEmail();
        this.cpf         = aluno.getCpf();
        this.rg          = aluno.getRg();
        this.matricula   = aluno.getMatricula();
        this.curso       = aluno.getCurso();
        this.instituicao = aluno.getInstituicao();
        this.saldoMoedas = aluno.getSaldoMoedas();
        this.endereco    = aluno.getEndereco();
    }
}
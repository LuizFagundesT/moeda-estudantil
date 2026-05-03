package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.AlunoResponse;
import com.moeda_estudantil.backend.dto.UpdateAlunoRequest;
import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    // ── READ ALL ──
    public List<AlunoResponse> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(AlunoResponse::new)
                .toList();
    }

    // ── READ BY ID ──
    public AlunoResponse buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id));
        return new AlunoResponse(aluno);
    }

    // ── UPDATE ──
    public AlunoResponse atualizar(Long id, UpdateAlunoRequest dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id));

        if (dto.getNome()        != null) aluno.setNome(dto.getNome());
        if (dto.getCpf()         != null) aluno.setCpf(dto.getCpf());
        if (dto.getRg()          != null) aluno.setRg(dto.getRg());
        if (dto.getMatricula()   != null) aluno.setMatricula(dto.getMatricula());
        if (dto.getCurso()       != null) aluno.setCurso(dto.getCurso());
        if (dto.getInstituicao() != null) aluno.setInstituicao(dto.getInstituicao());
        if (dto.getEndereco()    != null) aluno.setEndereco(dto.getEndereco());

        return new AlunoResponse(alunoRepository.save(aluno));
    }

    // ── DELETE ──
    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado: " + id);
        }
        alunoRepository.deleteById(id);
    }
}
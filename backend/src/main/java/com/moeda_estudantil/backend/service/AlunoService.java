package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.AlunoResponse;
import com.moeda_estudantil.backend.dto.RegisterAlunoRequest;
import com.moeda_estudantil.backend.dto.UpdateAlunoRequest;
import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.Transacao;
import com.moeda_estudantil.backend.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@RequiredArgsConstructor
@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TransacaoService transacaoService;

    public List<AlunoResponse> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(AlunoResponse::new)
                .toList();
    }

    public List<Transacao> extrato(Long alunoId) {
        return transacaoService.listarExtrato(alunoId);
    }

    public AlunoResponse buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id));
        return new AlunoResponse(aluno);
    }

    public AlunoResponse atualizar(Long id, UpdateAlunoRequest dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id));
        if (dto.getNome() != null)
            aluno.setNome(dto.getNome());
        if (dto.getCurso() != null)
            aluno.setCurso(dto.getCurso());
        if (dto.getEndereco() != null)
            aluno.setEndereco(dto.getEndereco());
        return new AlunoResponse(alunoRepository.save(aluno));
    }

    public AlunoResponse cadastrar(RegisterAlunoRequest dto) {
        if (alunoRepository.existsByCpf(dto.getCpf()))
            throw new RuntimeException("CPF já cadastrado");
        if (alunoRepository.existsByEmail(dto.getEmail()))
            throw new RuntimeException("Email já cadastrado");

        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setCpf(dto.getCpf());
        aluno.setRg(dto.getRg());
        aluno.setMatricula(dto.getMatricula());
        aluno.setCurso(dto.getCurso());
        aluno.setInstituicao(dto.getInstituicao());
        aluno.setEndereco(dto.getEndereco());
        aluno.setSaldoMoedas(0.0);
        alunoRepository.save(aluno);
        return new AlunoResponse(aluno);
    }

    public void deletar(Long id) {
        if (!alunoRepository.existsById(id))
            throw new RuntimeException("Aluno não encontrado: " + id);
        alunoRepository.deleteById(id);
    }

    public void adicionarMoedas(Long alunoId, Double valor, String motivo) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        transacaoService.registrarEntrada(aluno, valor, motivo);
        alunoRepository.save(aluno);
    }

    public void resgatarMoedas(Long alunoId, Double valor, String descricao) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        transacaoService.registrarSaida(aluno, valor, descricao);
        alunoRepository.save(aluno);
    }
}
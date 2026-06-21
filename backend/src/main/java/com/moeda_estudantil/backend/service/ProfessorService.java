// 🔍 Code Review por Caio Lima — ver comentários no Pull Request

package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.*;
import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.Professor;
import com.moeda_estudantil.backend.repository.AlunoRepository;
import com.moeda_estudantil.backend.repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final TransacaoService transacaoService;

    public List<ProfessorDTO> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProfessorDTO buscarPorId(Long id) {
        return toDTO(buscarEntidadePorId(id));
    }

    @Transactional
    public ProfessorDTO atualizar(Long id, ProfessorUpdateRequestDTO dto) {
        Professor professor = buscarEntidadePorId(id);

        if (!professor.getEmail().equals(dto.getEmail()) &&
                professorRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado para outro professor.");
        }

        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
        professor.setCpf(dto.getCpf());
        professor.setDepartamento(dto.getDepartamento());
        professor.setUniversidade(dto.getUniversidade());

        if (dto.getEndereco() != null) {
            professor.setEndereco(dto.getEndereco());
        }

        return toDTO(professorRepository.save(professor));
    }

    @Transactional
    public void deletar(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new EntityNotFoundException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }

    @Transactional
    public void enviarMoedas(Long professorId, EnviarMoedasRequestDTO dto) {
        Professor professor = buscarEntidadePorId(professorId);
        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Aluno não encontrado com id: " + dto.getAlunoId()));

        if (professor.getSaldoMoedas() < dto.getQuantidade()) {
            throw new IllegalStateException(
                    "Saldo insuficiente. Saldo atual: " + professor.getSaldoMoedas() + " moedas.");
        }

        //  Apenas debita do professor aqui
        professor.setSaldoMoedas(professor.getSaldoMoedas() - dto.getQuantidade());
        professorRepository.save(professor);

        //  O crédito no aluno e o registro das transações ficam só no TransacaoService
        transacaoService.registrarEnvio(professor, aluno, dto.getQuantidade(), dto.getMotivo());
    }

    public Double saldo(Long professorId) {
        return buscarEntidadePorId(professorId).getSaldoMoedas();
    }

    public List<TransacaoResponse> extrato(Long professorId) {
        buscarEntidadePorId(professorId);
        return transacaoService.listarExtratoProfessor(professorId)
                .stream()
                .map(TransacaoResponse::new)
                .collect(Collectors.toList());
    }

    private Professor buscarEntidadePorId(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Professor não encontrado com id: " + id));
    }

    private ProfessorDTO toDTO(Professor p) {
        ProfessorDTO dto = new ProfessorDTO();
        dto.setId(p.getId());
        dto.setNome(p.getNome());
        dto.setEmail(p.getEmail());
        dto.setCpf(p.getCpf());
        dto.setDepartamento(p.getDepartamento());
        dto.setUniversidade(p.getUniversidade());
        dto.setSaldoMoedas(p.getSaldoMoedas());
        dto.setTipo(p.getTipo());
        dto.setEndereco(p.getEndereco());
        return dto;
    }
}
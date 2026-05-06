package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.CreateVantagemRequest;
import com.moeda_estudantil.backend.dto.UpdateVantagemRequest;
import com.moeda_estudantil.backend.dto.VantagemResponse;
import com.moeda_estudantil.backend.entity.EmpresaParceira;
import com.moeda_estudantil.backend.entity.Vantagem;
import com.moeda_estudantil.backend.repository.EmpresaParceiraRepository;
import com.moeda_estudantil.backend.repository.VantagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;

    public VantagemService(VantagemRepository vantagemRepository,
                           EmpresaParceiraRepository empresaRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
    }

    public List<VantagemResponse> listarTodas() {
        return vantagemRepository.findAll()
                .stream()
                .map(VantagemResponse::fromEntity)
                .toList();
    }

    public List<VantagemResponse> listarAtivas() {
        return vantagemRepository.findByAtivaTrueOrderByIdDesc()
                .stream()
                .map(VantagemResponse::fromEntity)
                .toList();
    }

    public List<VantagemResponse> listarPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaParceiraIdOrderByIdDesc(empresaId)
                .stream()
                .map(VantagemResponse::fromEntity)
                .toList();
    }

    public VantagemResponse buscarPorId(Long id) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada: " + id));
        return VantagemResponse.fromEntity(vantagem);
    }

    public VantagemResponse criar(Long empresaId, CreateVantagemRequest dto) {
        EmpresaParceira empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada: " + empresaId));

        validarCamposObrigatorios(dto.getTitulo(), dto.getDescricao(), dto.getCustoMoedas());

        Vantagem vantagem = new Vantagem();
        vantagem.setTitulo(dto.getTitulo());
        vantagem.setDescricao(dto.getDescricao());
        vantagem.setCustoMoedas(dto.getCustoMoedas());
        vantagem.setFotoUrl(dto.getFotoUrl());
        vantagem.setQuantidadeDisponivel(dto.getQuantidadeDisponivel());
        vantagem.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true);
        vantagem.setEmpresaParceira(empresa);

        return VantagemResponse.fromEntity(vantagemRepository.save(vantagem));
    }

    public VantagemResponse atualizar(Long id, UpdateVantagemRequest dto) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada: " + id));

        if (dto.getTitulo() != null) vantagem.setTitulo(dto.getTitulo());
        if (dto.getDescricao() != null) vantagem.setDescricao(dto.getDescricao());
        if (dto.getCustoMoedas() != null) vantagem.setCustoMoedas(dto.getCustoMoedas());
        if (dto.getFotoUrl() != null) vantagem.setFotoUrl(dto.getFotoUrl());
        if (dto.getQuantidadeDisponivel() != null) vantagem.setQuantidadeDisponivel(dto.getQuantidadeDisponivel());
        if (dto.getAtiva() != null) vantagem.setAtiva(dto.getAtiva());

        validarCamposObrigatorios(vantagem.getTitulo(), vantagem.getDescricao(), vantagem.getCustoMoedas());

        return VantagemResponse.fromEntity(vantagemRepository.save(vantagem));
    }

    public void deletar(Long id) {
        if (!vantagemRepository.existsById(id)) {
            throw new RuntimeException("Vantagem não encontrada: " + id);
        }
        vantagemRepository.deleteById(id);
    }

    private void validarCamposObrigatorios(String titulo, String descricao, Integer custoMoedas) {
        if (titulo == null || titulo.isBlank()) {
            throw new RuntimeException("Título da vantagem é obrigatório.");
        }
        if (descricao == null || descricao.isBlank()) {
            throw new RuntimeException("Descrição da vantagem é obrigatória.");
        }
        if (custoMoedas == null || custoMoedas <= 0) {
            throw new RuntimeException("Custo em moedas deve ser maior que zero.");
        }
    }
}

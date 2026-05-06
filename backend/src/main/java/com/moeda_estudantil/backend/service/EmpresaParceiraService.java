package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.EmpresaParceiraResponse;
import com.moeda_estudantil.backend.dto.UpdateEmpresaParceiraRequest;
import com.moeda_estudantil.backend.dto.CreateEmpresaRequest;
import com.moeda_estudantil.backend.entity.EmpresaParceira;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import com.moeda_estudantil.backend.repository.EmpresaParceiraRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository repository;
    private final PasswordEncoder passwordEncoder;
    public EmpresaParceiraService(EmpresaParceiraRepository repository,
                                   PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<EmpresaParceiraResponse> listarTodos() {
        return repository.findAll()
                .stream()
                .map(EmpresaParceiraResponse::fromEntity)
                .toList();
    }

    public EmpresaParceiraResponse buscarPorId(Long id) {
        EmpresaParceira empresa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada: " + id));

        return EmpresaParceiraResponse.fromEntity(empresa);
    }

    public EmpresaParceiraResponse atualizar(Long id, UpdateEmpresaParceiraRequest dto) {
        EmpresaParceira empresa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada: " + id));

        if (dto.getNome() != null)
            empresa.setNome(dto.getNome());
        if (dto.getEmail() != null)
            empresa.setEmail(dto.getEmail());
        if (dto.getCpf() != null)
            empresa.setCpf(dto.getCpf());
        if (dto.getCnpj() != null)
            empresa.setCnpj(dto.getCnpj());
        if (dto.getNomeFantasia() != null)
            empresa.setNomeFantasia(dto.getNomeFantasia());
        if (dto.getEndereco() != null)
            empresa.setEndereco(dto.getEndereco());

        return EmpresaParceiraResponse.fromEntity(repository.save(empresa));
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Empresa não encontrada: " + id);
        }
        repository.deleteById(id);
    }

    public EmpresaParceiraResponse criar(CreateEmpresaRequest dto) {
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(dto.getNome());
        empresa.setEmail(dto.getEmail());
        empresa.setSenha(passwordEncoder.encode(dto.getSenha())); 
        empresa.setCpf(dto.getCpf());
        empresa.setCnpj(dto.getCnpj());
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setEndereco(dto.getEndereco());
        empresa.setTipo(TipoUsuario.EMPRESA_PARCEIRA);
        return EmpresaParceiraResponse.fromEntity(repository.save(empresa));
    }
}
package com.moeda_estudantil.backend.repository;

import com.moeda_estudantil.backend.entity.Resgate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResgateRepository extends JpaRepository<Resgate, Long> {
    List<Resgate> findByEmpresaParceiraIdOrderByDataResgateDesc(Long empresaId);
    List<Resgate> findByAlunoIdOrderByDataResgateDesc(Long alunoId);
    Optional<Resgate> findByCodigoCupom(String codigoCupom);
}

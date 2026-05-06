package com.moeda_estudantil.backend.repository;

import com.moeda_estudantil.backend.entity.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

    List<Vantagem> findByEmpresaParceiraIdOrderByIdDesc(Long empresaId);

    List<Vantagem> findByAtivaTrueOrderByIdDesc();
}

package com.moeda_estudantil.backend.repository;

import com.moeda_estudantil.backend.entity.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    List<Transacao> findByAlunoIdOrderByDataDesc(Long alunoId);
}
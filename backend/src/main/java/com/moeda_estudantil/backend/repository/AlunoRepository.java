package com.moeda_estudantil.backend.repository;

import com.moeda_estudantil.backend.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}
package com.moeda_estudantil.backend.controller;

import com.moeda_estudantil.backend.dto.*;
import com.moeda_estudantil.backend.service.ProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    // ─── GET /professores ─────────────────────────────────────────────────────
    // Lista todos os professores cadastrados
    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }

    // ─── GET /professores/{id} ────────────────────────────────────────────────
    // Retorna um professor específico
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    // ─── PUT /professores/{id} ────────────────────────────────────────────────
    // Atualiza dados do professor (professores não são criados via API)
    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProfessorUpdateRequestDTO dto) {
        return ResponseEntity.ok(professorService.atualizar(id, dto));
    }

    // ─── DELETE /professores/{id} ─────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        professorService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ─── POST /professores/{id}/enviar-moedas ─────────────────────────────────
    // Professor envia moedas para um aluno com motivo obrigatório
    @PostMapping("/{id}/enviar-moedas")
    public ResponseEntity<Void> enviarMoedas(
            @PathVariable Long id,
            @Valid @RequestBody EnviarMoedasRequestDTO dto) {
        professorService.enviarMoedas(id, dto);
        return ResponseEntity.ok().build();
    }

    // ─── GET /professores/{id}/saldo ──────────────────────────────────────────
    // Consulta o saldo de moedas do professor
    @GetMapping("/{id}/saldo")
    public ResponseEntity<Double> saldo(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.saldo(id));
    }

    // ─── GET /professores/{id}/extrato ───────────────────────────────────────
    // Extrato de envios realizados pelo professor
    @GetMapping("/{id}/extrato")
    public ResponseEntity<List<TransacaoResponse>> extrato(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.extrato(id));
    }
}
package com.moeda_estudantil.backend.controller;

import com.moeda_estudantil.backend.dto.ResgateResponse;
import com.moeda_estudantil.backend.enums.StatusResgate;
import com.moeda_estudantil.backend.service.ResgateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resgates")
@RequiredArgsConstructor
public class ResgateController {

    private final ResgateService resgateService;

    @PostMapping("/aluno/{alunoId}/vantagem/{vantagemId}")
    public ResponseEntity<ResgateResponse> resgatar(
            @PathVariable Long alunoId,
            @PathVariable Long vantagemId) {
        return ResponseEntity.ok(resgateService.resgatar(alunoId, vantagemId));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ResgateResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(resgateService.listarPorEmpresa(empresaId));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<ResgateResponse>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(resgateService.listarPorAluno(alunoId));
    }

    @GetMapping("/empresa/codigo/{codigoCupom}")
    public ResponseEntity<ResgateResponse> buscarPorCodigoParaEmpresa(
            @PathVariable String codigoCupom,
            Authentication authentication) {
        return ResponseEntity.ok(resgateService.buscarPorCodigoParaEmpresa(codigoCupom, authentication.getName()));
    }

    @PatchMapping("/empresa/codigo/{codigoCupom}/utilizar")
    public ResponseEntity<ResgateResponse> confirmarUsoPorCodigo(
            @PathVariable String codigoCupom,
            Authentication authentication) {
        return ResponseEntity.ok(resgateService.confirmarUsoPorCodigo(codigoCupom, authentication.getName()));
    }

    @PatchMapping("/{resgateId}/status/{status}")
    public ResponseEntity<ResgateResponse> atualizarStatus(
            @PathVariable Long resgateId,
            @PathVariable StatusResgate status) {
        return ResponseEntity.ok(resgateService.atualizarStatus(resgateId, status));
    }
}

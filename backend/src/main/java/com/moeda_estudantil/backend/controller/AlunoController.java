package com.moeda_estudantil.backend.controller;

import com.moeda_estudantil.backend.dto.AlunoResponse;
import com.moeda_estudantil.backend.dto.UpdateAlunoRequest;
import com.moeda_estudantil.backend.service.AlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@CrossOrigin("*")
public class AlunoController {

    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    // GET /alunos
    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    // GET /alunos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    // PUT /alunos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizar(
            @PathVariable Long id,
            @RequestBody UpdateAlunoRequest dto) {
        return ResponseEntity.ok(alunoService.atualizar(id, dto));
    }

    // DELETE /alunos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
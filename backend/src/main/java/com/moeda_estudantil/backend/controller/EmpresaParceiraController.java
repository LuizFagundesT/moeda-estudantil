package com.moeda_estudantil.backend.controller;

import com.moeda_estudantil.backend.dto.EmpresaParceiraResponse;
import com.moeda_estudantil.backend.dto.UpdateEmpresaParceiraRequest;
import com.moeda_estudantil.backend.service.EmpresaParceiraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.moeda_estudantil.backend.dto.CreateEmpresaRequest;

import java.util.List;

@RestController
@RequestMapping("/empresas")

public class EmpresaParceiraController {

    private final EmpresaParceiraService service;

    public EmpresaParceiraController(EmpresaParceiraService service) {
        this.service = service;
    }

    // GET /empresas
    @GetMapping
    public ResponseEntity<List<EmpresaParceiraResponse>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // GET /empresas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // PUT /empresas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EmpresaParceiraResponse> atualizar(
            @PathVariable Long id,
            @RequestBody UpdateEmpresaParceiraRequest dto) {

        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    // DELETE /empresas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponse> criar(
            @RequestBody CreateEmpresaRequest dto) {

        return ResponseEntity.ok(service.criar(dto));
    }
}
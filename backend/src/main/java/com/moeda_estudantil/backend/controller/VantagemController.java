package com.moeda_estudantil.backend.controller;

import com.moeda_estudantil.backend.dto.CreateVantagemRequest;
import com.moeda_estudantil.backend.dto.UpdateVantagemRequest;
import com.moeda_estudantil.backend.dto.VantagemResponse;
import com.moeda_estudantil.backend.service.VantagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vantagens")
public class VantagemController {

    private final VantagemService service;

    public VantagemController(VantagemService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<VantagemResponse>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<VantagemResponse>> listarAtivas() {
        return ResponseEntity.ok(service.listarAtivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<VantagemResponse>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(service.listarPorEmpresa(empresaId));
    }

    @PostMapping("/empresa/{empresaId}")
    public ResponseEntity<VantagemResponse> criar(
            @PathVariable Long empresaId,
            @RequestBody CreateVantagemRequest dto) {
        return ResponseEntity.ok(service.criar(empresaId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VantagemResponse> atualizar(
            @PathVariable Long id,
            @RequestBody UpdateVantagemRequest dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

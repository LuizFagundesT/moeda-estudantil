package com.moeda_estudantil.backend.auth;

import com.moeda_estudantil.backend.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register/aluno")
    public ResponseEntity<Void> registerAluno(
            @RequestBody RegisterAlunoRequest dto) {
        service.registerAluno(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register/professor")
    public ResponseEntity<Void> registerProfessor(
            @RequestBody RegisterProfessorRequest dto) {
        service.registerProfessor(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register/empresa")
    public ResponseEntity<Void> registerEmpresa(
            @RequestBody RegisterEmpresaRequest dto) {
        service.registerEmpresa(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest dto) {
        return ResponseEntity.ok(service.login(dto));
    }
}
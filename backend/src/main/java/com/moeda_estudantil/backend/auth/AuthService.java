package com.moeda_estudantil.backend.auth;

import com.moeda_estudantil.backend.dto.*;
import com.moeda_estudantil.backend.entity.*;
import com.moeda_estudantil.backend.enums.TipoUsuario;
import com.moeda_estudantil.backend.repository.UsuarioRepository;
import com.moeda_estudantil.backend.security.JwtService;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository repository,
            PasswordEncoder encoder,
            JwtService jwtService) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public void registerAluno(RegisterAlunoRequest dto) {
           // Verifica se email já existe
    if (repository.findByEmail(dto.getEmail()).isPresent()) {
        throw new RuntimeException("Email já cadastrado.");
    }
        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(encoder.encode(dto.getSenha()));
        aluno.setCpf(dto.getCpf());
        aluno.setMatricula(dto.getMatricula());
        aluno.setRg(dto.getRg());
        aluno.setCurso(dto.getCurso());
        aluno.setInstituicao(dto.getInstituicao());
        aluno.setSaldoMoedas(0.0);
        aluno.setEndereco(dto.getEndereco());
        aluno.setTipo(TipoUsuario.ALUNO);
        repository.save(aluno);
    }

    public void registerProfessor(RegisterProfessorRequest dto) {
        Professor professor = new Professor();
        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
        professor.setSenha(encoder.encode(dto.getSenha()));
        professor.setCpf(dto.getCpf());
        professor.setDepartamento(dto.getDepartamento());
        professor.setEndereco(dto.getEndereco());
        professor.setTipo(TipoUsuario.PROFESSOR);
        repository.save(professor);
    }

    public void registerEmpresa(RegisterEmpresaRequest dto) {
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(dto.getNome());
        empresa.setEmail(dto.getEmail());
        empresa.setSenha(encoder.encode(dto.getSenha()));
        empresa.setCnpj(dto.getCnpj());
        empresa.setNomeFantasia(dto.getNomeFantasia());
        empresa.setEndereco(dto.getEndereco());
        empresa.setTipo(TipoUsuario.EMPRESA_PARCEIRA);
        repository.save(empresa);
    }

    public AuthResponse login(LoginRequest dto) {

        Usuario user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!encoder.matches(dto.getSenha(), user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, user.getNome(), user.getEmail(), user.getTipo());
    }
}
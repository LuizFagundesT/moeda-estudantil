package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.dto.ResgateResponse;
import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.Resgate;
import com.moeda_estudantil.backend.entity.Vantagem;
import com.moeda_estudantil.backend.enums.StatusResgate;
import com.moeda_estudantil.backend.repository.AlunoRepository;
import com.moeda_estudantil.backend.repository.ResgateRepository;
import com.moeda_estudantil.backend.repository.VantagemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResgateService {

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ResgateRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoService transacaoService;

    @Transactional
    public ResgateResponse resgatar(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + alunoId));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada: " + vantagemId));

        if (!Boolean.TRUE.equals(vantagem.getAtiva())) {
            throw new RuntimeException("Esta vantagem está inativa.");
        }

        Integer quantidade = vantagem.getQuantidadeDisponivel();
        if (quantidade != null && quantidade <= 0) {
            throw new RuntimeException("Esta vantagem está esgotada.");
        }

        double custo = vantagem.getCustoMoedas().doubleValue();
        if (aluno.getSaldoMoedas() == null || aluno.getSaldoMoedas() < custo) {
            throw new RuntimeException("Saldo insuficiente para resgatar esta vantagem.");
        }

        transacaoService.registrarSaida(
                aluno,
                custo,
                "Resgate da vantagem: " + vantagem.getTitulo()
        );

        if (quantidade != null) {
            vantagem.setQuantidadeDisponivel(quantidade - 1);
            vantagemRepository.save(vantagem);
        }

        alunoRepository.save(aluno);

        Resgate resgate = new Resgate();
        resgate.setAluno(aluno);
        resgate.setEmpresaParceira(vantagem.getEmpresaParceira());
        resgate.setVantagem(vantagem);
        resgate.setCustoMoedas(vantagem.getCustoMoedas());
        resgate.setDataResgate(LocalDateTime.now());
        resgate.setStatus(StatusResgate.GERADO);
        resgate.setCodigoCupom(gerarCodigoUnico());

        return ResgateResponse.fromEntity(resgateRepository.save(resgate));
    }

    @Transactional
    public List<ResgateResponse> listarPorEmpresa(Long empresaId) {
        return resgateRepository.findByEmpresaParceiraIdOrderByDataResgateDesc(empresaId)
                .stream()
                .map(ResgateResponse::fromEntity)
                .toList();
    }

    @Transactional
    public List<ResgateResponse> listarPorAluno(Long alunoId) {
        return resgateRepository.findByAlunoIdOrderByDataResgateDesc(alunoId)
                .stream()
                .map(ResgateResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ResgateResponse atualizarStatus(Long resgateId, StatusResgate status) {
        Resgate resgate = resgateRepository.findById(resgateId)
                .orElseThrow(() -> new RuntimeException("Resgate não encontrado: " + resgateId));
        resgate.setStatus(status);
        return ResgateResponse.fromEntity(resgateRepository.save(resgate));
    }

    private String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = "KRN-" + gerarBloco(4) + "-" + gerarBloco(4);
        } while (resgateRepository.findByCodigoCupom(codigo).isPresent());
        return codigo;
    }

    private String gerarBloco(int tamanho) {
        StringBuilder sb = new StringBuilder(tamanho);
        for (int i = 0; i < tamanho; i++) {
            sb.append(CHARS.charAt(RANDOM.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}

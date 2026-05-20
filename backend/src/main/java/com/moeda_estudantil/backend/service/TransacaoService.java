package com.moeda_estudantil.backend.service;

import com.moeda_estudantil.backend.entity.Aluno;
import com.moeda_estudantil.backend.entity.Professor;
import com.moeda_estudantil.backend.entity.Transacao;
import com.moeda_estudantil.backend.enums.TipoTransacao;
import com.moeda_estudantil.backend.messaging.EmailEventoProducer;
import com.moeda_estudantil.backend.repository.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final EmailEventoProducer emailEventoProducer;

    public void registrarEntrada(Aluno aluno, Double valor, String descricao) {
        Transacao t = new Transacao();
        t.setAluno(aluno);
        t.setValor(valor);
        t.setTipo(TipoTransacao.ENTRADA);
        t.setDescricao(descricao);
        t.setData(LocalDateTime.now());

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + valor);

        transacaoRepository.save(t);
    }

    public void registrarSaida(Aluno aluno, Double valor, String descricao) {
        if (aluno.getSaldoMoedas() < valor) {
            throw new RuntimeException("Saldo insuficiente");
        }

        Transacao t = new Transacao();
        t.setAluno(aluno);
        t.setValor(valor);
        t.setTipo(TipoTransacao.SAIDA);
        t.setDescricao(descricao);
        t.setData(LocalDateTime.now());

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - valor);

        transacaoRepository.save(t);
    }

    public void registrarEnvio(Professor professor, Aluno aluno, Double valor, String motivo) {

        // Transação de SAÍDA — pertence ao professor (não ao aluno)
        Transacao saida = new Transacao();
        saida.setProfessor(professor);
        saida.setAluno(null); 
        saida.setValor(valor);
        saida.setTipo(TipoTransacao.SAIDA);
        saida.setDescricao("Enviado para " + aluno.getNome() + ": " + motivo);
        saida.setData(LocalDateTime.now());
        transacaoRepository.save(saida);

        // Transação de ENTRADA — pertence ao aluno
        Transacao entrada = new Transacao();
        entrada.setProfessor(professor);
        entrada.setAluno(aluno); // só a entrada aparece no extrato do aluno
        entrada.setValor(valor);
        entrada.setTipo(TipoTransacao.ENTRADA);
        entrada.setDescricao("Recebido de Prof. " + professor.getNome() + ": " + motivo);
        entrada.setData(LocalDateTime.now());

        // Atualiza o saldo do aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + valor);
        transacaoRepository.save(entrada);

        // Publica evento na fila para envio de e-mail e acionando o rabbit MQ
        emailEventoProducer.publicarEventoTransacao(entrada);
    }

    public List<Transacao> listarExtrato(Long alunoId) {
        return transacaoRepository.findByAlunoIdOrderByDataDesc(alunoId);
    }

    public List<Transacao> listarExtratoProfessor(Long professorId) {
        return transacaoRepository.findByProfessorIdOrderByDataDesc(professorId);
    }
}
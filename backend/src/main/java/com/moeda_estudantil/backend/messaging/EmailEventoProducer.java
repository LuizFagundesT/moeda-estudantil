package com.moeda_estudantil.backend.messaging;

import com.moeda_estudantil.backend.config.RabbitMQConfig;
import com.moeda_estudantil.backend.dto.ResgateEmailEventoDTO;
import com.moeda_estudantil.backend.dto.TransacaoEmailEventoDTO;
import com.moeda_estudantil.backend.entity.Resgate;
import com.moeda_estudantil.backend.entity.Transacao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailEventoProducer {

    private final RabbitTemplate rabbitTemplate;

    /**
     * Chamado após salvar uma Transacao de envio de moedas pelo professor.
     */
    public void publicarEventoTransacao(Transacao transacao) {
        var evento = new TransacaoEmailEventoDTO(
                transacao.getAluno().getNome(),
                transacao.getAluno().getEmail(),
                transacao.getProfessor().getNome(),
                transacao.getValor(),
                transacao.getDescricao(),
                transacao.getAluno().getSaldoMoedas()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_EMAIL_TRANSACAO, evento);
        log.info("Evento de transação publicado na fila para aluno: {}", evento.emailAluno());
    }

    /**
     * Chamado após salvar um Resgate de vantagem pelo aluno.
     */
    public void publicarEventoResgate(Resgate resgate) {
        var evento = new ResgateEmailEventoDTO(
                resgate.getAluno().getNome(),
                resgate.getAluno().getEmail(),
                resgate.getVantagem().getTitulo(),
                resgate.getEmpresaParceira().getNomeFantasia(),
                resgate.getCodigoCupom(),
                resgate.getCustoMoedas(),
                resgate.getAluno().getSaldoMoedas()
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.FILA_EMAIL_RESGATE, evento);
        log.info("Evento de resgate publicado na fila para aluno: {}", evento.emailAluno());
    }
}
package com.moeda_estudantil.backend.messaging;

import com.moeda_estudantil.backend.config.RabbitMQConfig;
import com.moeda_estudantil.backend.dto.ResgateEmailEventoDTO;
import com.moeda_estudantil.backend.dto.TransacaoEmailEventoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_TRANSACAO)
    public void processarEmailTransacao(TransacaoEmailEventoDTO evento) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(evento.emailAluno());
        mensagem.setSubject("Você recebeu moedas estudantis!");
        mensagem.setText("""
                Olá, %s!

                O professor %s enviou %.0f moedas para você.
                Motivo: %s
                Seu saldo atual: %.0f moedas
                """.formatted(
                evento.nomeAluno(),
                evento.nomeProfessor(),
                evento.quantidadeMoedas(),
                evento.descricao(),
                evento.novoSaldoAluno()
        ));
        mailSender.send(mensagem);
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_RESGATE)
    public void processarEmailResgate(ResgateEmailEventoDTO evento) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(evento.emailAluno());
        mensagem.setSubject("Resgate confirmado - " + evento.tituloVantagem());
        mensagem.setText("""
                Olá, %s!

                Seu resgate foi confirmado!
                Vantagem: %s
                Empresa: %s
                Moedas gastas: %d
                Saldo restante: %.0f moedas
                Cupom: %s
                """.formatted(
                evento.nomeAluno(),
                evento.tituloVantagem(),
                evento.nomeEmpresa(),
                evento.moedasGastas(),
                evento.saldoRestante(),
                evento.codigoCupom()
        ));
        mailSender.send(mensagem);
    }
}
package com.moeda_estudantil.backend.messaging;

import com.moeda_estudantil.backend.config.RabbitMQConfig;
import com.moeda_estudantil.backend.dto.ResgateEmailEventoDTO;
import com.moeda_estudantil.backend.dto.TransacaoEmailEventoDTO;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_TRANSACAO)
    public void processarEmailTransacao(TransacaoEmailEventoDTO evento) {

        try {

            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(evento.emailAluno());
            helper.setSubject("Você recebeu moedas estudantis!");

            String html = """
                    <html>
                    <body style="
                        margin:0;
                        padding:0;
                        background-color:#f4f6f9;
                        font-family:Arial, sans-serif;
                    ">
                    
                    <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" style="padding:40px 0;">
                    
                                <table width="600" cellpadding="0" cellspacing="0"
                                       style="
                                           background:#ffffff;
                                           border-radius:16px;
                                           padding:40px;
                                           box-shadow:0 4px 12px rgba(0,0,0,0.1);
                                       ">
                    
                                    <tr>
                                        <td align="center">
                                            <h1 style="color:#2563eb; margin-bottom:10px;">
                                                💰 Moedas Recebidas
                                            </h1>
                    
                                            <p style="font-size:16px; color:#444;">
                                                Olá, <strong>%s</strong>!
                                            </p>
                    
                                            <p style="font-size:16px; color:#444;">
                                                O professor <strong>%s</strong>
                                                enviou:
                                            </p>
                    
                                            <div style="
                                                background:#eff6ff;
                                                padding:20px;
                                                border-radius:12px;
                                                margin:30px 0;
                                            ">
                                                <span style="
                                                    font-size:32px;
                                                    font-weight:bold;
                                                    color:#2563eb;
                                                ">
                                                    %.0f moedas
                                                </span>
                                            </div>
                    
                                            <p style="font-size:15px; color:#555;">
                                                <strong>Motivo:</strong> %s
                                            </p>
                    
                                            <p style="font-size:15px; color:#555;">
                                                Seu saldo atual é:
                                            </p>
                    
                                            <h2 style="color:#16a34a;">
                                                %.0f moedas
                                            </h2>
                    
                                            <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">
                    
                                            <p style="font-size:12px; color:#999;">
                                                Sistema Moeda Estudantil
                                            </p>
                    
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    </body>
                    </html>
                    """.formatted(
                    evento.nomeAluno(),
                    evento.nomeProfessor(),
                    evento.quantidadeMoedas(),
                    evento.descricao(),
                    evento.novoSaldoAluno()
            );

            helper.setText(html, true);

            mailSender.send(mensagem);

            log.info("Email de transação enviado para {}", evento.emailAluno());

        } catch (Exception e) {
            log.error("Erro ao enviar email de transação", e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_RESGATE)
    public void processarEmailResgate(ResgateEmailEventoDTO evento) {

        try {

            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(evento.emailAluno());
            helper.setSubject("Resgate confirmado - " + evento.tituloVantagem());

            String html = """
                    <html>
                    <body style="
                        margin:0;
                        padding:0;
                        background-color:#f4f6f9;
                        font-family:Arial, sans-serif;
                    ">
                    
                    <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" style="padding:40px 0;">
                    
                                <table width="600" cellpadding="0" cellspacing="0"
                                       style="
                                           background:#ffffff;
                                           border-radius:16px;
                                           padding:40px;
                                           box-shadow:0 4px 12px rgba(0,0,0,0.1);
                                       ">
                    
                                    <tr>
                                        <td align="center">
                    
                                            <h1 style="color:#16a34a;">
                                                🎉 Resgate Confirmado
                                            </h1>
                    
                                            <p style="font-size:16px; color:#444;">
                                                Olá, <strong>%s</strong>!
                                            </p>
                    
                                            <p style="font-size:15px; color:#555;">
                                                Seu resgate foi realizado com sucesso.
                                            </p>
                    
                                            <div style="
                                                background:#f0fdf4;
                                                padding:25px;
                                                border-radius:12px;
                                                margin:30px 0;
                                                text-align:left;
                                            ">
                    
                                                <p><strong>🎁 Vantagem:</strong> %s</p>
                                                <p><strong>🏢 Empresa:</strong> %s</p>
                                                <p><strong>🪙 Moedas gastas:</strong> %d</p>
                                                <p><strong>💳 Saldo restante:</strong> %.0f moedas</p>
                    
                                            </div>
                    
                                            <div style="
                                                background:#2563eb;
                                                color:white;
                                                padding:20px;
                                                border-radius:12px;
                                                margin-top:20px;
                                            ">
                    
                                                <p style="margin:0; font-size:14px;">
                                                    Seu cupom
                                                </p>
                    
                                                <h2 style="
                                                    margin:10px 0 0 0;
                                                    letter-spacing:2px;
                                                ">
                                                    %s
                                                </h2>
                    
                                            </div>
                    
                                            <hr style="margin:30px 0; border:none; border-top:1px solid #eee;">
                    
                                            <p style="font-size:12px; color:#999;">
                                                Sistema Moeda Estudantil
                                            </p>
                    
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    
                    </body>
                    </html>
                    """.formatted(
                    evento.nomeAluno(),
                    evento.tituloVantagem(),
                    evento.nomeEmpresa(),
                    evento.moedasGastas(),
                    evento.saldoRestante(),
                    evento.codigoCupom()
            );

            helper.setText(html, true);

            mailSender.send(mensagem);

            log.info("Email de resgate enviado para {}", evento.emailAluno());

        } catch (Exception e) {
            log.error("Erro ao enviar email de resgate", e);
        }
    }
}
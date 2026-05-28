package com.moeda_estudantil.backend.messaging;

import com.moeda_estudantil.backend.config.RabbitMQConfig;
import com.moeda_estudantil.backend.dto.ResgateEmailEventoDTO;
import com.moeda_estudantil.backend.dto.TransacaoEmailEventoDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

import java.text.NumberFormat;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    // FIX: remetente configurável via application.properties (spring.mail.username)
    @Value("${spring.mail.username}")
    private String remetente;

    private static final Locale LOCALE_BR = new Locale("pt", "BR");

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_TRANSACAO)
    public void processarEmailTransacao(TransacaoEmailEventoDTO evento) {
        String assunto = "🏆 Você recebeu moedas estudantis!";

        String html = montarTemplateBase(
                "🏆 Conquista desbloqueada!",
                "Você recebeu moedas estudantis",
                """
                <p class="texto">
                    Olá, <strong>%s</strong>!
                </p>

                <p class="texto">
                    O professor <strong>%s</strong> acabou de reconhecer seu mérito e enviou uma premiação para você.
                </p>

                <div class="premio-card">
                    <div class="icone-premio">🪙</div>
                    <div>
                        <p class="label">Moedas recebidas</p>
                        <p class="valor">%s moedas</p>
                    </div>
                </div>

                <div class="info-box">
                    <p><strong>Motivo:</strong> %s</p>
                    <p><strong>Seu saldo atual:</strong> %s moedas</p>
                </div>

                <p class="mensagem-final">
                    Continue participando, se dedicando e acumulando conquistas. Cada moeda representa seu esforço! ✨
                </p>
                """.formatted(
                        escapar(evento.nomeAluno()),
                        escapar(evento.nomeProfessor()),
                        formatarMoedas(evento.quantidadeMoedas()),
                        escapar(evento.descricao()),
                        formatarMoedas(evento.novoSaldoAluno())
                )
        );

        enviarEmailHtml(evento.emailAluno(), assunto, html);
    }

    @RabbitListener(queues = RabbitMQConfig.FILA_EMAIL_RESGATE)
    public void processarEmailResgate(ResgateEmailEventoDTO evento) {
        String assunto = "🎁 Resgate confirmado - " + evento.tituloVantagem();

        String html = montarTemplateBase(
                "🎉 Resgate realizado com sucesso!",
                "Sua recompensa foi confirmada",
                """
                <p class="texto">
                    Olá, <strong>%s</strong>!
                </p>

                <p class="texto">
                    Parabéns! Seu resgate foi confirmado e sua vantagem já está disponível.
                </p>

                <div class="premio-card">
                    <div class="icone-premio">🎁</div>
                    <div>
                        <p class="label">Vantagem resgatada</p>
                        <p class="valor">%s</p>
                    </div>
                </div>

                <div class="info-box">
                    <p><strong>Empresa:</strong> %s</p>
                    <p><strong>Moedas gastas:</strong> %d</p>
                    <p><strong>Saldo restante:</strong> %s moedas</p>
                </div>

                <div class="cupom-box">
                    <p class="label-cupom">Seu cupom</p>
                    <p class="codigo-cupom">%s</p>
                </div>

                <p class="mensagem-final">
                    Aproveite sua recompensa! Essa conquista é resultado da sua dedicação. 🏅
                </p>
                """.formatted(
                        escapar(evento.nomeAluno()),
                        escapar(evento.tituloVantagem()),
                        escapar(evento.nomeEmpresa()),
                        evento.moedasGastas(),
                        formatarMoedas(evento.saldoRestante()),
                        escapar(evento.codigoCupom())
                )
        );

        enviarEmailHtml(evento.emailAluno(), assunto, html);
    }

    private void enviarEmailHtml(String destinatario, String assunto, String html) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mensagem,
                    true,   // FIX: multipart=true — necessário para HTML com encoding UTF-8 explícito
                    "UTF-8"
            );

            helper.setFrom(remetente); // FIX: remetente explícito evita rejeição por servidores SMTP
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(html, true);

            mailSender.send(mensagem);

            log.info("E-mail enviado com sucesso para {}", destinatario);
        } catch (MessagingException e) {
            log.error("Erro ao montar e-mail para {}", destinatario, e);
            throw new IllegalStateException("Erro ao montar e-mail HTML", e);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail para {}", destinatario, e);
            throw new IllegalStateException("Erro ao enviar e-mail", e);
        }
    }

    private String montarTemplateBase(String tituloTopo, String subtitulo, String conteudo) {
        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f6fb;
                            font-family: Arial, Helvetica, sans-serif;
                            color: #1f2937;
                        }

                        .container {
                            max-width: 620px;
                            margin: 0 auto;
                            padding: 32px 16px;
                        }

                        .card {
                            background-color: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
                            border: 1px solid #e5e7eb;
                        }

                        .header {
                            background: linear-gradient(135deg, #2563eb, #7c3aed);
                            color: #ffffff;
                            text-align: center;
                            padding: 36px 24px;
                        }

                        .trofeu {
                            font-size: 48px;
                            margin-bottom: 12px;
                        }

                        .titulo-topo {
                            margin: 0;
                            font-size: 26px;
                            font-weight: 800;
                        }

                        .subtitulo {
                            margin: 8px 0 0;
                            font-size: 16px;
                            opacity: 0.95;
                        }

                        .content {
                            padding: 32px 28px;
                        }

                        .texto {
                            font-size: 16px;
                            line-height: 1.6;
                            margin: 0 0 18px;
                        }

                        .premio-card {
                            display: flex;
                            align-items: center;
                            gap: 18px;
                            background: linear-gradient(135deg, #fff7ed, #fef3c7);
                            border: 1px solid #facc15;
                            border-radius: 16px;
                            padding: 22px;
                            margin: 24px 0;
                        }

                        .icone-premio {
                            font-size: 42px;
                            width: 64px;
                            height: 64px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #ffffff;
                            border-radius: 50%;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                        }

                        .label {
                            margin: 0;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 0.08em;
                            color: #92400e;
                            font-weight: 700;
                        }

                        .valor {
                            margin: 6px 0 0;
                            font-size: 24px;
                            font-weight: 800;
                            color: #78350f;
                        }

                        .info-box {
                            background-color: #f9fafb;
                            border: 1px solid #e5e7eb;
                            border-radius: 14px;
                            padding: 18px 20px;
                            margin: 22px 0;
                        }

                        .info-box p {
                            margin: 8px 0;
                            font-size: 15px;
                            line-height: 1.5;
                        }

                        .cupom-box {
                            text-align: center;
                            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                            border: 2px dashed #10b981;
                            border-radius: 16px;
                            padding: 22px;
                            margin: 26px 0;
                        }

                        .label-cupom {
                            margin: 0;
                            font-size: 13px;
                            color: #047857;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.08em;
                        }

                        .codigo-cupom {
                            margin: 10px 0 0;
                            font-size: 28px;
                            font-weight: 900;
                            color: #065f46;
                            letter-spacing: 0.12em;
                        }

                        .mensagem-final {
                            font-size: 15px;
                            line-height: 1.6;
                            color: #4b5563;
                            margin-top: 24px;
                        }

                        .footer {
                            text-align: center;
                            padding: 22px;
                            background-color: #f9fafb;
                            color: #6b7280;
                            font-size: 13px;
                            border-top: 1px solid #e5e7eb;
                        }

                        @media (max-width: 600px) {
                            .content {
                                padding: 26px 20px;
                            }

                            .titulo-topo {
                                font-size: 22px;
                            }

                            .premio-card {
                                display: block;
                                text-align: center;
                            }

                            .icone-premio {
                                margin: 0 auto 14px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="card">
                            <div class="header">
                                <div class="trofeu">🏆</div>
                                <h1 class="titulo-topo">%s</h1>
                                <p class="subtitulo">%s</p>
                            </div>

                            <div class="content">
                                %s
                            </div>

                            <div class="footer">
                                Moeda Estudantil • Reconhecendo esforço, participação e conquistas acadêmicas.
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                tituloTopo,
                subtitulo,
                conteudo
        );
    }

    private String escapar(String valor) {
        if (valor == null || valor.isBlank()) {
            return "-";
        }

        return HtmlUtils.htmlEscape(valor);
    }

    private String formatarMoedas(Number valor) {
        if (valor == null) {
            return "0";
        }

        NumberFormat formatador = NumberFormat.getNumberInstance(LOCALE_BR);
        formatador.setMaximumFractionDigits(0);
        formatador.setMinimumFractionDigits(0);

        return formatador.format(valor);
    }
}
package com.moeda_estudantil.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String FILA_EMAIL_TRANSACAO = "fila-email-transacao";
    public static final String FILA_EMAIL_RESGATE   = "fila-email-resgate";

    @Bean
    public Queue filaEmailTransacao() {
        return new Queue(FILA_EMAIL_TRANSACAO, true);
    }

    @Bean
    public Queue filaEmailResgate() {
        return new Queue(FILA_EMAIL_RESGATE, true);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
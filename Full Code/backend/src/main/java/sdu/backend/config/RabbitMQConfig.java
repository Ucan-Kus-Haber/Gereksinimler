package sdu.backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Queue names
    public static final String COMMENT_NOTIFICATION_QUEUE = "comment.notification.queue";
    public static final String COMMENT_MODERATION_QUEUE = "comment.moderation.queue";
    public static final String COMMENT_ANALYTICS_QUEUE = "comment.analytics.queue";

    // Exchange names
    public static final String COMMENT_EXCHANGE = "comment.exchange";

    // Routing keys
    public static final String COMMENT_NOTIFICATION_ROUTING_KEY = "comment.notification";
    public static final String COMMENT_MODERATION_ROUTING_KEY = "comment.moderation";
    public static final String COMMENT_ANALYTICS_ROUTING_KEY = "comment.analytics";

    @Bean
    public TopicExchange commentExchange() {
        return new TopicExchange(COMMENT_EXCHANGE);
    }

    @Bean
    public Queue commentNotificationQueue() {
        return QueueBuilder.durable(COMMENT_NOTIFICATION_QUEUE).build();
    }

    @Bean
    public Queue commentModerationQueue() {
        return QueueBuilder.durable(COMMENT_MODERATION_QUEUE).build();
    }

    @Bean
    public Queue commentAnalyticsQueue() {
        return QueueBuilder.durable(COMMENT_ANALYTICS_QUEUE).build();
    }

    @Bean
    public Binding commentNotificationBinding() {
        return BindingBuilder
                .bind(commentNotificationQueue())
                .to(commentExchange())
                .with(COMMENT_NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public Binding commentModerationBinding() {
        return BindingBuilder
                .bind(commentModerationQueue())
                .to(commentExchange())
                .with(COMMENT_MODERATION_ROUTING_KEY);
    }

    @Bean
    public Binding commentAnalyticsBinding() {
        return BindingBuilder
                .bind(commentAnalyticsQueue())
                .to(commentExchange())
                .with(COMMENT_ANALYTICS_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(jsonMessageConverter());
        return factory;
    }
}
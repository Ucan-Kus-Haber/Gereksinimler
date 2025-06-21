package sdu.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sdu.backend.config.RabbitMQConfig;
import sdu.backend.dto.CommentNotificationEvent;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = {"http://localhost:5173",
        "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174"})
@RequestMapping("/api/test")
public class RabbitMQTestController {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public RabbitMQTestController(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @GetMapping("/rabbitmq/status")
    public ResponseEntity<?> checkRabbitMQStatus() {
        try {
            // Test connection by getting queue info
            var queueInfo = rabbitTemplate.execute(channel -> {
                try {
                    // Check if queues exist
                    channel.queueDeclarePassive(RabbitMQConfig.COMMENT_NOTIFICATION_QUEUE);
                    channel.queueDeclarePassive(RabbitMQConfig.COMMENT_MODERATION_QUEUE);
                    channel.queueDeclarePassive(RabbitMQConfig.COMMENT_ANALYTICS_QUEUE);
                    return "All queues are available";
                } catch (Exception e) {
                    return "Queues not found: " + e.getMessage();
                }
            });

            return ResponseEntity.ok(Map.of(
                    "status", "connected",
                    "queues", queueInfo,
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("RabbitMQ connection failed", e);
            return ResponseEntity.ok(Map.of(
                    "status", "disconnected",
                    "error", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    @GetMapping("/rabbitmq/send-test-message")
    public ResponseEntity<?> sendTestMessage() {
        try {
            // Create test notification event
            CommentNotificationEvent testEvent = CommentNotificationEvent.builder()
                    .newsArticleId("test-article-123")
                    .newsArticleTitle("Test Article Title")
                    .commentId("test-comment-456")
                    .authorName("Test User")
                    .content("This is a test comment for RabbitMQ")
                    .createdAt(LocalDateTime.now())
                    .isReply(false)
                    .build();

            // Send to notification queue
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_NOTIFICATION_ROUTING_KEY,
                    testEvent
            );

            log.info("Test message sent to RabbitMQ successfully");

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Test message sent to RabbitMQ",
                    "event", testEvent,
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("Failed to send test message to RabbitMQ", e);
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "message", "Failed to send test message",
                    "error", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    @GetMapping("/rabbitmq/queue-stats")
    public ResponseEntity<?> getQueueStats() {
        try {
            var stats = rabbitTemplate.execute(channel -> {
                try {
                    var notificationQueue = channel.queueDeclarePassive(RabbitMQConfig.COMMENT_NOTIFICATION_QUEUE);
                    var moderationQueue = channel.queueDeclarePassive(RabbitMQConfig.COMMENT_MODERATION_QUEUE);
                    var analyticsQueue = channel.queueDeclarePassive(RabbitMQConfig.COMMENT_ANALYTICS_QUEUE);

                    return Map.of(
                            "notification_queue_messages", notificationQueue.getMessageCount(),
                            "moderation_queue_messages", moderationQueue.getMessageCount(),
                            "analytics_queue_messages", analyticsQueue.getMessageCount()
                    );
                } catch (Exception e) {
                    return Map.of("error", "Could not get queue stats: " + e.getMessage());
                }
            });

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "queue_stats", stats,
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("Failed to get queue stats", e);
            return ResponseEntity.ok(Map.of(
                    "status", "error",
                    "error", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        }
    }
}
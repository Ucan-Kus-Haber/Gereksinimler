package sdu.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sdu.backend.config.RabbitMQConfig;
import sdu.backend.dto.CommentAnalyticsEvent;
import sdu.backend.dto.CommentEvent;
import sdu.backend.dto.CommentModerationEvent;
import sdu.backend.dto.CommentNotificationEvent;
import sdu.backend.model.Comment;
import sdu.backend.model.NewsArticle;

import java.time.LocalDateTime;

@Slf4j
@Service
public class CommentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public CommentEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishCommentEvent(CommentEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_NOTIFICATION_ROUTING_KEY,
                    event
            );
            log.info("Published comment event: {} for comment ID: {}", event.getEventType(), event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to publish comment event for comment ID: {}", event.getCommentId(), e);
        }
    }

    public void publishCommentNotification(Comment comment, NewsArticle newsArticle) {
        try {
            CommentNotificationEvent event = CommentNotificationEvent.builder()
                    .newsArticleId(comment.getNewsArticleId())
                    .newsArticleTitle(newsArticle.getTitle())
                    .commentId(comment.getId())
                    .authorName(comment.getAuthorName())
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .isReply(comment.getParentCommentId() != null)
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_NOTIFICATION_ROUTING_KEY,
                    event
            );
            log.info("Published comment notification for comment ID: {}", comment.getId());
        } catch (Exception e) {
            log.error("Failed to publish comment notification for comment ID: {}", comment.getId(), e);
        }
    }

    public void publishReplyNotification(Comment reply, Comment parentComment) {
        try {
            CommentNotificationEvent event = CommentNotificationEvent.builder()
                    .newsArticleId(reply.getNewsArticleId())
                    .commentId(reply.getId())
                    .authorName(reply.getAuthorName())
                    .content(reply.getContent())
                    .createdAt(reply.getCreatedAt())
                    .isReply(true)
                    .parentCommentAuthorEmail(parentComment.getAuthorEmail())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_NOTIFICATION_ROUTING_KEY,
                    event
            );
            log.info("Published reply notification for reply ID: {} to parent ID: {}",
                    reply.getId(), parentComment.getId());
        } catch (Exception e) {
            log.error("Failed to publish reply notification for reply ID: {}", reply.getId(), e);
        }
    }

    public void publishModerationEvent(Comment comment, int riskScore) {
        try {
            CommentModerationEvent event = CommentModerationEvent.builder()
                    .commentId(comment.getId())
                    .newsArticleId(comment.getNewsArticleId())
                    .authorName(comment.getAuthorName())
                    .authorEmail(comment.getAuthorEmail())
                    .content(comment.getContent())
                    .ipAddress(comment.getIpAddress())
                    .createdAt(comment.getCreatedAt())
                    .riskScore(riskScore)
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_MODERATION_ROUTING_KEY,
                    event
            );
            log.info("Published moderation event for comment ID: {} with risk score: {}",
                    comment.getId(), riskScore);
        } catch (Exception e) {
            log.error("Failed to publish moderation event for comment ID: {}", comment.getId(), e);
        }
    }

    public void publishAnalyticsEvent(Comment comment) {
        try {
            CommentAnalyticsEvent event = CommentAnalyticsEvent.builder()
                    .newsArticleId(comment.getNewsArticleId())
                    .commentId(comment.getId())
                    .timestamp(LocalDateTime.now())
                    .eventType("COMMENT_CREATED")
                    .authorEmail(comment.getAuthorEmail())
                    .ipAddress(comment.getIpAddress())
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_ANALYTICS_ROUTING_KEY,
                    event
            );
            log.info("Published analytics event for comment ID: {}", comment.getId());
        } catch (Exception e) {
            log.error("Failed to publish analytics event for comment ID: {}", comment.getId(), e);
        }
    }
}
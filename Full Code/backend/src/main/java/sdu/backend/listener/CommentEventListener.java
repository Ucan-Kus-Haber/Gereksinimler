package sdu.backend.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import sdu.backend.config.RabbitMQConfig;
import sdu.backend.dto.CommentAnalyticsEvent;
import sdu.backend.dto.CommentEvent;
import sdu.backend.dto.CommentModerationEvent;
import sdu.backend.dto.CommentNotificationEvent;
import sdu.backend.service.EmailService;
import sdu.backend.service.NotificationService;

@Slf4j
@Component
public class CommentEventListener {

    private final EmailService emailService;
    private final NotificationService notificationService;

    @Autowired
    public CommentEventListener(EmailService emailService, NotificationService notificationService) {
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = RabbitMQConfig.COMMENT_NOTIFICATION_QUEUE)
    public void handleCommentNotification(CommentNotificationEvent event) {
        try {
            log.info("Processing comment notification for comment ID: {}", event.getCommentId());

            if (event.isReply() && event.getParentCommentAuthorEmail() != null) {
                // Send reply notification to parent comment author
                emailService.sendReplyNotification(event);
            } else {
                // Send new comment notification to news article author/admins
                emailService.sendNewCommentNotification(event);
            }

            // Send real-time notification if needed
            notificationService.sendRealTimeNotification(event);

            log.info("Successfully processed comment notification for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to process comment notification for comment ID: {}", event.getCommentId(), e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.COMMENT_MODERATION_QUEUE)
    public void handleCommentModeration(CommentModerationEvent event) {
        try {
            log.info("Processing comment moderation for comment ID: {} with risk score: {}",
                    event.getCommentId(), event.getRiskScore());

            // Auto-approve low-risk comments
            if (event.getRiskScore() < 30) {
                notificationService.autoApproveComment(event.getCommentId());
                log.info("Auto-approved low-risk comment ID: {}", event.getCommentId());
            }
            // Flag high-risk comments for manual review
            else if (event.getRiskScore() > 70) {
                notificationService.flagForManualReview(event);
                emailService.sendModerationAlert(event);
                log.info("Flagged high-risk comment ID: {} for manual review", event.getCommentId());
            }
            // Medium-risk comments go to moderation queue
            else {
                notificationService.addToModerationQueue(event);
                log.info("Added medium-risk comment ID: {} to moderation queue", event.getCommentId());
            }

        } catch (Exception e) {
            log.error("Failed to process comment moderation for comment ID: {}", event.getCommentId(), e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.COMMENT_ANALYTICS_QUEUE)
    public void handleCommentAnalytics(CommentAnalyticsEvent event) {
        try {
            log.info("Processing comment analytics for comment ID: {}", event.getCommentId());

            // Store analytics data
            notificationService.recordCommentAnalytics(event);

            // Update article engagement metrics
            notificationService.updateArticleEngagement(event.getNewsArticleId());

            // Check for trending articles based on comment activity
            notificationService.checkTrendingStatus(event.getNewsArticleId());

            log.info("Successfully processed comment analytics for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to process comment analytics for comment ID: {}", event.getCommentId(), e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.COMMENT_NOTIFICATION_QUEUE)
    public void handleGeneralCommentEvent(CommentEvent event) {
        try {
            log.info("Processing general comment event: {} for comment ID: {}",
                    event.getEventType(), event.getCommentId());

            switch (event.getEventType()) {
                case COMMENT_APPROVED:
                    notificationService.notifyCommentApproved(event);
                    break;
                case COMMENT_REJECTED:
                    notificationService.notifyCommentRejected(event);
                    break;
                case COMMENT_DELETED:
                    notificationService.notifyCommentDeleted(event);
                    break;
                default:
                    log.debug("No specific handler for event type: {}", event.getEventType());
            }

            log.info("Successfully processed general comment event for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to process general comment event for comment ID: {}", event.getCommentId(), e);
        }
    }
}
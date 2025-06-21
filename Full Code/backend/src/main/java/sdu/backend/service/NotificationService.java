package sdu.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sdu.backend.dto.CommentAnalyticsEvent;
import sdu.backend.dto.CommentEvent;
import sdu.backend.dto.CommentModerationEvent;
import sdu.backend.dto.CommentNotificationEvent;
import sdu.backend.model.Comment;
import sdu.backend.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class NotificationService {

    private final CommentRepository commentRepository;
    private final CommentService commentService;

    @Autowired
    public NotificationService(CommentRepository commentRepository, CommentService commentService) {
        this.commentRepository = commentRepository;
        this.commentService = commentService;
    }

    public void sendRealTimeNotification(CommentNotificationEvent event) {
        // Implement WebSocket/SSE notification logic here
        log.info("Sending real-time notification for comment ID: {}", event.getCommentId());

        // Example: Send WebSocket message to connected clients
        // webSocketMessagingTemplate.convertAndSend("/topic/comments/" + event.getNewsArticleId(), event);
    }

    public void autoApproveComment(String commentId) {
        try {
            commentService.approveComment(commentId);
            log.info("Auto-approved comment ID: {}", commentId);
        } catch (Exception e) {
            log.error("Failed to auto-approve comment ID: {}", commentId, e);
        }
    }

    public void flagForManualReview(CommentModerationEvent event) {
        // Store in a priority moderation queue or flag in database
        log.warn("Comment ID: {} flagged for manual review with risk score: {}",
                event.getCommentId(), event.getRiskScore());

        // Could implement a priority queue or update a moderation_priority field
    }

    public void addToModerationQueue(CommentModerationEvent event) {
        // Add to regular moderation queue
        log.info("Comment ID: {} added to moderation queue with risk score: {}",
                event.getCommentId(), event.getRiskScore());

        // The comment is already in PENDING status, so no action needed
        // Could implement additional queuing logic here
    }

    public void recordCommentAnalytics(CommentAnalyticsEvent event) {
        // Store analytics data in a separate analytics database or service
        log.info("Recording analytics for comment ID: {} on article ID: {}",
                event.getCommentId(), event.getNewsArticleId());

        // Example: Store in analytics database, update metrics, etc.
        // analyticsRepository.save(new CommentAnalytics(event));
    }

    public void updateArticleEngagement(String newsArticleId) {
        // Update article engagement metrics
        long commentCount = commentRepository.countByNewsArticleIdAndStatus(
                newsArticleId, Comment.Status.APPROVED);

        log.info("Article ID: {} now has {} approved comments", newsArticleId, commentCount);

        // Could update article engagement score, trending status, etc.
        // newsArticleService.updateEngagementMetrics(newsArticleId, commentCount);
    }

    public void checkTrendingStatus(String newsArticleId) {
        // Check if article should be marked as trending based on comment activity
        // This could involve checking comments in the last hour, day, etc.

        long recentComments = commentRepository.countByNewsArticleIdAndStatus(
                newsArticleId, Comment.Status.APPROVED);

        // Example logic for trending detection
        if (recentComments > 10) { // Configurable threshold
            log.info("Article ID: {} might be trending with {} comments", newsArticleId, recentComments);
            // Could trigger trending notification or update article status
        }
    }

    public void notifyCommentApproved(CommentEvent event) {
        log.info("Comment ID: {} has been approved", event.getCommentId());

        // Could send notification to comment author
        // emailService.sendApprovalNotification(event);
    }

    public void notifyCommentRejected(CommentEvent event) {
        log.info("Comment ID: {} has been rejected", event.getCommentId());

        // Could send notification to comment author (optional)
        // emailService.sendRejectionNotification(event);
    }

    public void notifyCommentDeleted(CommentEvent event) {
        log.info("Comment ID: {} has been deleted", event.getCommentId());

        // Could send notification to relevant parties
        // Additional cleanup or logging could go here
    }
}
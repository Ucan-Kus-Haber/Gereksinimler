package sdu.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import sdu.backend.dto.CommentDTO;
import sdu.backend.dto.CommentEvent;
import sdu.backend.dto.CommentAnalyticsEvent;
import sdu.backend.dto.CommentModerationEvent;
import sdu.backend.dto.CommentNotificationEvent;
import sdu.backend.model.Comment;
import sdu.backend.model.NewsArticle;
import sdu.backend.repository.CommentRepository;
import sdu.backend.repository.NewsArticleRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final CommentEventPublisher commentEventPublisher;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          NewsArticleRepository newsArticleRepository,
                          CommentEventPublisher commentEventPublisher) {
        this.commentRepository = commentRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.commentEventPublisher = commentEventPublisher;
    }

    public Comment createComment(Comment comment, String ipAddress) {
        // Validate that the news article exists
        Optional<NewsArticle> newsArticle = newsArticleRepository.findById(comment.getNewsArticleId());
        if (newsArticle.isEmpty()) {
            throw new IllegalArgumentException("News article not found with id: " + comment.getNewsArticleId());
        }

        // Set default values
        comment.setIpAddress(ipAddress);
        comment.setLikesCount(0);
        comment.setCreatedAt(LocalDateTime.now());

        // Calculate spam risk score
        int riskScore = calculateSpamRiskScore(comment);

        // Auto-approve comments unless they are high-risk spam
        if (riskScore > 80) {
            comment.setStatus(Comment.Status.SPAM);
            log.warn("Comment marked as SPAM with risk score: {} for content: {}", riskScore, comment.getContent());
        } else if (riskScore > 60) {
            comment.setStatus(Comment.Status.PENDING);
            log.info("Comment requires moderation with risk score: {} for content: {}", riskScore, comment.getContent());
        } else {
            comment.setStatus(Comment.Status.APPROVED);
            log.info("Comment auto-approved with risk score: {}", riskScore);
        }

        Comment savedComment = commentRepository.save(comment);
        log.info("Comment created with ID: {} and status: {}", savedComment.getId(), savedComment.getStatus());

        // Publish events asynchronously
        publishCommentEvents(savedComment, newsArticle.get(), riskScore);

        return savedComment;
    }

    public Comment createReply(String parentCommentId, Comment reply, String ipAddress) {
        // Validate parent comment exists
        Optional<Comment> parentComment = commentRepository.findById(parentCommentId);
        if (parentComment.isEmpty()) {
            throw new IllegalArgumentException("Parent comment not found with id: " + parentCommentId);
        }

        reply.setParentCommentId(parentCommentId);
        reply.setNewsArticleId(parentComment.get().getNewsArticleId());

        Comment savedReply = createComment(reply, ipAddress);

        // Publish reply-specific notification
        commentEventPublisher.publishReplyNotification(savedReply, parentComment.get());

        return savedReply;
    }

    public Page<CommentDTO> getApprovedCommentsByNewsArticle(String newsArticleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Comment> comments = commentRepository.findByNewsArticleIdAndParentCommentIdIsNullAndStatusOrderByCreatedAtDesc(
                newsArticleId, Comment.Status.APPROVED, pageable);

        return comments.map(comment -> {
            CommentDTO dto = CommentDTO.fromEntity(comment);
            // Load replies
            List<Comment> replies = commentRepository.findByParentCommentIdAndStatusOrderByCreatedAtAsc(
                    comment.getId(), Comment.Status.APPROVED);
            dto.setReplies(replies.stream().map(CommentDTO::fromEntity).collect(Collectors.toList()));
            return dto;
        });
    }

    public Page<Comment> getAllCommentsByNewsArticle(String newsArticleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findByNewsArticleIdOrderByCreatedAtDesc(newsArticleId, pageable);
    }

    public Page<Comment> getCommentsByStatus(Comment.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    public Comment approveComment(String commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setStatus(Comment.Status.APPROVED);
            comment.setUpdatedAt(LocalDateTime.now());

            Comment updatedComment = commentRepository.save(comment);

            // Publish approval event
            commentEventPublisher.publishCommentEvent(
                    CommentEvent.fromComment(updatedComment, CommentEvent.EventType.COMMENT_APPROVED));

            log.info("Comment approved with ID: {}", commentId);
            return updatedComment;
        }
        throw new IllegalArgumentException("Comment not found with id: " + commentId);
    }

    public Comment rejectComment(String commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setStatus(Comment.Status.REJECTED);
            comment.setUpdatedAt(LocalDateTime.now());

            Comment updatedComment = commentRepository.save(comment);

            // Publish rejection event
            commentEventPublisher.publishCommentEvent(
                    CommentEvent.fromComment(updatedComment, CommentEvent.EventType.COMMENT_REJECTED));

            log.info("Comment rejected with ID: {}", commentId);
            return updatedComment;
        }
        throw new IllegalArgumentException("Comment not found with id: " + commentId);
    }

    public void deleteComment(String commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();

            // Delete all replies first
            List<Comment> replies = commentRepository.findByParentCommentIdAndStatusOrderByCreatedAtAsc(
                    commentId, Comment.Status.APPROVED);
            replies.forEach(reply -> commentRepository.deleteById(reply.getId()));

            // Delete the comment
            commentRepository.deleteById(commentId);

            // Publish deletion event
            commentEventPublisher.publishCommentEvent(
                    CommentEvent.fromComment(comment, CommentEvent.EventType.COMMENT_DELETED));

            log.info("Comment deleted with ID: {}", commentId);
        }
    }

    public Comment likeComment(String commentId) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);
        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            comment.setLikesCount(comment.getLikesCount() + 1);
            return commentRepository.save(comment);
        }
        throw new IllegalArgumentException("Comment not found with id: " + commentId);
    }

    public long getApprovedCommentCount(String newsArticleId) {
        return commentRepository.countByNewsArticleIdAndStatus(newsArticleId, Comment.Status.APPROVED);
    }

    public Optional<Comment> getCommentById(String commentId) {
        return commentRepository.findById(commentId);
    }

    private void publishCommentEvents(Comment comment, NewsArticle newsArticle, int riskScore) {
        // Publish general comment event
        CommentEvent.EventType eventType = comment.getStatus() == Comment.Status.APPROVED
                ? CommentEvent.EventType.COMMENT_CREATED
                : CommentEvent.EventType.COMMENT_CREATED;

        commentEventPublisher.publishCommentEvent(
                CommentEvent.fromComment(comment, eventType));

        // Publish notification event only for approved comments
        if (comment.getStatus() == Comment.Status.APPROVED) {
            commentEventPublisher.publishCommentNotification(comment, newsArticle);
        }

        // Publish moderation event if needed for review
        if (comment.getStatus() == Comment.Status.PENDING || comment.getStatus() == Comment.Status.SPAM) {
            commentEventPublisher.publishModerationEvent(comment, riskScore);
        }

        // Publish analytics event
        commentEventPublisher.publishAnalyticsEvent(comment);
    }

    private int calculateSpamRiskScore(Comment comment) {
        int score = 0;

        // Check for spam indicators
        String content = comment.getContent().toLowerCase();

        // URL detection - higher penalty
        if (content.contains("http://") || content.contains("https://") || content.contains("www.")) {
            score += 40;
        }

        // Excessive capitalization
        long capsCount = content.chars().filter(Character::isUpperCase).count();
        if (capsCount > content.length() * 0.5) {
            score += 25;
        }

        // Excessive punctuation
        long punctCount = content.chars().filter(ch -> "!@#$%^&*()".indexOf(ch) >= 0).count();
        if (punctCount > 8) {
            score += 20;
        }

        // Very short content (likely spam)
        if (content.trim().length() < 5) {
            score += 30;
        }

        // Very long content (likely spam)
        if (content.length() > 2000) {
            score += 15;
        }

        // Common spam words - higher penalties
        String[] spamWords = {"buy now", "click here", "free money", "winner", "congratulations",
                "viagra", "casino", "lottery", "investment", "make money"};
        for (String spamWord : spamWords) {
            if (content.contains(spamWord)) {
                score += 20;
            }
        }

        // Repetitive characters (like "aaaaaa" or "!!!!!!")
        if (content.matches(".*([a-zA-Z])\\1{4,}.*") || content.matches(".*([!@#$%^&*().,])\\1{3,}.*")) {
            score += 15;
        }

        // All caps words
        String[] words = content.split("\\s+");
        int capsWords = 0;
        for (String word : words) {
            if (word.length() > 3 && word.equals(word.toUpperCase())) {
                capsWords++;
            }
        }
        if (capsWords > words.length * 0.3) {
            score += 20;
        }

        log.debug("Spam risk score calculated: {} for content: {}", score, content);
        return Math.min(score, 100); // Cap at 100
    }
}
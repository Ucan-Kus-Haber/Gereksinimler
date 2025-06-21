package sdu.backend.repository;

import sdu.backend.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    // Find comments by news article ID with status filter
    Page<Comment> findByNewsArticleIdAndStatusOrderByCreatedAtDesc(String newsArticleId, Comment.Status status, Pageable pageable);

    // Find all comments for a news article (for admin)
    Page<Comment> findByNewsArticleIdOrderByCreatedAtDesc(String newsArticleId, Pageable pageable);

    // Find comments by status (for moderation)
    Page<Comment> findByStatusOrderByCreatedAtDesc(Comment.Status status, Pageable pageable);

    // Find replies to a specific comment
    List<Comment> findByParentCommentIdAndStatusOrderByCreatedAtAsc(String parentCommentId, Comment.Status status);

    // Count approved comments for a news article
    long countByNewsArticleIdAndStatus(String newsArticleId, Comment.Status status);

    // Find comments by author email (for moderation)
    Page<Comment> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail, Pageable pageable);

    // Find recent comments (for admin dashboard)
    Page<Comment> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime since, Pageable pageable);

    // Find top-level comments (not replies)
    Page<Comment> findByNewsArticleIdAndParentCommentIdIsNullAndStatusOrderByCreatedAtDesc(
            String newsArticleId, Comment.Status status, Pageable pageable);
}
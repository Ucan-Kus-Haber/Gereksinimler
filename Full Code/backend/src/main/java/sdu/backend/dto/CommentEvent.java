package sdu.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import sdu.backend.model.Comment;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentEvent {
    private String commentId;
    private String newsArticleId;
    private String authorName;
    private String authorEmail;
    private String content;
    private Comment.Status status;
    private String ipAddress;
    private LocalDateTime createdAt;
    private EventType eventType;
    private String parentCommentId;

    public enum EventType {
        COMMENT_CREATED,
        COMMENT_UPDATED,
        COMMENT_APPROVED,
        COMMENT_REJECTED,
        COMMENT_DELETED,
        REPLY_CREATED
    }

    public static CommentEvent fromComment(Comment comment, EventType eventType) {
        return CommentEvent.builder()
                .commentId(comment.getId())
                .newsArticleId(comment.getNewsArticleId())
                .authorName(comment.getAuthorName())
                .authorEmail(comment.getAuthorEmail())
                .content(comment.getContent())
                .status(comment.getStatus())
                .ipAddress(comment.getIpAddress())
                .createdAt(comment.getCreatedAt())
                .parentCommentId(comment.getParentCommentId())
                .eventType(eventType)
                .build();
    }
}


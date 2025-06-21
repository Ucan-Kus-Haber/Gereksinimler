package sdu.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import sdu.backend.model.Comment;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private String id;
    private String newsArticleId;
    private String authorName;
    private String content;
    private Comment.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String parentCommentId;
    private int likesCount;
    private List<CommentDTO> replies; // For nested replies

    // Static method to convert from entity to DTO (public view - no email or IP)
    public static CommentDTO fromEntity(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .newsArticleId(comment.getNewsArticleId())
                .authorName(comment.getAuthorName())
                .content(comment.getContent())
                .status(comment.getStatus())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .parentCommentId(comment.getParentCommentId())
                .likesCount(comment.getLikesCount())
                .build();
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class CommentAdminDTO {
    private String id;
    private String newsArticleId;
    private String authorName;
    private String authorEmail;
    private String content;
    private Comment.Status status;
    private String ipAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String parentCommentId;
    private int likesCount;

    // Static method for admin view (includes email and IP)
    public static CommentAdminDTO fromEntity(Comment comment) {
        return CommentAdminDTO.builder()
                .id(comment.getId())
                .newsArticleId(comment.getNewsArticleId())
                .authorName(comment.getAuthorName())
                .authorEmail(comment.getAuthorEmail())
                .content(comment.getContent())
                .status(comment.getStatus())
                .ipAddress(comment.getIpAddress())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .parentCommentId(comment.getParentCommentId())
                .likesCount(comment.getLikesCount())
                .build();
    }
}
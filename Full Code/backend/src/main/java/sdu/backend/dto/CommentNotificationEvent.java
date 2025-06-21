package sdu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentNotificationEvent {
    private String newsArticleId;
    private String newsArticleTitle;
    private String commentId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
    private boolean isReply;
    private String parentCommentAuthorEmail;
}

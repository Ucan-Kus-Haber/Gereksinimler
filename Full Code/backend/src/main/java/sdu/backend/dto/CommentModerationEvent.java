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
public class CommentModerationEvent {
    private String commentId;
    private String newsArticleId;
    private String authorName;
    private String authorEmail;
    private String content;
    private String ipAddress;
    private LocalDateTime createdAt;
    private int riskScore;
}

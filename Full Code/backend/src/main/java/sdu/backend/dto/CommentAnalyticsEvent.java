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
public class CommentAnalyticsEvent {
    private String newsArticleId;
    private String commentId;
    private LocalDateTime timestamp;
    private String eventType;
    private String authorEmail;
    private String ipAddress;
}
package sdu.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "news")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id
    private String id;

    @Indexed
    private String title;

    private String content;

    private String author;

    @Indexed
    private String category;

    private String imageUrl;

    // New fields for tracking uploaded files
    private String imageFileName;
    private String videoUrl;
    private String videoFileName;

    private String summary;

    @Indexed
    private List<String> tags;

    private boolean featured;

    private int viewCount;

    @Indexed
    private LocalDateTime publishedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String source;

    private String slug;

    private Status status;

    public enum Status {
        DRAFT, PUBLISHED, ARCHIVED
    }
}
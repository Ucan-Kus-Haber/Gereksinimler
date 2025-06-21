package sdu.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import sdu.backend.model.NewsArticle;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsDTO {
    private String id;
    private String title;
    private String summary;
    private String author;
    private String category;
    private String imageUrl;
    private String videoUrl;
    private List<String> tags;
    private boolean featured;
    private int viewCount;
    private LocalDateTime publishedAt;
    private String slug;
    private NewsArticle.Status status;

    // Static method to convert from entity to DTO
    public static NewsDTO fromEntity(NewsArticle article) {
        return NewsDTO.builder()
                .id(article.getId())
                .title(article.getTitle())
                .summary(article.getSummary())
                .author(article.getAuthor())
                .category(article.getCategory())
                .imageUrl(article.getImageUrl())
                .videoUrl(article.getVideoUrl())
                .tags(article.getTags())
                .featured(article.isFeatured())
                .viewCount(article.getViewCount())
                .publishedAt(article.getPublishedAt())
                .slug(article.getSlug())
                .status(article.getStatus())
                .build();
    }
}
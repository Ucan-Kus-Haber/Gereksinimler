package sdu.backend.repository;

import sdu.backend.model.NewsArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsArticleRepository extends MongoRepository<NewsArticle, String> {

    // Find by category with pagination
    Page<NewsArticle> findByCategoryAndStatusOrderByPublishedAtDesc(String category, NewsArticle.Status status, Pageable pageable);

    // Find by author with pagination
    Page<NewsArticle> findByAuthorAndStatusOrderByPublishedAtDesc(String author, NewsArticle.Status status, Pageable pageable);

    // Search in title or content
    @Query("{ $and: [ { $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }, { 'status': ?1 } ] }")
    Page<NewsArticle> searchByKeywordAndStatus(String keyword, NewsArticle.Status status, Pageable pageable);

    // Find featured articles
    List<NewsArticle> findByFeaturedTrueAndStatusOrderByPublishedAtDesc(NewsArticle.Status status, Pageable pageable);

    // Find by slug (for SEO-friendly URLs)
    Optional<NewsArticle> findBySlugAndStatus(String slug, NewsArticle.Status status);

    // Find by tags
    Page<NewsArticle> findByTagsContainingAndStatusOrderByPublishedAtDesc(String tag, NewsArticle.Status status, Pageable pageable);

    // Find by date range
    Page<NewsArticle> findByPublishedAtBetweenAndStatusOrderByPublishedAtDesc(
            LocalDateTime start, LocalDateTime end, NewsArticle.Status status, Pageable pageable);

    // Most viewed articles
    Page<NewsArticle> findByStatusOrderByViewCountDesc(NewsArticle.Status status, Pageable pageable);

    // Count articles by category
    long countByCategoryAndStatus(String category, NewsArticle.Status status);

    // Find latest news
    Page<NewsArticle> findByStatusOrderByPublishedAtDesc(NewsArticle.Status status, Pageable pageable);
}
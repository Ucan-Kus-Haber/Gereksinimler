package sdu.backend.controller;

import sdu.backend.model.NewsArticle;
import sdu.backend.service.NewsArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*") // Configure this appropriately for production
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @Autowired
    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createArticle(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam(value = "source", required = false) String source,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "featured", defaultValue = "false") boolean featured,
            @RequestParam(value = "status", defaultValue = "DRAFT") NewsArticle.Status status,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video) {

        try {
            NewsArticle newsArticle = new NewsArticle();
            newsArticle.setTitle(title);
            newsArticle.setContent(content);
            newsArticle.setAuthor(author);
            newsArticle.setCategory(category);
            newsArticle.setSummary(summary);
            newsArticle.setSource(source);
            newsArticle.setTags(tags);
            newsArticle.setFeatured(featured);
            newsArticle.setStatus(status);
            newsArticle.setViewCount(0);

            NewsArticle savedArticle = newsArticleService.saveArticle(newsArticle, image, video);
            return new ResponseEntity<>(savedArticle, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating article: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateArticle(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam(value = "source", required = false) String source,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "featured", defaultValue = "false") boolean featured,
            @RequestParam(value = "status", required = false) NewsArticle.Status status,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video) {

        try {
            Optional<NewsArticle> existingArticle = newsArticleService.getArticleById(id);
            if (existingArticle.isPresent()) {
                NewsArticle updatedArticle = new NewsArticle();
                updatedArticle.setTitle(title);
                updatedArticle.setContent(content);
                updatedArticle.setAuthor(author);
                updatedArticle.setCategory(category);
                updatedArticle.setSummary(summary);
                updatedArticle.setSource(source);
                updatedArticle.setTags(tags);
                updatedArticle.setFeatured(featured);
                updatedArticle.setStatus(status);

                NewsArticle result = newsArticleService.updateArticle(id, updatedArticle, image, video);
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Article not found with id: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating article: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPublishedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getPublishedArticles(page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getAllArticles(page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable String id) {
        Optional<NewsArticle> article = newsArticleService.getArticleById(id);
        if (article.isPresent()) {
            return ResponseEntity.ok(article.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Article not found with id: " + id));
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getArticleBySlug(@PathVariable String slug) {
        Optional<NewsArticle> article = newsArticleService.getPublishedArticleBySlug(slug);
        if (article.isPresent()) {
            // Increment view count when accessed by slug (typically user view)
            NewsArticle updatedArticle = newsArticleService.incrementViewCount(article.get().getId());
            return ResponseEntity.ok(updatedArticle);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Article not found with slug: " + slug));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getArticlesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getArticlesByCategory(category, page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/author/{author}")
    public ResponseEntity<Map<String, Object>> getArticlesByAuthor(
            @PathVariable String author,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getArticlesByAuthor(author, page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchArticles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.searchArticles(keyword, page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<NewsArticle>> getFeaturedArticles(
            @RequestParam(defaultValue = "5") int limit) {
        List<NewsArticle> articles = newsArticleService.getFeaturedArticles(limit);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getMostViewedArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getMostViewedArticles(page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<Map<String, Object>> getArticlesByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NewsArticle> articlesPage = newsArticleService.getArticlesByTag(tag, page, size);

        Map<String, Object> response = createPaginatedResponse(articlesPage);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable String id) {
        try {
            Optional<NewsArticle> existingArticle = newsArticleService.getArticleById(id);
            if (existingArticle.isPresent()) {
                newsArticleService.deleteArticle(id);
                return ResponseEntity.ok(Map.of("message", "Article deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Article not found with id: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting article: " + e.getMessage()));
        }
    }

    private Map<String, Object> createPaginatedResponse(Page<NewsArticle> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        return response;
    }
}
package sdu.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sdu.backend.model.NewsArticle;
import sdu.backend.repository.NewsArticleRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final NewsStorageService newsStorageService;
    private final String baseUrl = "https://pub-cab830fe342c4f9480be11e8b3347409.r2.dev/";
    private final String bucketName = "my-data";

    @Autowired
    public NewsArticleService(NewsArticleRepository newsArticleRepository, NewsStorageService newsStorageService) {
        this.newsArticleRepository = newsArticleRepository;
        this.newsStorageService = newsStorageService;
    }

    public NewsArticle saveArticle(NewsArticle newsArticle, MultipartFile image, MultipartFile video) throws Exception {
        if (newsArticle.getPublishedAt() == null && newsArticle.getStatus() == NewsArticle.Status.PUBLISHED) {
            newsArticle.setPublishedAt(LocalDateTime.now());
        }

        // Generate slug if not provided
        if (newsArticle.getSlug() == null || newsArticle.getSlug().isEmpty()) {
            newsArticle.setSlug(generateSlug(newsArticle.getTitle()));
        }

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            NewsStorageService.UploadResult imageResult = newsStorageService.uploadFile(image);
            newsArticle.setImageUrl(baseUrl + imageResult.getFileName());
            newsArticle.setImageFileName(imageResult.getFileName());
        }

        // Handle video upload
        if (video != null && !video.isEmpty()) {
            NewsStorageService.UploadResult videoResult = newsStorageService.uploadFile(video);
            newsArticle.setVideoUrl(baseUrl + bucketName + "/" + videoResult.getFileName());
            newsArticle.setVideoFileName(videoResult.getFileName());
        }

        return newsArticleRepository.save(newsArticle);
    }

    public NewsArticle updateArticle(String id, NewsArticle updatedArticle, MultipartFile image, MultipartFile video) throws Exception {
        Optional<NewsArticle> existingArticleOpt = newsArticleRepository.findById(id);

        if (existingArticleOpt.isPresent()) {
            NewsArticle existingArticle = existingArticleOpt.get();

            // Update basic fields
            existingArticle.setTitle(updatedArticle.getTitle());
            existingArticle.setContent(updatedArticle.getContent());
            existingArticle.setAuthor(updatedArticle.getAuthor());
            existingArticle.setCategory(updatedArticle.getCategory());
            existingArticle.setSummary(updatedArticle.getSummary());
            existingArticle.setTags(updatedArticle.getTags());
            existingArticle.setFeatured(updatedArticle.isFeatured());
            existingArticle.setSource(updatedArticle.getSource());
            existingArticle.setStatus(updatedArticle.getStatus());

            // Handle slug updates
            if (updatedArticle.getSlug() != null && !updatedArticle.getSlug().isEmpty()) {
                existingArticle.setSlug(updatedArticle.getSlug());
            } else if (existingArticle.getSlug() == null || existingArticle.getSlug().isEmpty()) {
                existingArticle.setSlug(generateSlug(existingArticle.getTitle()));
            }

            // Handle publishedAt updates based on status
            if (existingArticle.getPublishedAt() == null && existingArticle.getStatus() == NewsArticle.Status.PUBLISHED) {
                existingArticle.setPublishedAt(LocalDateTime.now());
            }

            // Handle image upload
            if (image != null && !image.isEmpty()) {
                if (existingArticle.getImageFileName() != null) {
                    newsStorageService.deleteFile(existingArticle.getImageFileName());
                }
                NewsStorageService.UploadResult imageResult = newsStorageService.uploadFile(image);
                existingArticle.setImageUrl(baseUrl + bucketName + "/" + imageResult.getFileName());
                existingArticle.setImageFileName(imageResult.getFileName());
            }

            // Handle video upload/replacement
            if (video != null && !video.isEmpty()) {
                if (existingArticle.getVideoFileName() != null) {
                    newsStorageService.deleteFile(existingArticle.getVideoFileName());
                }
                NewsStorageService.UploadResult videoResult = newsStorageService.uploadFile(video);
                existingArticle.setVideoUrl(baseUrl + bucketName + "/" + videoResult.getFileName());
                existingArticle.setVideoFileName(videoResult.getFileName());
            }

            return newsArticleRepository.save(existingArticle);
        }

        return null;
    }

    public Page<NewsArticle> getAllArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return newsArticleRepository.findAll(pageable);
    }

    public Page<NewsArticle> getPublishedArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return newsArticleRepository.findByStatusOrderByPublishedAtDesc(NewsArticle.Status.PUBLISHED, pageable);
    }

    public Optional<NewsArticle> getArticleById(String id) {
        return newsArticleRepository.findById(id);
    }

    public Optional<NewsArticle> getPublishedArticleBySlug(String slug) {
        return newsArticleRepository.findBySlugAndStatus(slug, NewsArticle.Status.PUBLISHED);
    }

    public Page<NewsArticle> getArticlesByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return newsArticleRepository.findByCategoryAndStatusOrderByPublishedAtDesc(category, NewsArticle.Status.PUBLISHED, pageable);
    }

    public Page<NewsArticle> getArticlesByAuthor(String author, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return newsArticleRepository.findByAuthorAndStatusOrderByPublishedAtDesc(author, NewsArticle.Status.PUBLISHED, pageable);
    }

    public Page<NewsArticle> searchArticles(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsArticleRepository.searchByKeywordAndStatus(keyword, NewsArticle.Status.PUBLISHED, pageable);
    }

    public List<NewsArticle> getFeaturedArticles(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return newsArticleRepository.findByFeaturedTrueAndStatusOrderByPublishedAtDesc(NewsArticle.Status.PUBLISHED, pageable);
    }

    public Page<NewsArticle> getMostViewedArticles(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsArticleRepository.findByStatusOrderByViewCountDesc(NewsArticle.Status.PUBLISHED, pageable);
    }

    public Page<NewsArticle> getArticlesByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        return newsArticleRepository.findByTagsContainingAndStatusOrderByPublishedAtDesc(tag, NewsArticle.Status.PUBLISHED, pageable);
    }

    public void deleteArticle(String id) throws Exception {
        Optional<NewsArticle> articleOpt = newsArticleRepository.findById(id);
        if (articleOpt.isPresent()) {
            NewsArticle article = articleOpt.get();
            if (article.getImageFileName() != null) {
                newsStorageService.deleteFile(article.getImageFileName());
            }
            if (article.getVideoFileName() != null) {
                newsStorageService.deleteFile(article.getVideoFileName());
            }
            newsArticleRepository.deleteById(id);
        }
    }

    public NewsArticle incrementViewCount(String id) {
        Optional<NewsArticle> articleOpt = newsArticleRepository.findById(id);
        if (articleOpt.isPresent()) {
            NewsArticle article = articleOpt.get();
            article.setViewCount(article.getViewCount() + 1);
            return newsArticleRepository.save(article);
        }
        return null;
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9-]", "");
    }
}
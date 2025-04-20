package sdu.backend.validator;

import sdu.backend.model.NewsArticle;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.util.StringUtils;

@Component
public class NewsArticleValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return NewsArticle.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        NewsArticle article = (NewsArticle) target;

        // Title validation
        if (!StringUtils.hasText(article.getTitle())) {
            errors.rejectValue("title", "field.required", "Title is required");
        } else if (article.getTitle().length() > 200) {
            errors.rejectValue("title", "field.maxLength", "Title cannot exceed 200 characters");
        }

        // Content validation
        if (!StringUtils.hasText(article.getContent())) {
            errors.rejectValue("content", "field.required", "Content is required");
        }

        // Author validation
        if (!StringUtils.hasText(article.getAuthor())) {
            errors.rejectValue("author", "field.required", "Author is required");
        }

        // Category validation
        if (!StringUtils.hasText(article.getCategory())) {
            errors.rejectValue("category", "field.required", "Category is required");
        }

        // Summary validation
        if (article.getSummary() != null && article.getSummary().length() > 500) {
            errors.rejectValue("summary", "field.maxLength", "Summary cannot exceed 500 characters");
        }

        // Status validation
        if (article.getStatus() == null) {
            errors.rejectValue("status", "field.required", "Status is required");
        }
    }
}
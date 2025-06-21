package sdu.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sdu.backend.dto.CommentDTO;
import sdu.backend.model.Comment;
import sdu.backend.service.CommentService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:5173",
        "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174"})
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/news/{newsArticleId}")
    public ResponseEntity<?> createComment(
            @PathVariable String newsArticleId,
            @RequestParam("authorName") String authorName,
            @RequestParam("authorEmail") String authorEmail,
            @RequestParam("content") String content,
            HttpServletRequest request) {

        try {
            // Basic validation
            if (authorName == null || authorName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Author name is required"));
            }

            if (authorEmail == null || authorEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Author email is required"));
            }

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Comment content is required"));
            }

            if (content.trim().length() < 3) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Comment must be at least 3 characters long"));
            }

            if (content.length() > 2000) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Comment cannot exceed 2000 characters"));
            }

            Comment comment = Comment.builder()
                    .newsArticleId(newsArticleId)
                    .authorName(authorName.trim())
                    .authorEmail(authorEmail.trim().toLowerCase())
                    .content(content.trim())
                    .build();

            String ipAddress = getClientIpAddress(request);
            Comment savedComment = commentService.createComment(comment, ipAddress);

            // Create response with status information
            Map<String, Object> response = new HashMap<>();
            response.put("comment", CommentDTO.fromEntity(savedComment));
            response.put("status", savedComment.getStatus().toString());

            if (savedComment.getStatus() == Comment.Status.APPROVED) {
                response.put("message", "Comment posted successfully!");
            } else if (savedComment.getStatus() == Comment.Status.PENDING) {
                response.put("message", "Comment submitted for review and will appear after approval.");
            } else if (savedComment.getStatus() == Comment.Status.SPAM) {
                response.put("message", "Comment flagged for review due to potential spam content.");
            }

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating comment: " + e.getMessage()));
        }
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<?> createReply(
            @PathVariable String commentId,
            @RequestParam("authorName") String authorName,
            @RequestParam("authorEmail") String authorEmail,
            @RequestParam("content") String content,
            HttpServletRequest request) {

        try {
            // Basic validation
            if (authorName == null || authorName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Author name is required"));
            }

            if (authorEmail == null || authorEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Author email is required"));
            }

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Reply content is required"));
            }

            if (content.trim().length() < 3) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Reply must be at least 3 characters long"));
            }

            if (content.length() > 1000) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Reply cannot exceed 1000 characters"));
            }

            Comment reply = Comment.builder()
                    .authorName(authorName.trim())
                    .authorEmail(authorEmail.trim().toLowerCase())
                    .content(content.trim())
                    .build();

            String ipAddress = getClientIpAddress(request);
            Comment savedReply = commentService.createReply(commentId, reply, ipAddress);

            // Create response with status information
            Map<String, Object> response = new HashMap<>();
            response.put("reply", CommentDTO.fromEntity(savedReply));
            response.put("status", savedReply.getStatus().toString());

            if (savedReply.getStatus() == Comment.Status.APPROVED) {
                response.put("message", "Reply posted successfully!");
            } else if (savedReply.getStatus() == Comment.Status.PENDING) {
                response.put("message", "Reply submitted for review and will appear after approval.");
            } else if (savedReply.getStatus() == Comment.Status.SPAM) {
                response.put("message", "Reply flagged for review due to potential spam content.");
            }

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating reply: " + e.getMessage()));
        }
    }

    @GetMapping("/news/{newsArticleId}")
    public ResponseEntity<Map<String, Object>> getCommentsByNewsArticle(
            @PathVariable String newsArticleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<CommentDTO> commentsPage = commentService.getApprovedCommentsByNewsArticle(newsArticleId, page, size);
            long totalComments = commentService.getApprovedCommentCount(newsArticleId);

            Map<String, Object> response = createPaginatedResponse(commentsPage);
            response.put("totalComments", totalComments);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching comments: " + e.getMessage()));
        }
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable String commentId) {
        try {
            Optional<Comment> comment = commentService.getCommentById(commentId);
            if (comment.isPresent()) {
                return ResponseEntity.ok(CommentDTO.fromEntity(comment.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Comment not found with id: " + commentId));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching comment: " + e.getMessage()));
        }
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable String commentId) {
        try {
            Comment likedComment = commentService.likeComment(commentId);
            Map<String, Object> response = new HashMap<>();
            response.put("comment", CommentDTO.fromEntity(likedComment));
            response.put("message", "Comment liked successfully!");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error liking comment: " + e.getMessage()));
        }
    }

    // Admin endpoints
    @GetMapping("/admin/news/{newsArticleId}")
    public ResponseEntity<Map<String, Object>> getAllCommentsByNewsArticle(
            @PathVariable String newsArticleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<Comment> commentsPage = commentService.getAllCommentsByNewsArticle(newsArticleId, page, size);
            Map<String, Object> response = createPaginatedResponse(commentsPage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching admin comments: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/status/{status}")
    public ResponseEntity<Map<String, Object>> getCommentsByStatus(
            @PathVariable Comment.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<Comment> commentsPage = commentService.getCommentsByStatus(status, page, size);
            Map<String, Object> response = createPaginatedResponse(commentsPage);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching comments by status: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/{commentId}/approve")
    public ResponseEntity<?> approveComment(@PathVariable String commentId) {
        try {
            Comment approvedComment = commentService.approveComment(commentId);
            Map<String, Object> response = new HashMap<>();
            response.put("comment", CommentDTO.fromEntity(approvedComment));
            response.put("message", "Comment approved successfully!");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error approving comment: " + e.getMessage()));
        }
    }

    @PutMapping("/admin/{commentId}/reject")
    public ResponseEntity<?> rejectComment(@PathVariable String commentId) {
        try {
            Comment rejectedComment = commentService.rejectComment(commentId);
            Map<String, Object> response = new HashMap<>();
            response.put("comment", CommentDTO.fromEntity(rejectedComment));
            response.put("message", "Comment rejected successfully!");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error rejecting comment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting comment: " + e.getMessage()));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    private <T> Map<String, Object> createPaginatedResponse(Page<T> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("hasNext", page.hasNext());
        response.put("hasPrevious", page.hasPrevious());
        return response;
    }
}
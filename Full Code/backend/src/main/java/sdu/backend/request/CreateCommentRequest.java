package sdu.backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

// Request DTOs
@Data
public class CreateCommentRequest {
    @NotBlank(message = "Content cannot be blank")
    @Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;

    @NotBlank(message = "Entity type cannot be blank")
    private String entityType;

    @NotNull(message = "Entity ID cannot be null")
    private Long entityId;

    private Long parentCommentId; // for replies
}

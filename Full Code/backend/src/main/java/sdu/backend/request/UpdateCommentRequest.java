package sdu.backend.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCommentRequest {
    @NotBlank(message = "Content cannot be blank")
    @Size(max = 1000, message = "Content cannot exceed 1000 characters")
    private String content;
}
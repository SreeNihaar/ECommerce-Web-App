package com.example.SpringWebAPI.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponseDTO {
    String userName;
    Integer productId;
    @NotBlank
    @Size(max = 1000, message = "Review cannot exceed 1000 characters.")
    String comment;
    Integer rating;
    Instant updatedAt;
}

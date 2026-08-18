package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.ReviewRequestDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.dto.response.ReviewResponseDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService service){
        this.service=service;
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> addReview(@PathVariable("id") int id, @Valid @RequestBody ReviewRequestDTO requestDTO){
        int reviewId = service.addReview(requestDTO,id);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<>(
                "Successfully posted Review",
                "Review added successfully id: "+reviewId)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CONSUMER','ADMIN')")
    public ResponseEntity<SuccessResponse<ReviewResponseDTO>> getUserReview(@PathVariable("id") int productId){
        ReviewResponseDTO responseDTO = service.getReview(productId);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                responseDTO != null ? "Successfully found the Review" : "No review found",
                responseDTO
        ));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> editReview(@PathVariable("id") int productId,@RequestBody ReviewRequestDTO requestDTO){
        int reviewId = service.editReview(requestDTO,productId);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Successfully updated Review",
                "Review updated successfully , Review id: "+reviewId)
        );
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<SuccessResponse<PageResponseDTO<ReviewResponseDTO>>> getProductReviews(@PathVariable("id") int productId, @RequestParam(defaultValue = "1") int page,
                                                                                                 @RequestParam(defaultValue = "5") int size){
        PageResponseDTO<ReviewResponseDTO> result = service.getReviewsOfProductPage(productId,page-1,size);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched the Reviews of Product",
                result
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> deleteUserReview(@PathVariable("id") int id){
        String status = service.deleteReview(id);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Deleted Review Successfully.",
                status
        ));
    }
}

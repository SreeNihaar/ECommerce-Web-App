package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.ReviewRequestDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.dto.response.ReviewResponseDTO;
import com.example.SpringWebAPI.exception.*;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.model.Review;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.ProductRepository;
import com.example.SpringWebAPI.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ReviewService extends ParentService{

    private final ReviewRepository reviewRepo;

    private final ProductRepository productRepo;

    public ReviewService(ReviewRepository reviewRepo,ProductRepository productRepo){
        this.reviewRepo=reviewRepo;
        this.productRepo=productRepo;
    }

    public boolean reviewExists(int userId,int productId){
        return reviewRepo.findByUserIdAndProductId(userId,productId).isPresent();
    }

    private void validateCommentAndRating(ReviewRequestDTO review){
        if(review.getComment().length()>1000 || review.getRating()>5 || review.getRating()<=0){
            throw new InvalidReviewRequestException("Please Enter Valid Review.");
        }
    }

    @Transactional
    public Integer addReview(ReviewRequestDTO dto,int productId){
        log.info("Adding review for product ID: {} by user: {}", productId, this.getAuthenticatedUser().getUsername());

        validateCommentAndRating(dto);

        User user = this.getAuthenticatedUser();

        Product product = productRepo.findById(productId)
                .orElseThrow(()-> new ProductNotFoundException("Product Not Found",productId));

        if(reviewExists(user.getId(),product.getId())){
            log.warn("User {} attempted to add duplicate review for product {}", user.getUsername(), productId);
            throw new ReviewAlreadyExistsException("Review Already Exists. Please edit the review if you want.");
        }

        Review review = new Review();
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());

        double currentProductReview = product.getRating();
        int currentProductReviewCount = product.getReviewCount();

        double rating = currentProductReview*currentProductReviewCount;
        rating+=review.getRating();

        int finalReviewCount = currentProductReviewCount + 1;
        double finalRating = rating/finalReviewCount;

        product.setRating(finalRating);
        product.setReviewCount(finalReviewCount);
        log.debug("Product rating updated - Product: {}, New Rating: {}, New Count: {}",
            product.getProductName(), finalRating, finalReviewCount);

        Product savedProduct = productRepo.save(product);

        review.setUser(user);
        review.setUserName(user.getUsername());
        review.setProduct(savedProduct);

        Review savedReview = reviewRepo.save(review);
        log.info("Review added successfully - Review ID: {}, Product: {}, Rating: {}", savedReview.getId(), product.getProductName(), review.getRating());
        return savedReview.getId();
    }

    @Transactional
    public Integer editReview(ReviewRequestDTO dto,int productId){

        validateCommentAndRating(dto);

        User user = this.getAuthenticatedUser();
        Product product = productRepo.findById(productId)
                .orElseThrow(()-> new ProductNotFoundException("Product Not Found",productId));

        Review review = reviewRepo.findByUserIdAndProductId(user.getId(),productId).orElseThrow(
                () -> new ReviewNotFoundException("Review Not Found")
        );

        int prevRating = review.getRating();

        review.setComment(dto.getComment());
        review.setRating(dto.getRating());

        double currentProductReview = product.getRating();
        int currentProductReviewCount = product.getReviewCount();

        double rating = currentProductReview*currentProductReviewCount;
        rating-=prevRating;
        rating+=review.getRating();

        double finalRating = rating/currentProductReviewCount;

        product.setRating(finalRating);
        product.setReviewCount(currentProductReviewCount);

        Product savedProduct = productRepo.save(product);

        review.setUser(user);
        review.setUserName(user.getUsername());

        review.setProduct(savedProduct);

        return reviewRepo.save(review).getId();
    }

    public ReviewResponseDTO getReview(int productId){
        User user = this.getAuthenticatedUser();
        log.info("Fetching review for product ID: {} by user: {}", productId, user.getUsername());

        var resultReview = reviewRepo.findByUserIdAndProductId(user.getId(),productId);

        if (resultReview.isEmpty()) {
            log.debug("No review found for user {} on product {}", user.getUsername(), productId);
            return null;
        }

        Review review = resultReview.get();
        log.debug("Review retrieved - Rating: {}, Comment length: {}", review.getRating(), review.getComment().length());

        ReviewResponseDTO responseDTO = new ReviewResponseDTO();

        responseDTO.setComment(review.getComment());
        responseDTO.setRating(review.getRating());
        responseDTO.setUpdatedAt(review.getUpdatedAt());
        responseDTO.setUserName(user.getUsername());
        responseDTO.setProductId(productId);

        return responseDTO;
    }

    public PageResponseDTO<ReviewResponseDTO> getReviewsOfProductPage(int productId,int page, int size){
        log.info("Fetching reviews for product ID: {} - Page: {}, Size: {}", productId, page, size);

        Pageable pageable = PageRequest.of(page, size);

        Page<Review> reviews = reviewRepo.findByProductId(productId,pageable);
        log.debug("Found {} reviews for product {} (Page {} of {})",
            reviews.getNumberOfElements(), productId, page, reviews.getTotalPages());

        List<ReviewResponseDTO> content = getReviewsOfProduct(reviews);

        PageResponseDTO<ReviewResponseDTO> result = new PageResponseDTO<>();
        result.setContent(content);
        result.setLast(reviews.isLast());
        result.setPage(reviews.getNumber());
        result.setSize(reviews.getSize());
        result.setTotalPages(reviews.getTotalPages());
        result.setTotalElements(reviews.getTotalElements());

        return result;
    }

    private List<ReviewResponseDTO> getReviewsOfProduct(Page<Review> reviews){
        List<ReviewResponseDTO> result = new ArrayList<>();
        for(Review review: reviews){
            ReviewResponseDTO dto = new ReviewResponseDTO();

            dto.setProductId(review.getProduct().getId());
            dto.setComment(review.getComment());
            dto.setRating(review.getRating());
            dto.setUpdatedAt(review.getUpdatedAt());
            dto.setUserName(review.getUserName());

            result.add(dto);
        }
        return result;
    }

    @Transactional
    public String deleteReview(int productId){
        User user = this.getAuthenticatedUser();
        log.info("Deleting review for product ID: {} by user: {}", productId, user.getUsername());

        Product product = productRepo.findById(productId).orElseThrow(
                () -> new ProductNotFoundException("Product Not Found",productId)
        );

        Review review = reviewRepo.findByUserIdAndProductId(user.getId(),productId).orElseThrow(
                () -> new ReviewNotFoundException("No Review Found")
        );

        double totalRating = product.getRating() * product.getReviewCount();
        totalRating -= review.getRating();

        int newReviewCount = product.getReviewCount() - 1;
        double newRating = (newReviewCount == 0)? 0.0 : totalRating / newReviewCount;

        product.setReviewCount(newReviewCount);
        product.setRating(newRating);
        log.debug("Product rating recalculated - Product: {}, New Rating: {}, New Count: {}",
            product.getProductName(), newRating, newReviewCount);

        reviewRepo.delete(review);
        productRepo.save(product);
        log.info("Review deleted successfully - Product: {}, User: {}", product.getProductName(), user.getUsername());

        return "Success";
    }

}

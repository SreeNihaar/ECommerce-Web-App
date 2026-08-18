package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Integer> {

    Optional<Review> findByUserIdAndProductId(Integer userId,Integer productId);

    Page<Review> findByProductId(Integer productId, Pageable pageable);
}

package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Integer> {
    Optional<Cart> findByUserUsername(String username);

    Optional<Cart> findByUserId(int userId);
}

package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartProductRepository extends JpaRepository<CartProduct,Integer> {
    Optional<CartProduct> findByCartIdAndProductId(int cartId, int productId);
}

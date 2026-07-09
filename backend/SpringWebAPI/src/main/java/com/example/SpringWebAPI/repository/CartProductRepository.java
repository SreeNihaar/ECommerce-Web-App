package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartProductRepository extends JpaRepository<CartProduct,Integer> {

}

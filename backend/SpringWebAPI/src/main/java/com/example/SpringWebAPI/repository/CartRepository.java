package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Integer> {

    Optional<Cart> findByUserUsername(String username);
}

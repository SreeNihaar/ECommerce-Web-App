package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findAllByUserUsername(String username);

}

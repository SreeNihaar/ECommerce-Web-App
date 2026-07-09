package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {

    @Query("SELECT t FROM Transaction t WHERE t.order.id = :orderId ORDER BY t.createdAt DESC LIMIT 1 ")
    Optional<Transaction> findLatestTransaction(@Param("orderId") int orderId);


    List<Transaction> findAllByOrderByIdAsc(int id);
}

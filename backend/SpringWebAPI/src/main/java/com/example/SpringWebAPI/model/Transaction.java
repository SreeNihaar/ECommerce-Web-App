package com.example.SpringWebAPI.model;

import com.example.SpringWebAPI.model.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    private long id;

    private TransactionStatus transactionStatus;

    private double amount;

    private String failureReason;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

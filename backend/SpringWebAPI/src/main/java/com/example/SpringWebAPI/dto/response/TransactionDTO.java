package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    String transactionId;

    String transactionStatus;

    Double amount;

    String failureReason;

    int orderId;

    Instant createdAt;

    Instant updatedAt;
}

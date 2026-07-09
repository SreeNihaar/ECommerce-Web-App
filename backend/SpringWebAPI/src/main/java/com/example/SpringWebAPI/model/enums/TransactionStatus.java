package com.example.SpringWebAPI.model.enums;

public enum TransactionStatus {
    SUCCESS,
    // Payment Received
    FAILURE,
    // Payment Not Received
    PENDING,
    // Payment under Processing
    CANCELLED,
    // Customer canceled Payment
}

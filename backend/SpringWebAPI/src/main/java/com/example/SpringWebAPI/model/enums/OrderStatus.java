package com.example.SpringWebAPI.model.enums;

public enum OrderStatus {
    PAYMENT_PENDING,
    // Order is Created, but not paid yet
    SHIPPED,
    // Payment Received & Item is dispatched from warehouse
    COMPLETED,
    // Order is delivered and finished
    PAYMENT_COMPLETED,
    // Payment is received & Order is being packed
    CANCELLED,
    // Order is cancelled
}

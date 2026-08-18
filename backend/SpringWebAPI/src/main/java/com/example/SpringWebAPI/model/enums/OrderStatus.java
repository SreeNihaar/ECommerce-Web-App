package com.example.SpringWebAPI.model.enums;

public enum OrderStatus {

    CANCELLED(-1),      // Order is canceled
    PAYMENT_PENDING(0), // Order is Created, but not paid yet
    PROCESSING(1),      // Payment is received & Order is being packed
    SHIPPED(2),         // Payment Received & Item is dispatched from warehouse
    DELIVERED(3);       // Order is delivered and finished


    private final int priority;

    OrderStatus(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}

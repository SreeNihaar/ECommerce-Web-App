package com.example.SpringWebAPI.exception;

public class InvalidMerchantException extends RuntimeException {
    public InvalidMerchantException(String message) {
        super(message);
    }
}

package com.example.SpringWebAPI.exception;

public class MerchantRequestNotFoundException extends RuntimeException {
    public MerchantRequestNotFoundException(String message) {
        super(message);
    }
}

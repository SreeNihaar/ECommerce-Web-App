package com.example.SpringWebAPI.exception;

public class MerchantNotAuthorizedException extends RuntimeException {
    public MerchantNotAuthorizedException(String message) {
        super(message);
    }
}

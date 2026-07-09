package com.example.SpringWebAPI.exception;

public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException(String message,String id) {
        super(message+id);
    }
}

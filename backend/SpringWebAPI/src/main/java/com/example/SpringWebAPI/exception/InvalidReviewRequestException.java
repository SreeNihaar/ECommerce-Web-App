package com.example.SpringWebAPI.exception;

public class InvalidReviewRequestException extends RuntimeException {
    public InvalidReviewRequestException(String message) {
        super(message);
    }
}

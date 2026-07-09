package com.example.SpringWebAPI.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message, int id) {
        super(message+id);
    }
}

package com.example.SpringWebAPI.exception;

public class AccessDeniedException extends RuntimeException{
    public AccessDeniedException(String message) {
        super("Hi "+message);
    }
}

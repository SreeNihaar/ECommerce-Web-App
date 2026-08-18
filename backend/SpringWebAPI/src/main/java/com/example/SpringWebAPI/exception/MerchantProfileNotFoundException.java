package com.example.SpringWebAPI.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MerchantProfileNotFoundException extends RuntimeException {
    public MerchantProfileNotFoundException(String message) {
        super(message);
    }
}

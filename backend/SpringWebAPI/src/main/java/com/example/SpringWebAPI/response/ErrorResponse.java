package com.example.SpringWebAPI.response;

import java.time.Instant;

public class ErrorResponse {
    public String errorMessage;
    public Instant timestamp;

    public ErrorResponse(String errorMessage){
        this.errorMessage=errorMessage;
        this.timestamp=Instant.now();
    }
}

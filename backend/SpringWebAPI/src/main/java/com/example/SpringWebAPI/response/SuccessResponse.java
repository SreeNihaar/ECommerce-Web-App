package com.example.SpringWebAPI.response;

import java.time.Instant;

public class SuccessResponse<T> {
        public String message;
        public Instant timestamp;
        public T body;

        public SuccessResponse(String message, T body){
            this.message=message;
            this.timestamp=Instant.now();
            this.body=body;
        }
}

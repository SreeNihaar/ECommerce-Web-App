package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JWTResponseDTO {
    String accessToken;
    Date expiration;
    String username;
}


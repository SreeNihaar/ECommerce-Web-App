package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JWTResponseDTO {
    String accessToken;
    Date expiration;
    String username;
    List<String> roles = new ArrayList<>();

    public void appendRole(String role){
        roles.add(role);
    }
}

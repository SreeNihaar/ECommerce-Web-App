package com.example.SpringWebAPI.dto.request;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    String username;
    String password;
}


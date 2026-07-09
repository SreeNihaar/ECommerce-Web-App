package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSignUpRequestDTO {
    String username;
    String password;

    String firstname;
    String lastname;
    String address;
}

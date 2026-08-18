package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditProfileRequestDTO {
    String username;
    String firstname;
    String lastname;
    String phonenumber;
    String address;
}

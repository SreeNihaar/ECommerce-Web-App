package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponseDTO {
    String username;
    String firstname;
    String lastname;
    String phonenumber;
    String address;
    List<String> roles = new ArrayList<>();

}

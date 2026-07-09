package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserResponseDTO {

    public int userId;
    public String username;
    public String firstName;
    public String lastName;

    public List<String> roles;

    public List<Integer> orderIds;

}

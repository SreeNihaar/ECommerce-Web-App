package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCollection {
    Integer userId;
    String username;
    Instant createdAt;
    Instant updatedAt;
    int totalOrders;
}

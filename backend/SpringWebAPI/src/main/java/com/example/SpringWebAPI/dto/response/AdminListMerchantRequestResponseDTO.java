package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminListMerchantRequestResponseDTO {
    int requestId;

    String username;

    String status;

    Instant createdAt;
}

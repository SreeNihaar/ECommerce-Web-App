package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantRequestResponseDTO {
    int requestId;

    String username;

    private String legalBusinessName;

    private String gstNumber;

    private String contactNumber;

    private String description;

    private String status;

    Instant createdAt;

    Instant updatedAt;
}

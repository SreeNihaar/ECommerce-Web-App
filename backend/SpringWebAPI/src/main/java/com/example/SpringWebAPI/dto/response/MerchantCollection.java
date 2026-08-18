package com.example.SpringWebAPI.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantCollection {
    int id;
    String legalBusinessName;
    Integer totalProducts;
    String businessPhone;
    Instant createdAt;
    @JsonProperty("isApproved")
    boolean isApproved;
}

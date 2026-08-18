package com.example.SpringWebAPI.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminMerchantProfileDTO {
    int id;
    String legalBusinessName;
    String gstNumber;
    String businessPhone;
    String accountNumber;
    int userId;
    String userName;
    int totalProducts;
    @JsonProperty("isApproved")
    boolean isApproved;
}

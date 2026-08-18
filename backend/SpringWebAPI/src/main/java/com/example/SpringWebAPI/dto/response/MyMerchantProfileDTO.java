package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyMerchantProfileDTO {
    int merchantId;
    String legalBusinessName;
    String gstNumber;
    String businessPhone;
    String accountNumber;

}

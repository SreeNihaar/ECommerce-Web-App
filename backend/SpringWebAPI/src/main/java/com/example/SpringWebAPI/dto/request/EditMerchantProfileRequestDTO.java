package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditMerchantProfileRequestDTO {
    String legalBusinessName;
    String gstNumber;
    String businessPhone;
    String accountNumber;
}

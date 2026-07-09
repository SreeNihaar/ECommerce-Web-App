package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantRequestDTO {

    private String username;

    private String legalBusinessName;

    private String gstNumber;

    private String contactNumber;

    private String description;
}

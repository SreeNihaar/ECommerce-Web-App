package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopMerchantDTO {
    private Integer merchantId;
    private String merchantName;
    private Double totalRevenue;
    private Long orderCount;
}

package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDataDTO {
    private String label;
    private Double totalRevenue;
    private Long orderCount;
}

package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryAnalyticsResponseDTO {
    private String category;
    private Double totalRevenue;
    private Long orderCount;
    private Long itemsSold;

}

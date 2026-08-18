package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseByIdDTO {
    Integer id;
    String productName;

    String category;
    String description;
    String merchantName;

    Double price;
    Double rating;
    Integer reviewCount;
    Integer stock;

    String imageKey;
}

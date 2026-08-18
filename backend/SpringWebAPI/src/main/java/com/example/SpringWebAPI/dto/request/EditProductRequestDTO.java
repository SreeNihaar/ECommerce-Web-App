package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditProductRequestDTO {
    private String productName;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
}

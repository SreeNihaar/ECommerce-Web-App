package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO {
    Integer id;
    String productName;

    String category;
    Double price;
    Integer quantity;
    Double rating;
    String imageName;
    String imageType;
    byte[] imageData;
}

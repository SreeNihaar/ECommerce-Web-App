package com.example.SpringWebAPI.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ProductRequestDTO {
    Integer id;
    String productName;

    String category;
    Double price;
    Double rating;
    String imageName;
    String imageType;
    byte[] imageData;
}

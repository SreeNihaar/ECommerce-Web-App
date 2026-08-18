package com.example.SpringWebAPI.dto.internal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantProductDTO {
    Integer productId;
    String productName;
    Integer stock;
    Double priceAtPurchase;
}

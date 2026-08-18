package com.example.SpringWebAPI.dto.internal;

import com.example.SpringWebAPI.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantOrderProductFlatDTO {
    Integer orderId;
    Integer productId;
    String productName;
    Integer stock;
    Double priceAtPurchase;
    Instant updatedAt;
    Instant orderDate;
    OrderStatus orderStatus;
}

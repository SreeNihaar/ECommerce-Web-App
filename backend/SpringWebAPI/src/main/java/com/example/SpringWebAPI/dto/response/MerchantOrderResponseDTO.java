package com.example.SpringWebAPI.dto.response;

import com.example.SpringWebAPI.dto.internal.MerchantProductDTO;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MerchantOrderResponseDTO {
    Integer orderId;
    OrderStatus orderStatus;
    List<MerchantProductDTO> products;
    Instant updatedAt;
    Instant orderDate;
    Double totalAmount;
}

package com.example.SpringWebAPI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManyOrderResponseDTO {
        Integer orderId;
        String orderStatus;
        Instant orderDate;
        double totalPrice;
        String latestTransactionId;
        String latestTransactionStatus;

        List<OrderProductDTO> products = new ArrayList<>();

        public void addOrderProductDTO(OrderProductDTO productDTO){
            products.add(productDTO);
        }
}

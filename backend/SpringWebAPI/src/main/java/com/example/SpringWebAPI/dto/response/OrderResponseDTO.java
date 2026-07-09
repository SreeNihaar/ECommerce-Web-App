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
public class OrderResponseDTO {
    Integer orderId;
    String userName;
    Double totalPrice;
    Instant orderDate;
    String orderStatus;

    List<TransactionDTO> transactions = new ArrayList<>();

    List<OrderProductDTO> products = new ArrayList<>();

    public void addOrderProductDTO(OrderProductDTO dto){
        products.add(dto);
    }

    public void addTransactionDTO(TransactionDTO dto){
        transactions.add(dto);
    }
}

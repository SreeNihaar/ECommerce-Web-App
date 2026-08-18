package com.example.SpringWebAPI.dto.request;

import com.example.SpringWebAPI.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderStatusRequestDTO {
    Integer orderId;
    OrderStatus orderStatus;
}

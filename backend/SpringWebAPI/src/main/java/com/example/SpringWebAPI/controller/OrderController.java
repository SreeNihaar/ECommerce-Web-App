package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.PaymentStatusResponseDTO;
import com.example.SpringWebAPI.dto.request.CheckoutItemRequestDTO;
import com.example.SpringWebAPI.dto.request.PaymentRequestDTO;
import com.example.SpringWebAPI.dto.response.ManyOrderResponseDTO;
import com.example.SpringWebAPI.dto.response.MerchantOrderResponseDTO;
import com.example.SpringWebAPI.dto.response.OrderResponseDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.OrderProductService;
import com.example.SpringWebAPI.service.OrderService;
import com.example.SpringWebAPI.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    private final OrderProductService orderProductService;

    private final TransactionService transactionService;

    public OrderController(OrderService orderService,TransactionService transactionService,OrderProductService orderProductService){
        this.orderService=orderService;
        this.transactionService=transactionService;
        this.orderProductService=orderProductService;
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<Integer>> checkoutOrder(@RequestBody List<CheckoutItemRequestDTO> items){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        int orderId = orderService.createOrder(userName,items);

        return ResponseEntity.status(201).body(
                new SuccessResponse<>("Successfully created Order",orderId)
        );
    }

    @GetMapping({ "" , "/" })
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<List<ManyOrderResponseDTO>>> getAllMyOrders(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        List<ManyOrderResponseDTO> result = orderService.getAllMyOrdersDTO(userName);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Successfully fetched the Orders",result)
        );
    }

    @GetMapping({"/{id}","/{id}/"})
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<OrderResponseDTO>> getMyOrder(@PathVariable("id") int id){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        OrderResponseDTO result = orderService.getOrderByIdDTO(userName,id);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Found Order Successfully",
                result
        ));
    }

    @PostMapping("/payment")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<PaymentStatusResponseDTO>> paymentStatus(@RequestBody PaymentRequestDTO payment){
        PaymentStatusResponseDTO response = transactionService.createTransaction(payment.getOrderId(),payment.getAmount());

        return ResponseEntity.status(201).body(
                new SuccessResponse<>(
                        "Transaction Created. ",
                        response
                )
        );
    }

    @GetMapping("/merchant/my_orders")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<MerchantOrderResponseDTO>>> getMerchantOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int size){
        PageResponseDTO<MerchantOrderResponseDTO> response = orderProductService.getMerchantOrdersPageable(page-1, size);
        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Fetched the Merchant Orders",
                response
        ));
    }

}

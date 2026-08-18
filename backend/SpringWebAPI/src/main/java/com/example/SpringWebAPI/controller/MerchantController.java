package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.EditMerchantProfileRequestDTO;
import com.example.SpringWebAPI.dto.request.UpdateOrderStatusRequestDTO;
import com.example.SpringWebAPI.dto.response.MyMerchantProfileDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.MerchantService;
import com.example.SpringWebAPI.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchant")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/profile")
    public ResponseEntity<SuccessResponse<MyMerchantProfileDTO>> getMyMerchantProfile(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        MyMerchantProfileDTO response = merchantService.getMyProfile(userName);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched Merchant Profile Successfully",response
                )
        );
    }

    @PatchMapping({ "/profile/edit" , "/profile/edit/" })
    public ResponseEntity<SuccessResponse<String>> editMerchantProfile(@RequestBody EditMerchantProfileRequestDTO requestDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null){
            throw new RuntimeException("Un-Authorized");
        }
        String userName = authentication.getName();
        merchantService.editMerchantDetails(requestDTO,userName);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Updated User successfully",
                "Success"
        ));
    }

    @PatchMapping({ "/orders/update-status", "/orders/update-status/" })
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<String>> updateOrderStatus(@RequestBody UpdateOrderStatusRequestDTO requestDTO) {
        String merchantUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        orderService.updateOrderStatus(requestDTO.getOrderId(), requestDTO.getOrderStatus(), merchantUsername);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Order status updated successfully",
                "Success"
        ));
    }
}

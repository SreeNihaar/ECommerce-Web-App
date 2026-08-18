package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.response.*;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.MerchantService;
import com.example.SpringWebAPI.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    private final MerchantService merchantService;

    public AdminController(UserService userService, MerchantService merchantService){
        this.userService=userService;
        this.merchantService=merchantService;
    }

    // GET ALL Users
    @GetMapping({"/users","/users/"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<UserCollection>>> getUsers(@RequestParam(value = "page", defaultValue = "1") int page,
                                                                                     @RequestParam(value = "size",defaultValue = "8") int size){
        PageResponseDTO<UserCollection> result = userService.getAllUsers(page-1,size);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Users Fetched Successfully",
                result
        ));
    }


    @GetMapping({"/users/{id}"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProfileResponseDTO>> getUserById(@PathVariable("id") int userId){
        ProfileResponseDTO result = userService.getUserById(userId);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "User "+userId+" Fetched Successfully",
                result
        ));
    }

    @GetMapping("/merchants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<MerchantCollection>>> getMerchants(@RequestParam(value = "page", defaultValue = "1") int page,
                                                           @RequestParam(value = "size",defaultValue = "8") int size){
        PageResponseDTO<MerchantCollection> result = merchantService.getAllMerchants(page-1,size);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Fetched All Merchants' Details",
                result
        ));
    }

    @PatchMapping("/merchants/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<String>> setApprovalStatus(@PathVariable("id") int merchantId){
        String message = merchantService.changeApprovalStatus(merchantId);
        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Changed the Status",
                message
        ));
    }

    @GetMapping("/merchants/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<AdminMerchantProfileDTO>> getMerchantById(@PathVariable("id") int merchantId){
        AdminMerchantProfileDTO result = merchantService.getMerchantById(merchantId);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Fetched Merchant Details of id: "+merchantId,
                result
        ));
    }

}

package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.response.CategoryAnalyticsResponseDTO;
import com.example.SpringWebAPI.dto.response.TopProductDTO;
import com.example.SpringWebAPI.exception.InvalidMerchantException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.repository.MerchantRepository;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.MerchantAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/my/analytics/")
public class MerchantAnalyticsController {

    private final MerchantRepository merchantRepo;

    private final MerchantAnalyticsService analyticsService;

    public MerchantAnalyticsController(MerchantRepository merchantRepo, MerchantAnalyticsService analyticsService){
        this.merchantRepo=merchantRepo;
        this.analyticsService=analyticsService;
    }

    private Merchant validateMerchant(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        Merchant merchant = merchantRepo.findByUserUsername(userName).orElseThrow(()->
                new InvalidMerchantException("Invalid Merchant")
        );

        if(!merchant.isApproved()){
            throw new InvalidMerchantException("Invalid Merchant. Contact Admin");
        }
        return merchant;
    }

    @GetMapping("/category-sales")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<List<CategoryAnalyticsResponseDTO>>> getCategorySales(@RequestParam(value = "status", required = false) String status){

        Merchant merchant = this.validateMerchant();

        List<CategoryAnalyticsResponseDTO> result = analyticsService.getCategorySales(merchant.getMerchantId(), status);

        if(status==null){
            status="COMPLETED";
        }
        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Successfully fetched the Category Sales of Order Status: "+ status.toUpperCase(),result)
        );
    }

    @GetMapping("/top-products")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<List<TopProductDTO>>> getTopProducts(
            @RequestParam(value = "count", required = false, defaultValue = "10") Integer count){
        Merchant merchant = this.validateMerchant();

        List<TopProductDTO> result = analyticsService.getTopProducts(merchant.getMerchantId(),count);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Successfully Fetched the Top "+count+" Products",result)
        );
    }
}

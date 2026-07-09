package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.response.RevenueDataDTO;
import com.example.SpringWebAPI.dto.response.TopMerchantDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics/")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    public AdminAnalyticsController(AdminAnalyticsService analyticsService){
        this.analyticsService=analyticsService;
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<List<RevenueDataDTO>>> getRevenueRange(
            @RequestParam(required = false, value = "month") Integer month,
            @RequestParam(required = false, value = "year") Integer year){
        List<RevenueDataDTO> result = analyticsService.getRevenue(month,year);

        return ResponseEntity.status(200).body( new SuccessResponse<>(
                "Successfully Fetched the Revenue",
                result
            )
        );
    }

    @GetMapping("/top_merchants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<List<TopMerchantDTO>>> getTopMerchant(
            @RequestParam(required = false, defaultValue = "10", value = "count") Integer count
    ){
        List<TopMerchantDTO> result = analyticsService.getTopMerchants(count);

        return ResponseEntity.status(200).body( new SuccessResponse<>(
                "Successfully Fetched Top "+count+" Merchants",
                result
            )
        );
    }
}

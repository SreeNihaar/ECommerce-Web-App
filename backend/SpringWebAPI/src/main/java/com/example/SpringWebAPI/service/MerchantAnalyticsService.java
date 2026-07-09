package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.response.CategoryAnalyticsResponseDTO;
import com.example.SpringWebAPI.dto.response.TopProductDTO;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.repository.MerchantAnalyticsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MerchantAnalyticsService {

    private final MerchantAnalyticsRepository analyticsRepo;

    public MerchantAnalyticsService(MerchantAnalyticsRepository analyticsRepo){
        this.analyticsRepo=analyticsRepo;
    }

    private boolean isValidString(String status){
        int size = status.length();
        for(int i=0;i<size;i++){
            char ch = status.charAt(i);
            if(!(('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || (ch == '_'))){
                return false;
            }
        }
        return true;
    }

    public List<CategoryAnalyticsResponseDTO> getCategorySales(int id, String status){
        OrderStatus orderStatus = OrderStatus.COMPLETED;

        if(status!=null && isValidString(status)){
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        }

        List<CategoryAnalyticsResponseDTO> result = analyticsRepo.getCategoryAnalytics(id, orderStatus);
        return result;
    }

    public List<TopProductDTO> getTopProducts(Integer merchantId,int count){
        Pageable pageable = PageRequest.of(0, count);

        List<TopProductDTO> result = analyticsRepo.getTopSellingProducts(merchantId,pageable);

        return result;
    }

}

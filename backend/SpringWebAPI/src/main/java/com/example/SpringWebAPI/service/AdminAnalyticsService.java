package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.response.RevenueDataDTO;
import com.example.SpringWebAPI.dto.response.SimpleOrderDTO;
import com.example.SpringWebAPI.dto.response.TopMerchantDTO;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.repository.AdminAnalyticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminAnalyticsService {
    private final AdminAnalyticsRepository analyticsRepo;

    public AdminAnalyticsService(AdminAnalyticsRepository analyticsRepo){
        this.analyticsRepo=analyticsRepo;
    }

    public List<RevenueDataDTO> getRevenue(Integer month, Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<SimpleOrderDTO> orders = analyticsRepo.getOrdersForMonth(m, y);

        Map<Integer, RevenueDataDTO> weekGroups = new LinkedHashMap<>();

        for (SimpleOrderDTO order : orders) {
            LocalDate date = order.getOrderDate()
                    .atZone(ZoneOffset.UTC)
                    .toLocalDate();

            int weekOfMonth = date.get(ChronoField.ALIGNED_WEEK_OF_MONTH);
            String label = "Week " + weekOfMonth;

            weekGroups.putIfAbsent(weekOfMonth, new RevenueDataDTO(label, 0.0, 0L));
            RevenueDataDTO week = weekGroups.get(weekOfMonth);
            week.setTotalRevenue(week.getTotalRevenue() + order.getTotalPrice());
            week.setOrderCount(week.getOrderCount() + 1);
        }

        return new ArrayList<>(weekGroups.values());
    }

    public List<TopMerchantDTO> getTopMerchants(int count) {
        return analyticsRepo.getTopMerchants(count);
    }

}

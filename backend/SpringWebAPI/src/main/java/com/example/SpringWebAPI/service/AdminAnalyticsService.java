package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.response.RevenueDataDTO;
import com.example.SpringWebAPI.dto.response.SimpleOrderDTO;
import com.example.SpringWebAPI.dto.response.TopMerchantDTO;
import com.example.SpringWebAPI.repository.AdminAnalyticsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AdminAnalyticsService {
    private final AdminAnalyticsRepository analyticsRepo;

    public AdminAnalyticsService(AdminAnalyticsRepository analyticsRepo){
        this.analyticsRepo=analyticsRepo;
    }

    public List<RevenueDataDTO> getRevenue(Integer month, Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        log.info("Fetching revenue analytics - Month: {}, Year: {}", m, y);
        List<SimpleOrderDTO> orders = analyticsRepo.getOrdersForMonth(m, y);
        log.debug("Retrieved {} orders for month {}/{}", orders.size(), m, y);

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

        List<RevenueDataDTO> result = new ArrayList<>(weekGroups.values());
        log.debug("Revenue data processed - Total weeks: {}, Total orders: {}", result.size(), orders.size());
        return result;
    }

    public List<TopMerchantDTO> getTopMerchants(int count) {
        log.info("Fetching top {} merchants by revenue", count);
        List<TopMerchantDTO> topMerchants = analyticsRepo.getTopMerchants(count);
        log.debug("Retrieved {} top merchants", topMerchants.size());
        return topMerchants;
    }

}

package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.dto.response.SimpleOrderDTO;
import com.example.SpringWebAPI.dto.response.TopMerchantDTO;
import com.example.SpringWebAPI.model.Order;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminAnalyticsRepository extends JpaRepository<Order,Integer> {
    @Query("""
    SELECT new com.example.SpringWebAPI.dto.response.SimpleOrderDTO(
        o.orderDate,
        o.totalPrice,
        o.id
    ) 
    FROM Order o
    WHERE MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year
         AND( o.orderStatus = com.example.SpringWebAPI.model.enums.OrderStatus.PAYMENT_COMPLETED OR
              o.orderStatus = com.example.SpringWebAPI.model.enums.OrderStatus.COMPLETED )
    ORDER BY o.orderDate ASC
""")
    List<SimpleOrderDTO> getOrdersForMonth(
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("""
    SELECT new com.example.SpringWebAPI.dto.response.TopMerchantDTO(
        m.merchantId,
        m.legalBusinessName,
        SUM(o.totalPrice),
        COUNT(DISTINCT o.id)
    )
    FROM Order o
    JOIN OrderProduct op ON o.id = op.order.id
    JOIN Product p ON op.product.productId = p.productId
    JOIN Merchant m ON p.merchant.merchantId = m.merchantId
    WHERE o.orderStatus = com.example.SpringWebAPI.model.enums.OrderStatus.PAYMENT_COMPLETED OR
          o.orderStatus = com.example.SpringWebAPI.model.enums.OrderStatus.COMPLETED
    GROUP BY m.merchantId, m.legalBusinessName
    ORDER BY SUM(o.totalPrice) DESC
    LIMIT :count
""")
    List<TopMerchantDTO> getTopMerchants(@Param("count") int count);
}

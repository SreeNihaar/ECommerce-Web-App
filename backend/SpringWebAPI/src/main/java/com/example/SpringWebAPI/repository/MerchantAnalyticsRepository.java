package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.dto.response.CategoryAnalyticsResponseDTO;
import com.example.SpringWebAPI.dto.response.TopProductDTO;
import com.example.SpringWebAPI.model.OrderProduct;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchantAnalyticsRepository extends JpaRepository<OrderProduct,Integer> {
    @Query("""
    SELECT
    new com.example.SpringWebAPI.dto.response.CategoryAnalyticsResponseDTO(
        p.category,
        SUM(op.priceAtPurchase * op.stock),
        COUNT(DISTINCT o.id),
        SUM(op.stock)
    )
    FROM OrderProduct op
    JOIN op.product p
    JOIN op.order o
    WHERE p.merchant.id = :merchantId
      AND o.orderStatus = :status
    GROUP BY p.category
    ORDER BY SUM(op.priceAtPurchase * op.stock) DESC
""")
    List<CategoryAnalyticsResponseDTO> getCategoryAnalytics(@Param("merchantId") int merchantId, @Param("status") OrderStatus status);

    @Query("""
    SELECT new com.example.SpringWebAPI.dto.response.TopProductDTO(
        p.id,
        p.productName,
        SUM(op.stock)
    )
    FROM OrderProduct op
    JOIN op.product p
    WHERE p.merchant.id = :merchantId
    GROUP BY p.id, p.productName
    ORDER BY SUM(op.stock) DESC
    """)
    List<TopProductDTO> getTopSellingProducts(@Param("merchantId") int merchantId, Pageable pageable);
}

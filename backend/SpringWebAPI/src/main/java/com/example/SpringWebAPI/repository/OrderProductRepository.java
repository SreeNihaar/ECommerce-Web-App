package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.dto.internal.MerchantOrderProductFlatDTO;
import com.example.SpringWebAPI.model.OrderProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Integer> {
    @Query("""
    SELECT new com.example.SpringWebAPI.dto.internal.MerchantOrderProductFlatDTO(
        op.order.id,
        op.product.id,
        op.product.productName,
        op.stock,
        op.priceAtPurchase,
        op.order.updatedAt,
        op.order.createdAt,
        op.order.orderStatus
    )
    FROM OrderProduct op
    WHERE op.product.merchant.id = :merchantId
      AND EXISTS (
          SELECT t
          FROM Transaction t
          WHERE t.order = op.order
            AND t.transactionStatus = com.example.SpringWebAPI.model.enums.TransactionStatus.SUCCESS
            AND t.createdAt = (
                SELECT MAX(t2.createdAt)
                FROM Transaction t2
                WHERE t2.order = op.order
            )
      )
    ORDER BY op.order.createdAt DESC
""")
    List<MerchantOrderProductFlatDTO> findSuccessfulOrderProductsForMerchant(
            @Param("merchantId") Integer merchantId
    );

    @Query("""
    SELECT new com.example.SpringWebAPI.dto.internal.MerchantOrderProductFlatDTO(
        op.order.id,
        op.product.id,
        op.product.productName,
        op.stock,
        op.priceAtPurchase,
        op.order.updatedAt,
        op.order.createdAt,
        op.order.orderStatus
    )
    FROM OrderProduct op
    WHERE op.product.merchant.id = :merchantId
      AND EXISTS (
          SELECT t
          FROM Transaction t
          WHERE t.order = op.order
            AND t.transactionStatus = com.example.SpringWebAPI.model.enums.TransactionStatus.SUCCESS
            AND t.createdAt = (
                SELECT MAX(t2.createdAt)
                FROM Transaction t2
                WHERE t2.order = op.order
            )
      )
    ORDER BY op.order.createdAt DESC
""")
    Page<MerchantOrderProductFlatDTO> findSuccessfulOrderProductsForMerchantPageable(
            @Param("merchantId") Integer merchantId,
            Pageable pageable
    );
}

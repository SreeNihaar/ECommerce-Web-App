package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {

    Page<Product> findAll(Pageable pageable);

    Page<Product> findAllByMerchant_Id(Integer merchantId, Pageable pageable);

    @Query(""" 
            SELECT
            new com.example.SpringWebAPI.dto.response.ProductResponseDTO(p.id,p.productName,p.category,p.price,p.stock,p.rating,p.reviewCount,p.imageKey) 
            FROM Product p
            WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%',:keyword,'%'))
            OR LOWER(p.category) LIKE LOWER(CONCAT('%',:keyword,'%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%',:keyword,'%'))
     """)
    Page<ProductResponseDTO> searchByKeyword(@Param("keyword") String keyword,Pageable pageable);
}

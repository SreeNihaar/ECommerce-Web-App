package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer> {

    Page<Product> findAll(Pageable pageable);

    @Query(""" 
            SELECT
            new com.example.SpringWebAPI.dto.response.ProductResponseDTO(p.productId,p.productName,p.category,p.price,p.stock,p.rating,p.imageName,p.imageType,p.imageData) 
            FROM Product p
            WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%',:keyword,'%'))
            OR LOWER(p.category) LIKE LOWER(CONCAT('%',:keyword,'%'))
            OR LOWER(p.description) LIKE LOWER(CONCAT('%',:keyword,'%'))
     """)
    List<ProductResponseDTO> searchByKeyword(String keyword);
}

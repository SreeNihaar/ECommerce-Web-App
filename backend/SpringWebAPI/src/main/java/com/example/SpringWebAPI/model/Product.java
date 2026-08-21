package com.example.SpringWebAPI.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "prod_seq")
    @SequenceGenerator(name = "prod_seq", sequenceName = "prod_seq", allocationSize = 1,initialValue = 101)
    private Integer id;
    private String productName;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
    
    @Column(nullable = false)
    @ColumnDefault("0.0")
    private Double rating = 0.0;
    
    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer reviewCount = 0;

    //Image
    private String imageKey;

    @ManyToOne(fetch = FetchType.LAZY)
    private Merchant merchant;

    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderProduct> orderProducts;

    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

}

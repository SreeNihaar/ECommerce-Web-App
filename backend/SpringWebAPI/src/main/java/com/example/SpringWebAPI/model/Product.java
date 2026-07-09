package com.example.SpringWebAPI.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
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
    private Integer productId;
    private String productName;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
    private Double rating;

    //Image
    // private String image_s3_url; // Need to replace it after creating the S3
    private String imageName;
    private String imageType;
    private byte[] imageData;

    @ManyToOne(fetch = FetchType.LAZY)
    private Merchant merchant;

    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderProduct> orderProducts;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

}

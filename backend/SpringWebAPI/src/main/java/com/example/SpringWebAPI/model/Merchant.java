package com.example.SpringWebAPI.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int merchantId;

    private String legalBusinessName;

    private boolean isApproved;

    private String gstNumber;

    private String businessPhone;

    private String accountNumber;

    @OneToMany(mappedBy = "merchant",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<Product> products = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public void addProduct(Product prod){
        if(products.contains(prod)){
            return;
        }
        prod.setMerchant(this);
        products.add(prod);
    }

}

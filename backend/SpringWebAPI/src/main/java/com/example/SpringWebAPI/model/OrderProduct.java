package com.example.SpringWebAPI.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_prod_seq")
    @SequenceGenerator(name="order_prod_seq", sequenceName = "order_prod_seq", allocationSize = 1)
    private int id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private double priceAtPurchase;

    private int stock;
}

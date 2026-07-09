package com.example.SpringWebAPI.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"product", "cart"})
public class CartProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "cart_prod_seq")
    @SequenceGenerator(name = "cart_prod_seq", sequenceName = "cart_prod_seq", allocationSize = 1)
    private int id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id",nullable = false)
    private Cart cart;

    private int quantity;

    public void changeQuantity(int quantity){
        this.quantity+=quantity;
    }

}

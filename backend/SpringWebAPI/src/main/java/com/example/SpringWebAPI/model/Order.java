package com.example.SpringWebAPI.model;

import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.model.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_seq", allocationSize = 1)
    private int id;

    @ManyToOne(fetch=FetchType.LAZY)
    private User user;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Transaction> transactions = new ArrayList<>();

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderProduct> orderProducts = new ArrayList<>();

    private double totalPrice;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Column(nullable = false)
    private OrderStatus orderStatus;

    public void addOrderProduct(OrderProduct item){
        item.setOrder(this);
        setOrderStatus(OrderStatus.PAYMENT_PENDING);
        orderProducts.add(item);
    }

    public void addTransaction(Transaction transaction){
        if(transaction.getTransactionStatus() == TransactionStatus.CANCELLED || transaction.getTransactionStatus() == TransactionStatus.FAILURE ){
            orderStatus=OrderStatus.CANCELLED;
        }
        else if(transaction.getTransactionStatus() == TransactionStatus.PENDING){
            orderStatus=OrderStatus.PAYMENT_PENDING;
        }
        else if(transaction.getTransactionStatus() == TransactionStatus.SUCCESS){
            orderStatus=OrderStatus.PROCESSING;
        }
        else{
            throw new RuntimeException("Invalid Transaction Status");
        }
        transaction.setOrder(this);
        transactions.add(transaction);
    }

    public void updateOrderStatus() {
        OrderStatus minStatus = orderProducts.stream()
                .map(OrderProduct::getProductStatus)
                .min(Comparator.comparingInt(OrderStatus::getPriority))
                .orElse(OrderStatus.PAYMENT_PENDING);

        this.orderStatus = minStatus;
    }

}

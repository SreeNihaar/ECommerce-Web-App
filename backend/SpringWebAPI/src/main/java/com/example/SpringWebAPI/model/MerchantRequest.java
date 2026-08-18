package com.example.SpringWebAPI.model;

import com.example.SpringWebAPI.model.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MerchantRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "merchant_request_seq")
    @SequenceGenerator(name="merchant_request_seq", sequenceName = "merchant_request_seq", allocationSize = 1)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String legalBusinessName;

    private String gstNumber;

    private String contactNumber;

    private String description;

    private RequestStatus status=RequestStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

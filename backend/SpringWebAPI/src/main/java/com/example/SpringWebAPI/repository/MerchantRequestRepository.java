package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.MerchantRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchantRequestRepository extends JpaRepository<MerchantRequest, Integer> {

}

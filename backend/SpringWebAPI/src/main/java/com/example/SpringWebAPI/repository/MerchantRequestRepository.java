package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.MerchantRequest;
import com.example.SpringWebAPI.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchantRequestRepository extends JpaRepository<MerchantRequest, Integer> {
    List<MerchantRequest> findByUser(User user);

    Page<MerchantRequest> findByUserUsername(Pageable pageable, String username);
}

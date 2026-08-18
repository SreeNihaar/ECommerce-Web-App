package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MerchantRepository  extends JpaRepository<Merchant, Integer> {
    Optional<Merchant> findByUserUsername(String username);


}

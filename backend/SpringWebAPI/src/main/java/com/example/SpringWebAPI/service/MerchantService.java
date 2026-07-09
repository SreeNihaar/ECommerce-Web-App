package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.repository.MerchantRepository;
import org.springframework.stereotype.Service;

@Service
public class MerchantService {

    private final MerchantRepository repo;

    public MerchantService(MerchantRepository repo){
        this.repo=repo;
    }

    public int saveMerchantUser(Merchant merchant){
        Merchant result = repo.save(merchant);
        return result.getMerchantId();
    }

}

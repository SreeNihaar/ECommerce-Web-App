package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.EditMerchantProfileRequestDTO;
import com.example.SpringWebAPI.dto.response.AdminMerchantProfileDTO;
import com.example.SpringWebAPI.dto.response.MerchantCollection;
import com.example.SpringWebAPI.dto.response.MyMerchantProfileDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.exception.MerchantNotAuthorizedException;
import com.example.SpringWebAPI.exception.MerchantProfileNotFoundException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.repository.MerchantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class MerchantService {

    private final MerchantRepository merchantRepo;

    public MerchantService(MerchantRepository repo){
        this.merchantRepo=repo;
    }

    public int saveMerchantUser(Merchant merchant){
        log.info("Saving merchant profile - Business Name: {}", merchant.getLegalBusinessName());
        Merchant result = merchantRepo.save(merchant);
        log.debug("Merchant saved with ID: {}", result.getId());
        return result.getId();
    }

    public MyMerchantProfileDTO getMyProfile(String userName){
        log.info("Fetching merchant profile for user: {}", userName);
        Merchant merchant = merchantRepo.findByUserUsername(userName).orElseThrow(()->new MerchantProfileNotFoundException("No Merchant Found"));

        if(!merchant.isApproved()){
            log.warn("Merchant profile access attempt for non-approved merchant - User: {}", userName);
            throw new MerchantNotAuthorizedException("Merchant is not Approved. Contact Admin");
        }
        log.debug("Merchant profile retrieved - ID: {}, Business: {}", merchant.getId(), merchant.getLegalBusinessName());
        MyMerchantProfileDTO dto = new MyMerchantProfileDTO();

        dto.setMerchantId(merchant.getId());
        dto.setAccountNumber(merchant.getAccountNumber());
        dto.setBusinessPhone(merchant.getBusinessPhone());
        dto.setLegalBusinessName(merchant.getLegalBusinessName());
        dto.setGstNumber(merchant.getGstNumber());

        return dto;
    }

    public void editMerchantDetails(EditMerchantProfileRequestDTO dto, String userName){
        log.info("Updating merchant profile for user: {}", userName);
        Merchant merchant = merchantRepo.findByUserUsername(userName).orElseThrow(()-> new MerchantProfileNotFoundException("No Merchant Found"));

        if(!merchant.isApproved()){
            log.warn("Merchant profile update attempt for non-approved merchant - User: {}", userName);
            throw new MerchantNotAuthorizedException("Merchant is not Approved. Contact Admin");
        }

        merchant.setGstNumber(dto.getGstNumber());
        merchant.setBusinessPhone(dto.getBusinessPhone());
        merchant.setAccountNumber(dto.getAccountNumber());
        merchant.setLegalBusinessName(dto.getLegalBusinessName());

        log.debug("Merchant profile updated - Business: {}, Phone: {}, GST: {}",
            dto.getLegalBusinessName(), dto.getBusinessPhone(), dto.getGstNumber());
        merchantRepo.save(merchant);
        log.info("Merchant profile saved successfully for user: {}", userName);
    }

    public PageResponseDTO<MerchantCollection> getAllMerchants(int page, int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<Merchant> merchants = merchantRepo.findAll(pageable);

        PageResponseDTO<MerchantCollection> result = new PageResponseDTO<>();
        List<MerchantCollection> content = new ArrayList<>();
        for(Merchant merchant: merchants){
            MerchantCollection obj = new MerchantCollection();
            obj.setId(merchant.getId());
            obj.setApproved(merchant.isApproved());
            obj.setBusinessPhone(merchant.getBusinessPhone());
            obj.setTotalProducts(merchant.getProducts().size());
            obj.setLegalBusinessName(merchant.getLegalBusinessName());
            obj.setCreatedAt(merchant.getCreatedAt());
            content.add(obj);
        }

        result.setContent(content);
        result.setLast(merchants.isLast());
        result.setPage(merchants.getNumber());
        result.setSize(merchants.getSize());
        result.setTotalPages(merchants.getTotalPages());
        result.setTotalElements(merchants.getTotalElements());
        return result;
    }

    public AdminMerchantProfileDTO getMerchantById(int merchantId){
        log.info("Fetching merchant by ID: {}", merchantId);

        Merchant merchant = merchantRepo.findById(merchantId).orElseThrow(
                () -> new MerchantProfileNotFoundException("Merchant of id: "+merchantId+" Not Found")
        );
        log.debug("Merchant found - Business: {}, Approved: {}", merchant.getLegalBusinessName(), merchant.isApproved());

        AdminMerchantProfileDTO result = new AdminMerchantProfileDTO();
        result.setId(merchant.getId());
        result.setApproved(merchant.isApproved());
        result.setUserId(merchant.getUser().getId());
        result.setUserName(merchant.getUser().getUsername());
        result.setAccountNumber(merchant.getAccountNumber());
        result.setTotalProducts(merchant.getProducts().size());
        result.setGstNumber(merchant.getGstNumber());
        result.setLegalBusinessName(merchant.getLegalBusinessName());
        result.setBusinessPhone(merchant.getBusinessPhone());

        return result;
    }

    public String changeApprovalStatus(int merchantId){
        log.info("Changing approval status for merchant ID: {}", merchantId);
        Merchant merchant = merchantRepo.findById(merchantId).orElseThrow(
                () -> new MerchantProfileNotFoundException("Merchant of id: "+merchantId+" Not Found")
        );

        boolean newStatus = !merchant.isApproved();
        merchant.setApproved(newStatus);
        merchantRepo.save(merchant);
        log.info("Merchant approval status updated - ID: {}, Business: {}, New Status: {}",
            merchantId, merchant.getLegalBusinessName(), newStatus);
        return "Successfully Changed the Approval Status";
    }

}

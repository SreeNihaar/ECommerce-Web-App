package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.MerchantRequestDTO;
import com.example.SpringWebAPI.dto.request.UpdateStatusRequestDTO;
import com.example.SpringWebAPI.dto.response.*;
import com.example.SpringWebAPI.exception.AccessDeniedException;
import com.example.SpringWebAPI.exception.MerchantRequestNotFoundException;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.model.MerchantRequest;
import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.model.enums.RequestStatus;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.repository.MerchantRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class MerchantRequestService extends ParentService{

    private final MerchantRequestRepository merchantRequestRepo;

    private final RoleService roleService;

    private final MerchantService merchantService;

    public MerchantRequestService(MerchantRequestRepository merchantRequestRepo,
                                  RoleService roleService,
                                  MerchantService merchantService){
        this.merchantRequestRepo=merchantRequestRepo;
        this.roleService=roleService;
        this.merchantService=merchantService;
    }

    private MerchantRequest getMerchantRequestById(int id){
        return merchantRequestRepo.findById(id).orElseThrow( () ->
                new MerchantRequestNotFoundException("Requested Merchant Request Not Found" )
        );
    }

    // Create a merchant account with given Merchant Request
    private int createMerchantAccount(MerchantRequest request){
        Merchant merchant = new Merchant();

        Role role = roleService.getRole(UserRole.MERCHANT);
        merchant.setApproved(true);

        merchant.setUser(request.getUser());
        merchant.setLegalBusinessName(request.getLegalBusinessName());
        merchant.setBusinessPhone(request.getContactNumber());
        merchant.setGstNumber(request.getGstNumber());

        merchant.getUser().appendRole(role);

        return merchantService.saveMerchantUser(merchant);
    }

    public PageResponseDTO<ListMerchantRequestResponseDTO> getAllRequests(int page, int size){
        log.info("Fetching all merchant requests - Page: {}, Size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);

        Page<MerchantRequest> merchantRequests = merchantRequestRepo.findAll(pageable);
        log.debug("Found {} merchant requests (Total: {}, Page {} of {})",
            merchantRequests.getNumberOfElements(), merchantRequests.getTotalElements(),
            page, merchantRequests.getTotalPages());

        PageResponseDTO<ListMerchantRequestResponseDTO> result = new PageResponseDTO<>();
        result.setLast(merchantRequests.isLast());
        result.setPage(merchantRequests.getNumber());
        result.setSize(merchantRequests.getSize());
        result.setTotalPages(merchantRequests.getTotalPages());
        result.setTotalElements(merchantRequests.getTotalElements());

        List<ListMerchantRequestResponseDTO> content = new ArrayList<>();

        for(MerchantRequest merchantRequest: merchantRequests){
            ListMerchantRequestResponseDTO dto = new ListMerchantRequestResponseDTO();

            dto.setRequestId(merchantRequest.getId());
            dto.setUsername(merchantRequest.getUser().getUsername());
            dto.setStatus(merchantRequest.getStatus().toString());
            dto.setCreatedAt(merchantRequest.getCreatedAt());

            content.add(dto);
        }

        result.setContent(content);
        return result;
    }

    public PageResponseDTO<ListMerchantRequestResponseDTO> getMyMerchantRequests(int page,int size){
        User user = this.getAuthenticatedUser();
        log.info("Fetching merchant requests for user: {} - Page: {}, Size: {}", user.getUsername(), page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<MerchantRequest> merchantRequests = merchantRequestRepo.findByUserUsername(pageable,user.getUsername());
        log.debug("Found {} merchant requests for user: {} (Page {} of {})",
            merchantRequests.getTotalElements(), user.getUsername(), page, merchantRequests.getTotalPages());

        PageResponseDTO<ListMerchantRequestResponseDTO> result = new PageResponseDTO<>();
        result.setLast(merchantRequests.isLast());
        result.setPage(merchantRequests.getNumber());
        result.setSize(merchantRequests.getSize());
        result.setTotalPages(merchantRequests.getTotalPages());
        result.setTotalElements(merchantRequests.getTotalElements());

        List<ListMerchantRequestResponseDTO> content = new ArrayList<>();

        for(MerchantRequest merchantRequest: merchantRequests){
            ListMerchantRequestResponseDTO dto = new ListMerchantRequestResponseDTO();

            dto.setRequestId(merchantRequest.getId());
            dto.setUsername(merchantRequest.getUser().getUsername());
            dto.setStatus(merchantRequest.getStatus().toString());
            dto.setGstNumber(merchantRequest.getGstNumber());
            dto.setContactNumber(merchantRequest.getContactNumber());
            dto.setCreatedAt(merchantRequest.getCreatedAt());

            content.add(dto);
        }

        result.setContent(content);
        return result;
    }

    public int postRoleRequest(MerchantRequestDTO requestDTO) throws UsernameNotFoundException {
        User user = this.getAuthenticatedUser();
        log.info("New merchant request submitted by user: {} - Business: {}", user.getUsername(), requestDTO.getLegalBusinessName());

        MerchantRequest request = new MerchantRequest();

        request.setUser(user);
        request.setContactNumber(requestDTO.getContactNumber());
        request.setStatus(RequestStatus.PENDING);
        request.setGstNumber(requestDTO.getGstNumber());
        request.setLegalBusinessName(requestDTO.getLegalBusinessName());
        request.setDescription(requestDTO.getDescription());

        MerchantRequest savedRequest = merchantRequestRepo.save(request);
        log.debug("Merchant request saved - Request ID: {}, User: {}, Status: PENDING", savedRequest.getId(), user.getUsername());
        return savedRequest.getId();
    }

    public MerchantRequestResponseDTO getMerchantRequestByIdDTO(int id, boolean isAdmin){
        User user = this.getAuthenticatedUser();
        log.info("Fetching merchant request - ID: {}, User: {}, IsAdmin: {}", id, user.getUsername(), isAdmin);

        MerchantRequest request = merchantRequestRepo.findById(id).orElseThrow(
                () -> new MerchantRequestNotFoundException("Merchant Request Id: "+id+" Not Found")
        );

        if(!isAdmin && !request.getUser().getUsername().equals(user.getUsername())){
            log.warn("Unauthorized merchant request access - Request ID: {}, User: {}, RequestOwner: {}",
                id, user.getUsername(), request.getUser().getUsername());
            throw new AccessDeniedException("User is Not Allowed");
        }
        log.debug("Merchant request retrieved - ID: {}, Status: {}, Business: {}",
            id, request.getStatus(), request.getLegalBusinessName());

        MerchantRequestResponseDTO response = new MerchantRequestResponseDTO();

        response.setRequestId(request.getId());
        response.setUsername(request.getUser().getUsername());
        response.setDescription(request.getDescription());
        response.setGstNumber(request.getGstNumber());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        response.setContactNumber(request.getContactNumber());
        response.setLegalBusinessName(request.getLegalBusinessName());
        response.setStatus(request.getStatus().toString());

        return response;
    }

    @Transactional
    public String updateStatus(int id, UpdateStatusRequestDTO statusRequest){
        log.info("Updating merchant request status - Request ID: {}, New Status: {}", id, statusRequest.getStatus());

        String status=statusRequest.getStatus().toUpperCase();

        RequestStatus statusEnum = RequestStatus.valueOf(status);

        MerchantRequest request = this.getMerchantRequestById(id);

        if (request.getStatus() == RequestStatus.APPROVED) {
            log.warn("Attempt to update already approved request - Request ID: {}", id);
            throw new RuntimeException("Request already approved");
        }

        request.setStatus(statusEnum);
        log.debug("Request status changed - ID: {}, Previous: PENDING, New: {}", id, statusEnum);

        MerchantRequest savedRequest = merchantRequestRepo.save(request);
        if(savedRequest.getStatus() == RequestStatus.APPROVED){
            int merchantId = createMerchantAccount(request);
            log.info("Merchant account created - Request ID: {}, Merchant ID: {}, User: {}",
                id, merchantId, request.getUser().getUsername());
            return "Created Merchant Account Successfully, merchant Id: "+merchantId;
        }

        log.debug("Request status updated to: {} - Request ID: {}", savedRequest.getStatus(), id);
        return savedRequest.getStatus().toString();
    }

}

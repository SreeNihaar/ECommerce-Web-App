package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.MerchantRequestDTO;
import com.example.SpringWebAPI.dto.request.UpdateStatusRequestDTO;
import com.example.SpringWebAPI.dto.response.ListMerchantRequestResponseDTO;
import com.example.SpringWebAPI.dto.response.MerchantRequestResponseDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.MerchantRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/merchant_requests")
public class MerchantRequestController {

    private final MerchantRequestService merchantRequestService;

    public MerchantRequestController(MerchantRequestService merchantRequestService){
        this.merchantRequestService=merchantRequestService;
    }

    // CONSUMER

    @PostMapping({"/new_merchant_request"})
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<Integer>> postNewMerchantRequest(@RequestBody MerchantRequestDTO request){
        int id = merchantRequestService.postRoleRequest(request);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "New Request Successfully posted.",
                id
        ));
    }

    @GetMapping("/my_requests")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<ListMerchantRequestResponseDTO>>> getMyMerchantRequests(@RequestParam(value = "page",defaultValue = "1") int page,
                                                                                                                @RequestParam(value = "size",defaultValue = "5") int size){
        PageResponseDTO<ListMerchantRequestResponseDTO> result = merchantRequestService.getMyMerchantRequests(page-1,size);
        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Successfully Fetched my Merchant Requests",
                result
        ));

    }

    @GetMapping("/my_requests/{id}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<MerchantRequestResponseDTO>> getMerchantRequestByIdConsumer(@PathVariable("id") int id){

        MerchantRequestResponseDTO response = merchantRequestService.getMerchantRequestByIdDTO(id,false);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Found Merchant Request Succesfully",
                response
        ));
    }

    // ADMIN

    // GET ALL Merchant Requests
    @GetMapping({ "/" , "" })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<ListMerchantRequestResponseDTO>>> getMerchantRequests(@RequestParam(value = "page",defaultValue = "1") int page,
                                                                                                                @RequestParam(value = "size",defaultValue = "8") int size){
        PageResponseDTO<ListMerchantRequestResponseDTO> result = merchantRequestService.getAllRequests(page-1,size);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Successfully Fetched Merchant Request",
                result
        ));
    }

    // GET The Merchant Request with Request id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<MerchantRequestResponseDTO>> getMerchantRequestByIdAdmin(@PathVariable("id") int id){
        MerchantRequestResponseDTO response = merchantRequestService.getMerchantRequestByIdDTO(id,true);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Found Merchant Request Succesfully",
                response
        ));
    }

    // Update the Merchant Request Status and call function to create a merchant account
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<String>> postStatus(@PathVariable int id,@RequestBody UpdateStatusRequestDTO statusRequest){

        String status = merchantRequestService.updateStatus(id,statusRequest);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Updated Status Successfully",
                status
        ));
    }

}

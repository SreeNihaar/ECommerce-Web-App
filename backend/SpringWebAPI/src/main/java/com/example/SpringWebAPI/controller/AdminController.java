package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.response.AdminListMerchantRequestResponseDTO;
import com.example.SpringWebAPI.dto.response.MerchantRequestResponseDTO;
import com.example.SpringWebAPI.dto.response.AdminUserResponseDTO;
import com.example.SpringWebAPI.dto.request.UpdateStatusRequestDTO;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.model.enums.RequestStatus;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.MerchantService;
import com.example.SpringWebAPI.service.RoleService;
import com.example.SpringWebAPI.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService){
        this.userService=userService;
    }

    // GET ALL Users
    @GetMapping({"/users","/users/"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<List<AdminUserResponseDTO>>> getUsers(){
        List<User> result = userService.findAllUsers();
        List<AdminUserResponseDTO> responseDTOS = new ArrayList<>();

        if(result.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "No users Found",
                    responseDTOS
            ));
        }

        for(User user: result){
            AdminUserResponseDTO response = new AdminUserResponseDTO();

            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());

            List<String> roles=new ArrayList<>();
            List<Role> userRoles = user.getRoles();
            for(Role iter: userRoles){
                roles.add(iter.getRoleName().name());
            }
            response.setRoles(roles);

            List<Integer> orderIds = new ArrayList<>();
            List<Order> orders = user.getOrders();
            for(Order iter: orders){
                orderIds.add(iter.getId());
            }
            response.setOrderIds(orderIds);

            responseDTOS.add(response);
        }

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Users Fetched Successfully",
                responseDTOS
        ));
    }


    // GET ALL Merchant Requests
    @GetMapping("/merchant_requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<List<AdminListMerchantRequestResponseDTO>>> getMerchantRequests(){
        List<MerchantRequest> requests = userService.getAllRequests();
        List<AdminListMerchantRequestResponseDTO> responseDTOList = new ArrayList<>();

        String message = "";
        if(requests.isEmpty()){
            message = "No Merchant Requests";
        }
        else{
            message = "Found "+requests.size()+" Merchant Request(s)";
        }

        for(MerchantRequest req: requests){
            AdminListMerchantRequestResponseDTO obj = new AdminListMerchantRequestResponseDTO();
            obj.setRequestId(req.getRequestId());
            obj.setUsername(req.getUser().getUsername());
            obj.setStatus(req.getStatus().toString());
            obj.setCreatedAt(req.getCreatedAt());

            responseDTOList.add(obj);
        }

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                message,
                responseDTOList
        ));
    }

    // GET The Merchant Request with Request id
    @GetMapping("/merchant_requests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<MerchantRequestResponseDTO>> getMerchantRequestById(@PathVariable("id") int id){

        MerchantRequestResponseDTO response = userService.getMerchantRequestByIdDTO(id);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Found Merchant Request Succesfully",
                response
        ));
    }

    // Update the Merchant Request Status and call function to create a merchant account
    @PatchMapping("/merchant_requests/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<String>> postStatus(@PathVariable int id,@RequestBody UpdateStatusRequestDTO statusRequest){

        String status = userService.updateStatus(id,statusRequest);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Updated Status Successfully",
                status
        ));
    }

}

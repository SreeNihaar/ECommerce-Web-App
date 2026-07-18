package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.MerchantRequestDTO;
import com.example.SpringWebAPI.dto.response.MyCartResponseDTO;
import com.example.SpringWebAPI.dto.response.ProfileResponseDTO;
import com.example.SpringWebAPI.model.Cart;
import com.example.SpringWebAPI.model.CartProduct;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.CartRepository;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service){
        this.service=service;
    }

    @GetMapping({ "/{id}" , "/{id}/" })
    public ResponseEntity<SuccessResponse<User>> getUserById(@RequestParam int id){
        User user = service.getUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched the User Successfully",
                user
        ));
    }

    @GetMapping({"/myprofile"})
    public ResponseEntity<SuccessResponse<ProfileResponseDTO>> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null){
            throw new RuntimeException("Un-Authorized");
        }
        String userName = authentication.getName();
        ProfileResponseDTO responseDTO = service.getMyProfile(userName);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched My Profile Successfully.",
                responseDTO
        ));
    }

    @GetMapping({"/mycart","/mycart/"})
    public ResponseEntity<SuccessResponse<List<MyCartResponseDTO>>> getMyCart(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        List<MyCartResponseDTO> result = service.getMyCart(userName);

        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched Cart Details",
                result
        ));
    }

    @PostMapping({ "/" , "" })
    public ResponseEntity<SuccessResponse<Integer>> addUser(@RequestBody User user){
        int id = service.addUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<>(
                "Created User Successfully.",
                id
        ));
    }

    @PatchMapping({ "/{id}/edit" , "/{id}/edit/" })
    public ResponseEntity<SuccessResponse<Integer>> editUser(@RequestParam int id, @RequestBody User user){
        service.updateUserById(user,id);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Updated User successfully",
                id
        ));
    }

    @DeleteMapping({ "/{id}" , "/{id}/" })
    public ResponseEntity<SuccessResponse<Integer>> deleteUser(@RequestParam int id){
        service.deleteUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Deleted User Successfully",
                id
        ));
    }

    @PostMapping({"/new_merchant_request"})
    @PreAuthorize("hasRole('ROLE_CONSUMER')")
    public ResponseEntity<SuccessResponse<Integer>> postNewMerchantRequest(@RequestBody MerchantRequestDTO request){
        int id = service.postRoleRequest(request);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "New Request Successfully posted.",
                id
        ));
    }

}

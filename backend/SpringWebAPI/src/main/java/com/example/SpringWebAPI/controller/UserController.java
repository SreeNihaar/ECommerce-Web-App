package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.EditProfileRequestDTO;
import com.example.SpringWebAPI.dto.response.*;
import com.example.SpringWebAPI.exception.UnAuthorizedException;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SuccessResponse<ProfileResponseDTO>> getUserById(@PathVariable("id") int id){
        ProfileResponseDTO response = service.getUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Fetched the User Successfully",
                response
        ));
    }


    @GetMapping({"/myprofile"})
    public ResponseEntity<SuccessResponse<ProfileResponseDTO>> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null){
            throw new UnAuthorizedException("User is Unauthorized. Please Login/SignUp.");
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

    @PatchMapping({ "/myprofile/edit" , "/myprofile/edit/" })
    public ResponseEntity<SuccessResponse<String>> editUser(@RequestBody EditProfileRequestDTO requestDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null){
            throw new RuntimeException("Un-Authorized");
        }
        String userName = authentication.getName();
        service.editUserDetails(requestDTO,userName);
        return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                "Updated User successfully",
                "Success"
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

}

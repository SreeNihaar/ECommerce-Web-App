package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.UserSignUpRequestDTO;
import com.example.SpringWebAPI.exception.UsernameAlreadyExistsException;
import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.RoleService;
import com.example.SpringWebAPI.service.UserSignUpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignUpController {

    private final PasswordEncoder encoder;

    private final UserSignUpService userService;

    private final RoleService roleService;

    public SignUpController(PasswordEncoder encoder,
                            UserSignUpService userService,
                            RoleService roleService){
        this.encoder=encoder;
        this.userService=userService;
        this.roleService=roleService;
    }

    @PostMapping("/api/signup")
    public ResponseEntity<SuccessResponse<Integer>> signupMethod(@RequestBody UserSignUpRequestDTO userReq) throws UsernameAlreadyExistsException{
        if(userService.isUsernameExists(userReq.getUsername())){
            throw new UsernameAlreadyExistsException("Username already Exists");
        }

        User user= new User();
        Role role = roleService.getRole(UserRole.CONSUMER);

        user.setUsername(userReq.getUsername());
        user.setPassword(encoder.encode(userReq.getPassword()));
        user.setFirstName(userReq.getFirstname());
        user.setLastName(userReq.getLastname());
        user.setAddress(userReq.getAddress());
        user.appendRole(role);

        userService.saveUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<Integer>("Succesfully added user",user.getUserId()));
    }

}

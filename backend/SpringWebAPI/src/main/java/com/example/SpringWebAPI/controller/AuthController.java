package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.LoginRequestDTO;
import com.example.SpringWebAPI.dto.request.UserSignUpRequestDTO;
import com.example.SpringWebAPI.dto.response.JWTResponseDTO;
import com.example.SpringWebAPI.exception.UsernameAlreadyExistsException;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService=authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SuccessResponse<JWTResponseDTO>> signupMethod(@RequestBody UserSignUpRequestDTO userReq) throws UsernameAlreadyExistsException{

        JWTResponseDTO responseDTO = authService.createUser(userReq);

        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<>(
                "Succesfully Created User Account",
                responseDTO)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<JWTResponseDTO>> loginMethod(@RequestBody LoginRequestDTO requestDTO){

        JWTResponseDTO responseDTO = authService.verify(requestDTO);

        return ResponseEntity.status(200).body(new SuccessResponse<>(
                "Successfully Logged In",
                responseDTO
        ));
    }

}


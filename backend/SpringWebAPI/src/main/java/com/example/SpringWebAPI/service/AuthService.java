package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.LoginRequestDTO;
import com.example.SpringWebAPI.dto.request.UserSignUpRequestDTO;
import com.example.SpringWebAPI.dto.response.JWTResponseDTO;
import com.example.SpringWebAPI.exception.UsernameAlreadyExistsException;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepo;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    private final RoleService roleService;

    private final PasswordEncoder encoder;

    public AuthService(PasswordEncoder encoder,UserRepository userRepo, AuthenticationManager authenticationManager,JWTService jwtService, RoleService roleService){
        this.encoder=encoder;
        this.userRepo=userRepo;
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;
        this.roleService=roleService;
    }

    @Transactional
    public JWTResponseDTO createUser(UserSignUpRequestDTO userReq){

        if(isUsernameExists(userReq.getUsername())){
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

        User savedUser = userRepo.save(user);

        String jwtToken = jwtService.generateToken(savedUser.getUsername());

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(savedUser, null, savedUser.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        JWTResponseDTO result = new JWTResponseDTO();
        result.setAccessToken(jwtToken);
        result.setExpiration(jwtService.extractExpiration(jwtToken));
        result.setUsername(savedUser.getUsername());
        result.appendRole(role.toString());

        return result;
    }

    public JWTResponseDTO verify(LoginRequestDTO request){
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));

            if(authentication.isAuthenticated()){
                String token = jwtService.generateToken(request.getUsername());
                JWTResponseDTO responseDTO = new JWTResponseDTO();
                responseDTO.setAccessToken(token);
                responseDTO.setUsername(jwtService.extractUsername(token));
                responseDTO.setExpiration(jwtService.extractExpiration(token));
                return responseDTO;
            }
            throw new UsernameNotFoundException("Username or Password Incorrect");
    }

    public boolean isUsernameExists(String username){
        return userRepo.existsByUsername(username);
    }
}
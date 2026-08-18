package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    public CustomUserDetailsService(UserRepository userRepo){
        this.userRepo=userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Loading user details for username: {}", username);
        User user = userRepo.findByUsername(username).
                orElseThrow(()-> {
                    log.warn("User not found during loadUserByUsername: {}", username);
                    return new UsernameNotFoundException("User "+username+" Not Found");
                });

        log.debug("User loaded successfully - Username: {}, ID: {}", username, user.getId());
        return user;
    }
}

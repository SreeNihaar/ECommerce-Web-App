package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserSignUpService implements UserDetailsService {

    private final UserRepository userRepo;

    public UserSignUpService(UserRepository userRepo){
        this.userRepo=userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username).
                orElseThrow(()-> new UsernameNotFoundException("User "+username+" Not Found"));

        return user;
    }

    public void saveUser(User user){
        userRepo.save(user);
    }

    public boolean isUsernameExists(String username){
        return userRepo.existsByUsername(username);
    }
}

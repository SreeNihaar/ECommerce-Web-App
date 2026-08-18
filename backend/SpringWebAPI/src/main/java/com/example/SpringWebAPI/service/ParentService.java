package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.exception.UnAuthorizedException;
import com.example.SpringWebAPI.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public abstract class ParentService {

    protected User getAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication==null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken){
            log.warn("Unauthorized access attempt - Authentication: {}", authentication != null ? authentication.getClass().getSimpleName() : "null");
            throw new UnAuthorizedException("User is Not Authenticated");
        }
        User user = (User) authentication.getPrincipal();
        log.debug("Authenticated user retrieved - Username: {}", user.getUsername());
        return user;
    }

}

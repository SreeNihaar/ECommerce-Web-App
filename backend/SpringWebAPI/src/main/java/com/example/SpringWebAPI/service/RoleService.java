package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.repository.RoleRepository;
import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.enums.UserRole;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RoleService {

    private final RoleRepository roleRepo;

    public RoleService(RoleRepository roleRepo){
        this.roleRepo=roleRepo;
    }

    public Role getRole(UserRole role){
        log.debug("Fetching role: {}", role);
        Role roleObj = roleRepo.findByRoleName(role);
        if (roleObj != null) {
            log.debug("Role found - ID: {}, Name: {}", roleObj.getId(), role);
        } else {
            log.warn("Role not found: {}", role);
        }
        return roleObj;
    }

    public int saveRole(Role role){
        log.info("Saving role: {}", role.getRoleName());
        roleRepo.save(role);
        log.debug("Role saved with ID: {}", role.getId());
        return role.getId();
    }
}

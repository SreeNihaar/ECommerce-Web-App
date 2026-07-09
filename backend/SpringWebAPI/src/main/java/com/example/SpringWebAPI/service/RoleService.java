package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.repository.RoleRepository;
import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.enums.UserRole;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private final RoleRepository roleRepo;

    public RoleService(RoleRepository roleRepo){
        this.roleRepo=roleRepo;
    }

    public Role getRole(UserRole role){
        Role roleObj = roleRepo.findByRoleName(role);
        return roleObj;
    }

    public int saveRole(Role role){
        roleRepo.save(role);
        return role.getRoleId();
    }
}

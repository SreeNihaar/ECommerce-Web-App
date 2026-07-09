package com.example.SpringWebAPI.repository;

import com.example.SpringWebAPI.model.Role;
import com.example.SpringWebAPI.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Integer> {

    Role findByRoleName(UserRole role);
}

package com.example.SpringWebAPI.model;

import com.example.SpringWebAPI.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
public class Role {
    @Id
    @Getter
    @Setter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    @Enumerated(EnumType.STRING)
    @Getter
    @Setter
    @Column(unique = true, nullable = false)
    private UserRole roleName;

    @Getter
    @Setter
    private String roleDescription;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private List<User> users;
}

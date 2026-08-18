package com.example.SpringWebAPI.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name="user_seq", sequenceName = "user_seq", allocationSize = 1)
    private int id;

    @Column(unique = true,nullable = false)
    private String username;

    private String password;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private String address;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
    private List<MerchantRequest> merchantRequests;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        if(roles==null){
            return List.of();
        }
        List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>(List.of());
        roles.forEach(role->{
            authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getRoleName().name().toUpperCase()));
        });
        return authorities;
    }

    public boolean appendRole(Role role){

        for(Role iter: roles){
            if(iter.getRoleName() == role.getRoleName()){
                return false;
            }
        }
        roles.add(role);
        return true;
    }

    public void addOrder(Order order){
        orders.add(order);
        order.setUser(this);
    }


}

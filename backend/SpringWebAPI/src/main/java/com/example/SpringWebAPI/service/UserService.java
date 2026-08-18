package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.EditProfileRequestDTO;
import com.example.SpringWebAPI.dto.request.ProductToCartDTO;
import com.example.SpringWebAPI.dto.response.*;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.exception.UserNotFoundException;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.repository.*;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UserService extends ParentService{
    private final UserRepository userRepo;

    private final CartRepository cartRepo;

    private final ProductRepository productRepo;

    public UserService(UserRepository userRepo,
                       CartRepository cartRepo,
                       ProductRepository productRepo){
        this.userRepo=userRepo;
        this.cartRepo=cartRepo;
        this.productRepo=productRepo;
    }

    @Transactional
    public int addUser(User user){
        log.info("Adding new user with username: {}", user.getUsername());
        User savedUser = userRepo.save(user);
        log.debug("User saved successfully with ID: {}", savedUser.getId());
        return savedUser.getId();
    }

    public ProfileResponseDTO getMyProfile(String username){
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        ProfileResponseDTO responseDTO = new ProfileResponseDTO();

        responseDTO.setUsername(user.getUsername());
        responseDTO.setFirstname(user.getFirstName());
        responseDTO.setLastname(user.getLastName());
        responseDTO.setPhonenumber(user.getPhoneNumber());
        responseDTO.setAddress(user.getAddress());
        responseDTO.setRoles(user.getRoles().stream().map(role -> role.getRoleName().toString()).toList());

        return responseDTO;
    }

    public ProfileResponseDTO getUserById(int id){
        log.info("Fetching user profile by ID: {}", id);
        User user = userRepo.findById(id).orElseThrow(()-> new UserNotFoundException("User not found with id: ",id));

        ProfileResponseDTO result = new ProfileResponseDTO();
        result.setUsername(user.getUsername());
        result.setFirstname(user.getFirstName());
        result.setLastname(user.getLastName());
        result.setPhonenumber(user.getPhoneNumber());
        result.setAddress(user.getAddress());
        result.setRoles(user.getRoles().stream().map(role -> role.getRoleName().toString()).toList());
        result.setTotalOrders(user.getOrders().size());

        return result;
    }

    public void deleteUserById(int id){
        log.info("Deleting user with ID: {}", id);
        userRepo.deleteById(id);
        log.debug("User with ID: {} deleted successfully", id);
    }

    @Transactional
    public void editUserDetails(EditProfileRequestDTO requestDTO,String userName){
        log.info("Updating user profile for username: {}", userName);
        User user = userRepo.findByUsername(userName).orElseThrow(()-> new UsernameNotFoundException("Username Not Found"));

        user.setFirstName(requestDTO.getFirstname());
        user.setLastName(requestDTO.getLastname());
        user.setPhoneNumber(requestDTO.getPhonenumber());
        user.setAddress(requestDTO.getAddress());

        log.debug("User details updated - Name: {} {}, Phone: {}, Address: {}",
            requestDTO.getFirstname(), requestDTO.getLastname(), requestDTO.getPhonenumber(), requestDTO.getAddress());
        userRepo.save(user);
        log.debug("User profile saved successfully for username: {}", userName);
    }

    @Transactional
    public void addProductToCart(String userName, ProductToCartDTO request){
        log.info("Adding product {} to cart for user: {}, quantity: {}",
            request.getProductId(), userName, request.getQuantity());

        Cart userCart = cartRepo.findByUserUsername(userName).orElse(new Cart());

        if(userCart.getUser() == null){
            log.debug("Creating new cart for user: {}", userName);
            User user = userRepo.findByUsername(userName).orElseThrow(
                    () -> new UsernameNotFoundException("UserName not found")
            );
            userCart.setUser(user);
        }

        Product product = productRepo.findById(request.getProductId()).orElseThrow(
                () -> new ProductNotFoundException("Product Not Found",request.getProductId())
        );

        userCart.addProduct(product,request.getQuantity());
        log.debug("Product added to cart - Product ID: {}, Quantity: {}", request.getProductId(), request.getQuantity());

        cartRepo.save(userCart);
        log.debug("Cart saved successfully for user: {}", userName);
    }


    public List<MyCartResponseDTO> getMyCart(String username){
        Cart userCart = cartRepo.findByUserUsername(username).orElse(null);

        if(userCart == null){
            return List.of();
        }
        List<CartProduct> result = userCart.getItems().stream().toList();

        List<MyCartResponseDTO> responseList = new ArrayList<>();

        for(CartProduct item: result){
            MyCartResponseDTO dto = new MyCartResponseDTO();

            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getProductName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());

            responseList.add(dto);
        }
        return responseList;
    }

    public PageResponseDTO<UserCollection> getAllUsers(int page, int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepo.findAll(pageable);

        PageResponseDTO<UserCollection> result = new PageResponseDTO<>();
        result.setLast(users.isLast());
        result.setPage(users.getNumber());
        result.setSize(users.getSize());
        result.setTotalPages(users.getTotalPages());
        result.setTotalElements(users.getTotalElements());

        List<UserCollection> content = new ArrayList<>();
        for(User user: users){
            UserCollection obj = new UserCollection();
            obj.setUserId(user.getId());
            obj.setUsername(user.getUsername());
            obj.setCreatedAt(user.getCreatedAt());
            obj.setUpdatedAt(user.getUpdatedAt());
            obj.setTotalOrders(user.getOrders().size());
            content.add(obj);
        }

        result.setContent(content);

        return result;
    }

}

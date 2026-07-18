package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.MerchantRequestDTO;
import com.example.SpringWebAPI.dto.request.ProductToCartDTO;
import com.example.SpringWebAPI.dto.request.UpdateStatusRequestDTO;
import com.example.SpringWebAPI.dto.response.MerchantRequestResponseDTO;
import com.example.SpringWebAPI.dto.response.MyCartResponseDTO;
import com.example.SpringWebAPI.dto.response.ProfileResponseDTO;
import com.example.SpringWebAPI.exception.MerchantRequestNotFoundException;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.exception.UserNotFoundException;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.model.enums.RequestStatus;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.repository.*;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepo;

    private final MerchantRequestRepository roleRequestRepo;

    private final CartRepository cartRepo;

    private final ProductRepository productRepo;

    private final RoleService roleService;

    private final MerchantService merchantService;

    public UserService(UserRepository userRepo,
                       MerchantRequestRepository roleRequestRepo,
                       CartRepository cartRepo,
                       ProductRepository productRepo,
                       RoleService roleService,
                       MerchantService merchantService){
        this.userRepo=userRepo;
        this.roleRequestRepo=roleRequestRepo;
        this.cartRepo=cartRepo;
        this.productRepo=productRepo;
        this.roleService=roleService;
        this.merchantService=merchantService;
    }

    public List<User> findAllUsers(){
        return userRepo.findAll();
    }

    public int addUser(User user){
        User savedUser = userRepo.save(user);
        return savedUser.getUserId();
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

    public User getUserById(int id){
        System.out.println("Finding user by id");
        return userRepo.findById(id).orElseThrow(()-> new UserNotFoundException("User not found with id: ",id));
    }

    public void deleteUserById(int id){
        System.out.println("Deleting user");
        userRepo.deleteById(id);
    }

    public void updateUserById(User user,int id){
        System.out.println("Updating User");
        user.setUserId(id);
        userRepo.save(user);
    }

    public int postRoleRequest(MerchantRequestDTO requestDTO) throws UsernameNotFoundException{
        User user = userRepo.findByUsername(requestDTO.getUsername()).
                orElseThrow(()->new UsernameNotFoundException("Mentioned Username is not Found"));

        MerchantRequest request = new MerchantRequest();

        request.setUser(user);
        request.setContactNumber(requestDTO.getContactNumber());
        request.setStatus(RequestStatus.PENDING);
        request.setGstNumber(requestDTO.getGstNumber());
        request.setLegalBusinessName(requestDTO.getLegalBusinessName());
        request.setDescription(requestDTO.getDescription());

        MerchantRequest savedRequest = roleRequestRepo.save(request);
        return savedRequest.getRequestId();
    }

    public List<MerchantRequest> getAllRequests(){
        List<MerchantRequest> result = new ArrayList<>();
        result = roleRequestRepo.findAll();
        return result;
    }

    public MerchantRequest getMerchantRequestById(int id){
        MerchantRequest request = roleRequestRepo.findById(id).orElseThrow( () ->
                new MerchantRequestNotFoundException("Requested Merchant Request Not Found" )
        );
        return request;
    }


    @Transactional
    public String updateStatus(int id,UpdateStatusRequestDTO statusRequest){
        String status=statusRequest.getStatus().toUpperCase();

        RequestStatus statusEnum = RequestStatus.valueOf(status);

        MerchantRequest request = this.getMerchantRequestById(id);

        if (request.getStatus() == RequestStatus.APPROVED) {
            throw new RuntimeException("Request already approved");
        }

        request.setStatus(statusEnum);

        this.saveMerchantRequest(request);

        if(statusEnum == RequestStatus.APPROVED){
            return "Created Merchant Account Successfully, merchant Id: "+createMerchantAccount(request);
        }

        return statusEnum.toString();
    }

    // Create a merchant account with given Merchant Request

    private int createMerchantAccount(MerchantRequest request){
        Merchant merchant = new Merchant();

        Role role = roleService.getRole(UserRole.MERCHANT);
        merchant.setApproved(true);

        merchant.setUser(request.getUser());
        merchant.setLegalBusinessName(request.getLegalBusinessName());
        merchant.setBusinessPhone(request.getContactNumber());
        merchant.setGstNumber(request.getGstNumber());

        merchant.getUser().appendRole(role);

        return merchantService.saveMerchantUser(merchant);
    }

    public MerchantRequestResponseDTO getMerchantRequestByIdDTO(int id){
        MerchantRequest request = this.getMerchantRequestById(id);

        MerchantRequestResponseDTO response = new MerchantRequestResponseDTO();

        response.setRequestId(request.getRequestId());
        response.setUsername(request.getUser().getUsername());
        response.setDescription(request.getDescription());
        response.setGstNumber(request.getGstNumber());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        response.setContactNumber(request.getContactNumber());
        response.setLegalBusinessName(request.getLegalBusinessName());
        response.setStatus(request.getStatus().toString());

        return response;
    }

    public void saveMerchantRequest(MerchantRequest request){
        roleRequestRepo.save(request);
    }

    public void addProductToCart(String userName, ProductToCartDTO request){

        System.out.println("Inside the method");

        Cart userCart = cartRepo.findByUserUsername(userName).orElse(new Cart());

        if(userCart.getUser() == null){
            User user = userRepo.findByUsername(userName).orElseThrow(
                    () -> new UsernameNotFoundException("UserName not found")
            );;

            userCart.setUser(user);
        }

        Product product = productRepo.findById(request.getProductId()).orElseThrow(
                () -> new ProductNotFoundException("Product Not Found",request.getProductId())
        );

        userCart.addProduct(product,request.getQuantity());

        cartRepo.save(userCart); // To save the changes and Cascade takes care to save the CartProduct.
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

            dto.setProductId(item.getProduct().getProductId());
            dto.setProductName(item.getProduct().getProductName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());

            responseList.add(dto);
        }
        return responseList;
    }

}

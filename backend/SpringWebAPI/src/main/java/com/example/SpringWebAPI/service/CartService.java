package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.ProductToCartDTO;
import com.example.SpringWebAPI.dto.response.MyCartResponseDTO;
import com.example.SpringWebAPI.exception.InvalidProductRequestException;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.model.Cart;
import com.example.SpringWebAPI.model.CartProduct;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.CartProductRepository;
import com.example.SpringWebAPI.repository.CartRepository;
import com.example.SpringWebAPI.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CartService extends ParentService{
    private final CartRepository cartRepo;
    private final CartProductRepository cartProductRepo;
    private final ProductRepository productRepo;

    public CartService(CartRepository cartRepo, CartProductRepository cartProductRepo, ProductRepository productRepo){
        this.cartRepo = cartRepo;
        this.cartProductRepo = cartProductRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public void addProductToCart(ProductToCartDTO request){
        User user = this.getAuthenticatedUser();
        log.info("Adding product {} to cart for user: {} with quantity: {}",
            request.getProductId(), user.getUsername(), request.getQuantity());

        Cart userCart = cartRepo.findByUserUsername(user.getUsername()).orElse(new Cart());
        userCart.setUser(user);

        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found", request.getProductId()));

        log.debug("Adding product to cart - Product: {}, Price: {}", product.getProductName(), product.getPrice());
        userCart.addProduct(product, request.getQuantity());
        cartRepo.save(userCart);
        log.info("Product added to cart successfully for user: {}", user.getUsername());
    }

    public List<MyCartResponseDTO> getMyCart(){
        User user = this.getAuthenticatedUser();
        log.info("Fetching cart for user: {}", user.getUsername());

        Cart userCart = cartRepo.findByUserUsername(user.getUsername()).orElse(null);

        if(userCart == null){
            log.debug("No cart found for user: {}", user.getUsername());
            return List.of();
        }

        List<CartProduct> items = userCart.getItems().stream().toList();
        log.debug("Cart has {} items for user: {}", items.size(), user.getUsername());
        List<MyCartResponseDTO> responseList = new ArrayList<>();

        for(CartProduct item: items){
            MyCartResponseDTO dto = new MyCartResponseDTO();
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getProductName());
            dto.setPrice(item.getProduct().getPrice());
            dto.setQuantity(item.getQuantity());

            responseList.add(dto);
        }

        return responseList;
    }

    @Transactional
    public void updateCartItemQuantity(int productId, int newQuantity){
        log.info("Updating cart item quantity - Product ID: {}, New Quantity: {}", productId, newQuantity);

        if(newQuantity < 1){
            log.warn("Invalid quantity for cart update - Product ID: {}, Quantity: {}", productId, newQuantity);
            throw new InvalidProductRequestException("Quantity must be at least 1");
        }

        User user = this.getAuthenticatedUser();
        Cart userCart = cartRepo.findByUserUsername(user.getUsername())
                .orElseThrow(() -> new ProductNotFoundException("Cart not found", 0));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found", productId));

        if(product.getStock() < newQuantity){
            log.warn("Insufficient stock for quantity update - Product: {}, Stock: {}, Requested: {}",
                product.getProductName(), product.getStock(), newQuantity);
            throw new InvalidProductRequestException("Requested quantity exceeds available stock");
        }

        CartProduct cartItem = cartProductRepo.findByCartIdAndProductId(userCart.getId(), productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not in cart", productId));

        cartItem.setQuantity(newQuantity);
        cartProductRepo.save(cartItem);
        log.debug("Cart item quantity updated - Product: {}, User: {}, New Quantity: {}",
            product.getProductName(), user.getUsername(), newQuantity);
    }

    @Transactional
    public void removeFromCart(int productId){
        User user = this.getAuthenticatedUser();
        log.info("Removing product {} from cart for user: {}", productId, user.getUsername());

        Cart userCart = cartRepo.findByUserUsername(user.getUsername())
                .orElseThrow(() -> new ProductNotFoundException("Cart not found", 0));

        CartProduct cartItem = cartProductRepo.findByCartIdAndProductId(userCart.getId(), productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not in cart", productId));

        cartProductRepo.delete(cartItem);
        log.debug("Product {} removed from cart for user: {}", productId, user.getUsername());
    }
}

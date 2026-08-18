package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.ProductToCartDTO;
import com.example.SpringWebAPI.dto.request.UpdateCartQuantityDTO;
import com.example.SpringWebAPI.dto.response.MyCartResponseDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @PostMapping({"/{id}","/{id}/"})
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> addProductToCart(@RequestBody ProductToCartDTO request){
        cartService.addProductToCart(request);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Added Product to Cart",
                        "Product Id: "+request.getProductId())
        );
    }

    @GetMapping({"","/"})
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<List<MyCartResponseDTO>>> getMyCart(){
        List<MyCartResponseDTO> cartItems = cartService.getMyCart();
        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Cart Items",cartItems)
        );
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> updateCartItemQuantity(
            @PathVariable int productId,
            @RequestBody UpdateCartQuantityDTO request){
        cartService.updateCartItemQuantity(productId, request.getQuantity());

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Quantity Updated",
                        "Product Id: "+productId)
        );
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> removeFromCart(@PathVariable int productId){
        cartService.removeFromCart(productId);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Item Removed from Cart",
                        "Product Id: "+productId)
        );
    }
}

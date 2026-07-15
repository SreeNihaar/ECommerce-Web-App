package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.ProductRequestDTO;
import com.example.SpringWebAPI.dto.request.ProductToCartDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseByIdDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.ProductService;

import com.example.SpringWebAPI.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    // GET All Products
    @GetMapping({"","/"})
    public ResponseEntity<SuccessResponse<Page<ProductResponseDTO>>> getAllProducts(@RequestParam(defaultValue = "1") int page,
                                                                                    @RequestParam(defaultValue = "8") int size){
        Page<ProductResponseDTO> result = productService.findAll(page-1,size);
        return ResponseEntity.status(HttpStatus.OK).body(
                new SuccessResponse<>(
                        "Success",
                        result
                )
        );
    }

    // GET the Product with id
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<ProductResponseByIdDTO>> getProductById(@PathVariable int id){
        ProductResponseByIdDTO result = productService.findById(id);

        return ResponseEntity.status(HttpStatus.OK).body(
                new SuccessResponse<>(
                        "Product of id: "+id+" fetched Successfully",
                        result
                )
        );
    }

    // Add Product to Cart. Only accessible to CONSUMER
    @PostMapping({"/{id}","/{id}/"})
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<SuccessResponse<String>> addProductToCart(@RequestBody ProductToCartDTO request){

        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        System.out.println("Calling the addProductToCart");

        userService.addProductToCart(userName,request);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Added Product to Cart",
                        "Product Id: "+request.getProductId())
        );
    }

    // Add a new Product. Only accessible to MERCHANT and ADMIN
    @PostMapping("/newProduct")
    @PreAuthorize("hasAnyRole('MERCHANT','ADMIN')")
    public ResponseEntity<SuccessResponse<Integer>> addProduct(@RequestPart Product product, @RequestPart MultipartFile image) throws IOException{
            String userName = SecurityContextHolder.getContext().getAuthentication().getName();

            int id = productService.addProduct(userName,product,image);
            return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<>(
                    "Product added with id: "+id,
                    id
            ));
    }

    // Update the Product with id. Only accessible to MERCHANT and ADMIN
    @PutMapping("/{id}/update_product")
    @PreAuthorize("hasAnyRole('MERCHANT','ADMIN')")
    public ResponseEntity<SuccessResponse<Integer>> updateProduct(@RequestPart Product product, @PathVariable int id, @RequestPart MultipartFile image) throws IOException{
            productService.updateProduct(product, id,image);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<Integer>(
                    "Product with id: "+id+" Updated Successfully",
                    id
            ));
    }

    // Delete the Product with id. Only accessible to MERCHANT and ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT','ADMIN')")
    public ResponseEntity<SuccessResponse<Integer>> deleteProduct(@PathVariable int id){
            productService.deleteProduct(id);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<Integer>(
                    "Product Deleted Successfully",
                    id
            ));
    }

    // Search the Products with Keyword. (Mostly searches the products name, description and category)
    @GetMapping("/search")
    public ResponseEntity<SuccessResponse<List<ProductResponseDTO>>> searchProduct(@RequestParam String keywords){
            System.out.println("Controller: "+keywords);
            List<ProductResponseDTO> result = productService.search(keywords);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                    "Prodcuts Fetch Successfully",
                    result
            ));
    }


}

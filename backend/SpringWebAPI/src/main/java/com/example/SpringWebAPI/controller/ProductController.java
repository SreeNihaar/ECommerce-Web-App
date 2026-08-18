package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.request.EditProductRequestDTO;
import com.example.SpringWebAPI.dto.request.NewProductRequestDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseByIdDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;


    // GET All Products
    @GetMapping({"","/"})
    public ResponseEntity<SuccessResponse<PageResponseDTO<ProductResponseDTO>>> getAllProducts(@RequestParam(defaultValue = "1") int page,
                                                                                               @RequestParam(defaultValue = "8") int size){
        PageResponseDTO<ProductResponseDTO> result = productService.findAll(page-1,size);
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


    // Add a new Product. Only accessible to MERCHANT and ADMIN
    @PostMapping("/newProduct")
    @PreAuthorize("hasAnyRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<Integer>> addProduct(@RequestPart("product") NewProductRequestDTO productDto, @RequestPart("image") MultipartFile image) throws IOException{

        int id = productService.addProduct(productDto,image);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SuccessResponse<>(
                "Product added with id: "+id,
                id
        ));
    }

    // Update the Product with id. Only accessible to MERCHANT and ADMIN
    @PatchMapping("/{id}/edit")
    @PreAuthorize("hasAnyRole('MERCHANT','ADMIN')")
    public ResponseEntity<SuccessResponse<Integer>> updateProduct(@PathVariable int id,@RequestPart("productDto") EditProductRequestDTO productDto, @RequestPart(value = "image", required = false) MultipartFile image) throws IOException{
            productService.updateProduct(productDto, id,image);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                    "Product with id: "+id+" Updated Successfully",
                    id
            ));
    }

    // Delete the Product with id. Only accessible to MERCHANT and ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT','ADMIN')")
    public ResponseEntity<SuccessResponse<Integer>> deleteProduct(@PathVariable int id) throws IOException{
            productService.deleteProduct(id);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                    "Product Deleted Successfully",
                    id
            ));
    }

    // Search the Products with Keyword. (Mostly searches the products name, description and category)
    @GetMapping("/search")
    public ResponseEntity<SuccessResponse<PageResponseDTO<ProductResponseDTO>>> searchProduct(@RequestParam("query") String keywords,
                                                                                              @RequestParam(value = "page",defaultValue = "1") int page,
                                                                                               @RequestParam(value = "size",defaultValue = "8") int size){


            PageResponseDTO<ProductResponseDTO> result = productService.search(page-1,size,keywords);
            return ResponseEntity.status(HttpStatus.OK).body(new SuccessResponse<>(
                    "Prodcuts Fetch Successfully",
                    result
            ));
    }

    @GetMapping("/my_products")
    @PreAuthorize("hasRole('MERCHANT')")
    public ResponseEntity<SuccessResponse<PageResponseDTO<ProductResponseDTO>>> getAllProductsOfMerchant(@RequestParam(defaultValue = "1") int page,
                                                                                               @RequestParam(defaultValue = "8") int size){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        PageResponseDTO<ProductResponseDTO> result = productService.findProductsOfMerchant(userName,page-1,size);
        return ResponseEntity.status(HttpStatus.OK).body(
                new SuccessResponse<>(
                        "Success",
                        result
                )
        );
    }


}

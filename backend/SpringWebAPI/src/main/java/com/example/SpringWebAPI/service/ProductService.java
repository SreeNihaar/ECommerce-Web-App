package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.EditProductRequestDTO;
import com.example.SpringWebAPI.dto.request.NewProductRequestDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseByIdDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.exception.AccessDeniedException;
import com.example.SpringWebAPI.exception.InvalidProductRequestException;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.model.enums.UserRole;
import com.example.SpringWebAPI.repository.MerchantRepository;
import com.example.SpringWebAPI.repository.ProductRepository;

import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ProductService extends ParentService{

    private final ProductRepository productRepo;

    private final MerchantRepository merchantRepo;

    private final S3Service s3Service;

    public ProductService(ProductRepository productRepo,MerchantRepository merchantRepo,S3Service s3Service){
        this.productRepo=productRepo;
        this.merchantRepo=merchantRepo;
        this.s3Service=s3Service;
    }

    private List<String> getParsedStringList(String word){
        if(word == null || word.isEmpty()){
            log.debug("Empty or null keyword provided for parsing");
            return new ArrayList<>();
        }
        log.debug("Parsing keyword for search: {}", word);
        StringBuilder builder = new StringBuilder();
        List<String> result = new ArrayList<>();
        int n=word.length();
        for(int i=0;i<n;i++){
            char character = word.charAt(i);
            if( ('a'<=character && character<='z') ||
                ('A'<=character && character<='Z') ||
                ('0'<=character && character<='9')){
                builder.append(character);
            }
            else if(!builder.isEmpty()){
                result.add(builder.toString());
                builder.delete(0,builder.length());
            }
        }
        if(!builder.isEmpty()){
            result.add(builder.toString());
        }
        log.debug("Parsed keywords: {}", result);
        return result;
    }


    private void validateAdminOrOwner(Product product){
        User loggedInUser = this.getAuthenticatedUser();

        boolean isAdmin = loggedInUser.getRoles().stream()
                .anyMatch(role -> role.getRoleName() == UserRole.ADMIN);

        boolean isOwner = product.getMerchant()
                .getUser()
                .getUsername()
                .equals(loggedInUser.getUsername());

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You are not authorized to delete this product.");
        }
    }

    private void validateProductNameAndDescription(String productName,String description){
        if(productName.length() >255 || description.length()>1000 || description.isEmpty() || productName.isEmpty()){
            throw new InvalidProductRequestException("Invalid product name length or description length");
        }
    }

    public PageResponseDTO<ProductResponseDTO> findAll(int page, int size){

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepo.findAll(pageable);
        List<ProductResponseDTO> content = getProductResponseDTOS(products);

        PageResponseDTO<ProductResponseDTO> result = new PageResponseDTO<>();
        result.setContent(content);
        result.setLast(products.isLast());
        result.setPage(products.getNumber());
        result.setSize(products.getSize());
        result.setTotalPages(products.getTotalPages());
        result.setTotalElements(products.getTotalElements());

        return result;
    }

    private static @NonNull List<ProductResponseDTO> getProductResponseDTOS(Page<Product> products) {
        List<ProductResponseDTO> content = new ArrayList<>();
        for(Product prod: products){
            ProductResponseDTO dto = new ProductResponseDTO();

            dto.setId(prod.getId());
            dto.setProductName(prod.getProductName());
            dto.setPrice(prod.getPrice());
            dto.setImageKey(prod.getImageKey());
            dto.setRating(prod.getRating());
            dto.setReviewCount(prod.getReviewCount());
            dto.setQuantity(prod.getStock());
            dto.setCategory(prod.getCategory());
            content.add(dto);
        }
        return content;
    }

    public PageResponseDTO<ProductResponseDTO> findProductsOfMerchant(String userName,int page, int size){
        log.info("Fetching products for merchant: {} (page: {}, size: {})", userName, page, size);

        Optional<Merchant> merchantOption = merchantRepo.findByUserUsername(userName);
        if(merchantOption.isEmpty()){
            log.warn("Merchant not found for username: {}", userName);
            throw new RuntimeException("Merchant Not Found");
        }

        Merchant merchant = merchantOption.get();

        if(!merchant.isApproved()){
            log.warn("Merchant {} is not approved", userName);
            throw new RuntimeException("Merchant is not Approved. Contact Admin for further details");
        }
        log.debug("Merchant {} is approved, fetching products", userName);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepo.findAllByMerchant_Id(merchant.getId(),pageable);

        List<ProductResponseDTO> content = getProductResponseDTOS(products);

        PageResponseDTO<ProductResponseDTO> result = new PageResponseDTO<>();
        result.setContent(content);
        result.setLast(products.isLast());
        result.setPage(products.getNumber());
        result.setSize(products.getSize());
        result.setTotalPages(products.getTotalPages());
        result.setTotalElements(products.getTotalElements());

        return result;
    }

    @Transactional
    public int addProduct(NewProductRequestDTO dto, MultipartFile image) throws IOException {
        String userName = this.getAuthenticatedUser().getUsername();
        validateProductNameAndDescription(dto.getProductName(),dto.getDescription());

        Merchant merchant = merchantRepo.findByUserUsername(userName).orElseThrow(() ->
                new RuntimeException("No merchant with username found")
        );

        if(!merchant.isApproved()){
            throw new RuntimeException("Merchant is not Approved. Contact Admin for further details");
        }

        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setCategory(dto.getCategory());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());

        product = productRepo.save(product);

        String s3ObjectName = s3Service.uploadProductPhoto(product.getId(), image);

        product.setImageKey(s3ObjectName);
        Product saved = productRepo.save(product);
        merchant.addProduct(saved);
        merchantRepo.save(merchant);

        return saved.getId();
    }

    public ProductResponseByIdDTO findById(int id){
        log.info("Fetching product details for ID: {}", id);
        Product product = productRepo.findById(id).orElseThrow(
                () -> new ProductNotFoundException("Product Not Found with id:",id)
        );
        log.debug("Product found - Name: {}, Merchant: {}", product.getProductName(), product.getMerchant().getLegalBusinessName());

        ProductResponseByIdDTO result = new ProductResponseByIdDTO();

        result.setId(product.getId());
        result.setProductName(product.getProductName());
        result.setCategory(product.getCategory());
        result.setDescription(product.getDescription());
        result.setMerchantName(product.getMerchant().getLegalBusinessName());
        result.setPrice(product.getPrice());
        result.setStock(product.getStock());
        result.setRating(product.getRating());
        result.setReviewCount(product.getReviewCount());
        result.setImageKey(product.getImageKey());

        return result;
    }

    @Transactional
    public void updateProduct(EditProductRequestDTO productDto, int id, MultipartFile image) throws IOException{
        log.info("Updating product ID: {}", id);

        validateProductNameAndDescription(productDto.getProductName(),productDto.getDescription());

        Product product = productRepo.findById(id)
                .orElseThrow(()-> new ProductNotFoundException("Product Not Found",id));

        validateAdminOrOwner(product);

        product.setProductName(productDto.getProductName());
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setCategory(productDto.getCategory());
        product.setStock(productDto.getStock());
        log.debug("Product fields updated - Name: {}, Price: {}, Stock: {}", productDto.getProductName(), productDto.getPrice(), productDto.getStock());

        String s3ObjectName="";
        if(image !=null) {
            log.debug("Uploading new image for product: {}", id);
            s3ObjectName = s3Service.uploadProductPhoto(id, image);
        }

        if(!s3ObjectName.isEmpty()){
            product.setImageKey(s3ObjectName);
            log.debug("Product image updated: {}", s3ObjectName);
        }
        productRepo.save(product);
        log.info("Product ID: {} updated successfully", id);
    }

    @Transactional
    public void deleteProduct(int id) {
        log.info("Deleting product ID: {}", id);
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found", id));

        validateAdminOrOwner(product);
        log.debug("User authorized to delete product: {}", id);

        if(product.getImageKey()!=null) {
            log.debug("Deleting product image from S3: {}", product.getImageKey());
            s3Service.deleteProductPhoto(product.getImageKey());
        }

        productRepo.delete(product);
        log.info("Product ID: {} deleted successfully", id);
    }

    public PageResponseDTO<ProductResponseDTO> search(int page,int size,String keyword){
        log.info("Searching products - Keyword: '{}', Page: {}, Size: {}", keyword, page, size);

        Pageable pageable = PageRequest.of(page, size);

        List<String> listWords = getParsedStringList(keyword);

        Page<ProductResponseDTO> result;

        if (!listWords.isEmpty()) {
            log.debug("Executing search with primary keyword: {}", listWords.getFirst());

            result = productRepo.searchByKeyword(
                    listWords.getFirst(),
                    pageable
            );
            log.debug("Search returned {} results", result.getTotalElements());
        } else {
            log.warn("No valid keywords extracted from search term: {}", keyword);
            result = Page.empty(pageable);
        }
        PageResponseDTO<ProductResponseDTO> response = new PageResponseDTO<>();

        response.setContent(result.getContent());
        response.setPage(result.getNumber());
        response.setSize(result.getSize());
        response.setTotalElements(result.getTotalElements());
        response.setTotalPages(result.getTotalPages());

        return response;
    }

}

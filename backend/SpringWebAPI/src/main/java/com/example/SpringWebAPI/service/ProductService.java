package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.ProductRequestDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseByIdDTO;
import com.example.SpringWebAPI.dto.response.ProductResponseDTO;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.repository.MerchantRepository;
import com.example.SpringWebAPI.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    @Autowired
    private MerchantRepository merchantRepo;

    private List<String> getParsedStringList(String word){
        if(word == null || word.isEmpty()){
            return new ArrayList<>();
        }
        System.out.println("Parsing: ");
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
                System.out.println(builder.toString());
                result.add(builder.toString());
                builder.delete(0,builder.length());
            }
        }
        if(!builder.isEmpty()){
            System.out.println(builder.toString());
            result.add(builder.toString());
        }
        return result;
    }

    public List<ProductResponseDTO> findAll(){

         List<Product> result =  repo.findAll();
         List<ProductResponseDTO> response = new ArrayList<>();

         for(Product prod: result){
             ProductResponseDTO dto = new ProductResponseDTO();

             dto.setId(prod.getProductId());
             dto.setProductName(prod.getProductName());
             dto.setPrice(prod.getPrice());
             dto.setImageName(prod.getImageName());
             dto.setImageData(prod.getImageData());
             dto.setImageType(prod.getImageType());
             dto.setRating(prod.getRating());
             dto.setQuantity(prod.getStock());
             dto.setCategory(prod.getCategory());

             response.add(dto);
         }
         return response;
    }

    public int addProduct(String userName,Product prod, MultipartFile image) throws IOException {

        Merchant merchant = merchantRepo.findByUserUsername(userName).orElseThrow(() ->
                new RuntimeException("No merchant with username found")
        );

        if(!merchant.isApproved()){
            throw new RuntimeException("Merchant is not Approved. Contact Admin for further details");
        }

        prod.setImageName(image.getOriginalFilename());
        prod.setImageType(image.getContentType());
        prod.setImageData(image.getBytes());

        merchant.addProduct(prod);

        Product saved = repo.save(prod);
        merchantRepo.save(merchant);

        return saved.getProductId();
    }

    public ProductResponseByIdDTO findById(int id){
        System.out.println("Getting the data of id: "+id);
        Product product = repo.findById(id).orElseThrow(
                () -> new ProductNotFoundException("Product Not Found with id:",id)
        );

        ProductResponseByIdDTO result = new ProductResponseByIdDTO();

        result.setId(product.getProductId());
        result.setProductName(product.getProductName());
        result.setCategory(product.getCategory());
        result.setDescription(product.getDescription());
        result.setMerchantName(product.getMerchant().getLegalBusinessName());
        result.setPrice(product.getPrice());
        result.setRating(product.getRating());

        result.setImageData(product.getImageData());
        result.setImageType(product.getImageType());
        result.setImageName(product.getImageName());

        return result;
    }

    public void updateProduct(Product product, int id, MultipartFile image) throws IOException{
        if(image !=null){
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }
        System.out.println("Updating product...");
        product.setProductId(id);
        repo.save(product);
    }

    public void deleteProduct(int id){
        System.out.println("Deleting the Product of id: "+id);
        repo.deleteById(id);
    }

    public List<ProductResponseDTO> search(String keyword){
        System.out.println("Before Parse: "+keyword);
        List<String> listWords = getParsedStringList(keyword);
        List<ProductResponseDTO> result = new ArrayList<>();
        if(!listWords.isEmpty()){
            System.out.println("Searching products with keyword... : "+listWords.getFirst());
            result =  repo.searchByKeyword(listWords.getFirst());
        }
        return result;
    }

}

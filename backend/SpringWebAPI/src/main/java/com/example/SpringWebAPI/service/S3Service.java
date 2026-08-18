package com.example.SpringWebAPI.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@Service
public class S3Service {

    @Autowired
    private S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    public String uploadProductPhoto(Integer productId,MultipartFile file) throws IOException {
        log.info("Uploading product image to S3 - Product ID: {}, Filename: {}, Size: {} bytes",
            productId, file.getOriginalFilename(), file.getSize());

        String extension = Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf('.'));
        String s3FileName = "products/"+productId+extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3FileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            log.info("Product image uploaded successfully to S3 - Key: {}, Bucket: {}", s3FileName, bucketName);
            return s3FileName;
        } catch (Exception e) {
            log.error("Failed to upload product image to S3 - Product ID: {}, Error: {}", productId, e.getMessage(), e);
            throw e;
        }
    }

    public void deleteProductPhoto(String imageKey) {
        log.info("Deleting product image from S3 - Image Key: {}", imageKey);

        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(imageKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("Product image deleted successfully from S3 - Key: {}", imageKey);
        } catch (Exception e) {
            log.error("Failed to delete product image from S3 - Image Key: {}, Error: {}", imageKey, e.getMessage(), e);
        }
    }

}

package com.example.SpringWebAPI.exception;

public class ProductNotFoundException extends RuntimeException{
    public ProductNotFoundException(String s,int id){
        super(s+id);
    }
}

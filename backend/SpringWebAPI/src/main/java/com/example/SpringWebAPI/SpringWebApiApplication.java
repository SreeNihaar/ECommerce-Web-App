package com.example.SpringWebAPI;

import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.service.ProductService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.util.List;

@SpringBootApplication
public class SpringWebApiApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(SpringWebApiApplication.class, args);
		System.out.println("============================== OUTPUT ======================================");
	}

}

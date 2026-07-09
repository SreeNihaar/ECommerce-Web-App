package com.example.SpringWebAPI.controller;

import com.example.SpringWebAPI.dto.response.TransactionDTO;
import com.example.SpringWebAPI.response.SuccessResponse;
import com.example.SpringWebAPI.service.TransactionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;

    public TransactionController(TransactionService service){
        this.service=service;
    }

    @GetMapping({ "/" , "" })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SuccessResponse<List<TransactionDTO>>> getAllTransactions(){

        List<TransactionDTO> result = service.getAllTransactions();

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Found "+result.size()+" Transactions",result)
        );
    }

    @GetMapping({ "/{id}" , "/{id}/" })
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<SuccessResponse<TransactionDTO>> getTransaction(@RequestParam String transactionId){

        TransactionDTO result = service.getTransactionById(transactionId);

        return ResponseEntity.status(200).body(
                new SuccessResponse<>("Found the Transaction Id: "+transactionId,result)
        );
    }

}

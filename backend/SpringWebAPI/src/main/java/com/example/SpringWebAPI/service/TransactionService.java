package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.response.TransactionDTO;
import com.example.SpringWebAPI.exception.TransactionNotFoundException;
import com.example.SpringWebAPI.model.Order;
import com.example.SpringWebAPI.model.OrderProduct;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.model.Transaction;
import com.example.SpringWebAPI.model.enums.TransactionStatus;
import com.example.SpringWebAPI.repository.OrderRepository;
import com.example.SpringWebAPI.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final OrderRepository orderRepo;

    private final TransactionRepository transactionRepo;

    public TransactionService(OrderRepository orderRepo,TransactionRepository transactionRepo){
        this.orderRepo=orderRepo;
        this.transactionRepo=transactionRepo;
    }

    private boolean validTransaction(String transactionId){
        if(transactionId.length()<3){
            return false;
        }

        if(transactionId.charAt(0) != 'T' || transactionId.charAt(0) != '_'){
            return false;
        }

        int size = transactionId.length();
        for(int idx=2;idx<size;idx++){
            char character = transactionId.charAt(idx);
            if(!('0'<=character && character<='9')){
                return false;
            }
        }

        return true;
    }

    private TransactionDTO getTransactionDTO(Transaction transx){
        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId("T_"+transx.getId());
        dto.setTransactionStatus(transx.getTransactionStatus().toString());
        dto.setAmount(transx.getAmount());
        dto.setOrderId(transx.getOrder().getId());

        dto.setCreatedAt(transx.getCreatedAt());
        dto.setUpdatedAt(transx.getUpdatedAt());

        return dto;
    }

    @Transactional
    public long createTransaction(int orderId,double amount){
        System.out.println();
        Order order = orderRepo.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

        if(order.getTotalPrice() != amount){
            // Add new exception to notify user.
            throw new RuntimeException("Order price Does not matches with payment Amount");
        }

        for(OrderProduct orderProduct: order.getOrderProducts()){
            Product prod = orderProduct.getProduct();
            System.out.println(prod.getProductId());
            if(prod.getStock() < orderProduct.getStock()){
                // Add new exception to notify user.
                throw new RuntimeException("Insufficient stock for "+ prod.getProductName());
            }

            prod.setStock(
                    prod.getStock() - orderProduct.getStock()
            );
        }

        Transaction transaction = new Transaction();
        transaction.setId(Instant.now().getEpochSecond());

        transaction.setTransactionStatus(TransactionStatus.SUCCESS);

        transaction.setAmount(amount);
        order.addTransaction(transaction);

        return transaction.getId();
    }

    public Transaction getLatestTransaction(int orderId){
        Transaction transaction = transactionRepo.findLatestTransaction(orderId).orElse(null);
        return transaction;
    }

    public TransactionDTO getTransactionById(String transId){

        if(!validTransaction(transId)){
            throw new RuntimeException("Invalid Transaction ID");
        }

        Long transIdNum = Long.parseLong(transId.substring(2));

        Transaction transaction = transactionRepo.findById(transIdNum).orElseThrow(
                () -> new TransactionNotFoundException("Transaction Not Found",transId)
        );

        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId("T_"+transaction.getId());
        dto.setTransactionStatus(transaction.getTransactionStatus().toString());
        dto.setAmount(transaction.getAmount());
        dto.setOrderId(transaction.getOrder().getId());

        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());

        return dto;
    }

    public List<TransactionDTO> getAllTransactions(){
        List<TransactionDTO> result = new ArrayList<>();
        List<Transaction> transactions =  transactionRepo.findAll();

        for(Transaction transx: transactions){
            TransactionDTO dto = this.getTransactionDTO(transx);
            result.add(dto);
        }

        return result;
    }

    public List<TransactionDTO> getAllTransactionsByOrder(Order order){
        List<TransactionDTO> result = new ArrayList<>();

        List<Transaction> transactions = transactionRepo.findAllByOrderByIdAsc(order.getId());

        for(Transaction transaction: transactions){
            result.add(getTransactionDTO(transaction));
        }
        return result;
    }
}

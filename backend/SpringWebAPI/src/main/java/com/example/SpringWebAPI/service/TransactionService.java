package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.PaymentStatusResponseDTO;
import com.example.SpringWebAPI.dto.response.TransactionDTO;
import com.example.SpringWebAPI.exception.TransactionNotFoundException;
import com.example.SpringWebAPI.model.Order;
import com.example.SpringWebAPI.model.OrderProduct;
import com.example.SpringWebAPI.model.Product;
import com.example.SpringWebAPI.model.Transaction;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.model.enums.TransactionStatus;
import com.example.SpringWebAPI.repository.OrderRepository;
import com.example.SpringWebAPI.repository.TransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
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
    public PaymentStatusResponseDTO createTransaction(int orderId, double amount) {
        log.info("Processing payment for Order ID: {}, Amount: {}", orderId, amount);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));
        Transaction transaction = new Transaction();
        transaction.setId(Instant.now().getEpochSecond());
        transaction.setAmount(amount);

        try {
            // Check payment amount
            if (Math.abs(order.getTotalPrice() - amount) > 0.001) {
                log.warn("Payment amount mismatch - Order ID: {}, Expected: {}, Received: {}",
                    orderId, order.getTotalPrice(), amount);
                throw new RuntimeException(
                        "Order price does not match payment amount"
                );
            }
            log.debug("Payment amount validated - Order ID: {}, Amount: {}", orderId, amount);

            // Check stock first
            for (OrderProduct orderProduct : order.getOrderProducts()) {
                Product product = orderProduct.getProduct();
                if (product.getStock() < orderProduct.getStock()) {
                    log.warn("Insufficient stock - Product: {}, Available: {}, Required: {}",
                        product.getProductName(), product.getStock(), orderProduct.getStock());
                    throw new RuntimeException(
                            "Insufficient stock for " + product.getProductName()
                    );
                }
            }
            log.debug("Stock validation passed for Order ID: {}", orderId);

            // Deduct stock
            for (OrderProduct orderProduct : order.getOrderProducts()) {
                Product product = orderProduct.getProduct();
                int previousStock = product.getStock();
                product.setStock(
                        product.getStock() - orderProduct.getStock()
                );
                orderProduct.setProductStatus(OrderStatus.PROCESSING);
                log.debug("Stock deducted - Product: {}, Previous: {}, New: {}, Quantity: {}",
                    product.getProductName(), previousStock, product.getStock(), orderProduct.getStock());
            }

            // Payment successful
            transaction.setTransactionStatus(TransactionStatus.SUCCESS);
            order.updateOrderStatus();
            log.info("Payment successful - Order ID: {}, Transaction ID: {}", orderId, transaction.getId());

        } catch (Exception e) {
            // Payment failed
            transaction.setTransactionStatus(TransactionStatus.FAILURE);
            log.error("Payment failed for Order ID: {} - Error: {}", orderId, e.getMessage(), e);
        }

        order.addTransaction(transaction);
        orderRepo.save(order);

        Transaction savedTransaction= transactionRepo.save(transaction);
        PaymentStatusResponseDTO responseDTO = new PaymentStatusResponseDTO();

        responseDTO.setTransactionId("T_"+savedTransaction.getId());
        responseDTO.setStatus(savedTransaction.getTransactionStatus().toString());

        return responseDTO;
    }

    public Transaction getLatestTransaction(int orderId){
        Transaction transaction = transactionRepo.findLatestTransaction(orderId).orElse(null);
        return transaction;
    }

    public TransactionDTO getTransactionById(String transId){
        log.info("Fetching transaction details - Transaction ID: {}", transId);

        if(!validTransaction(transId)){
            log.warn("Invalid transaction ID format: {}", transId);
            throw new RuntimeException("Invalid Transaction ID");
        }

        Long transIdNum = Long.parseLong(transId.substring(2));

        Transaction transaction = transactionRepo.findById(transIdNum).orElseThrow(
                () -> new TransactionNotFoundException("Transaction Not Found",transId)
        );
        log.debug("Transaction found - ID: {}, Status: {}, Amount: {}", transIdNum, transaction.getTransactionStatus(), transaction.getAmount());

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
        log.info("Fetching all transactions for Order ID: {}", order.getId());
        List<TransactionDTO> result = new ArrayList<>();

        List<Transaction> transactions = transactionRepo.findAllByOrderIdOrderByIdAsc(order.getId());

        for(Transaction transaction: transactions){
            result.add(getTransactionDTO(transaction));
        }
        log.debug("Found {} transactions for Order ID: {}", result.size(), order.getId());
        return result;
    }
}

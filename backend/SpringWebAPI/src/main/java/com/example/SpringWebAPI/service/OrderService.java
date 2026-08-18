package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.CheckoutItemRequestDTO;
import com.example.SpringWebAPI.dto.response.ManyOrderResponseDTO;
import com.example.SpringWebAPI.dto.response.OrderProductDTO;
import com.example.SpringWebAPI.dto.response.OrderResponseDTO;
import com.example.SpringWebAPI.exception.MerchantNotAuthorizedException;
import com.example.SpringWebAPI.exception.MerchantProfileNotFoundException;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.repository.MerchantRepository;
import com.example.SpringWebAPI.repository.OrderRepository;
import com.example.SpringWebAPI.repository.OrderProductRepository;
import com.example.SpringWebAPI.repository.ProductRepository;
import com.example.SpringWebAPI.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class OrderService extends ParentService{

    private final OrderRepository orderRepo;

    private final UserRepository userRepo;

    private final ProductRepository productRepo;

    private final TransactionService transactionService;

    private final MerchantRepository merchantRepo;

    public OrderService(OrderRepository orderRepo,UserRepository userRepo, ProductRepository productRepo,TransactionService transactionService, MerchantRepository merchantRepo, OrderProductRepository orderProductRepo){
        this.orderRepo=orderRepo;
        this.userRepo=userRepo;
        this.productRepo=productRepo;
        this.transactionService=transactionService;
        this.merchantRepo=merchantRepo;
    }

    private List<OrderProductDTO> getOrderProductDTO(Order order){

        List<OrderProductDTO> result = new ArrayList<>();

        for(OrderProduct orderProduct: order.getOrderProducts()){
            OrderProductDTO productDTO = new OrderProductDTO();
            Product product = orderProduct.getProduct();

            productDTO.setProductName(product.getProductName());
            productDTO.setProductId(product.getId());
            productDTO.setQuantity(orderProduct.getStock());
            productDTO.setProductStatus(orderProduct.getProductStatus().toString());
            productDTO.setPriceAtPurchase(orderProduct.getPriceAtPurchase());

            result.add(productDTO);
        }

        return result;
    }

    @Transactional
    public int createOrder(String userName,List<CheckoutItemRequestDTO> items){
        log.info("Creating order for user: {} with {} items", userName, items.size());
        Order order = new Order();

        User user = userRepo.findByUsername(userName).orElseThrow(() ->
                new UsernameNotFoundException("User Not Found")
        );
        log.debug("User found: {}", userName);

        double totalPrice=0.0;

        for(CheckoutItemRequestDTO item: items){
            log.debug("Processing order item - Product ID: {}, Quantity: {}", item.getProductId(), item.getQuantity());

            Product product = productRepo.findById(item.getProductId()).orElseThrow(()->
                    new ProductNotFoundException("Product Not Found",item.getProductId())
            );

            if(product.getStock() < item.getQuantity()){
                log.warn("Insufficient stock for product ID: {} - Available: {}, Requested: {}",
                    item.getProductId(), product.getStock(), item.getQuantity());
                throw new RuntimeException("Stock Not Available");
            }

            OrderProduct obj = new OrderProduct();
            obj.setProduct(product);
            obj.setPriceAtPurchase(product.getPrice());
            obj.setStock(item.getQuantity());

            totalPrice += obj.getPriceAtPurchase() * obj.getStock();

            order.addOrderProduct(obj);
            log.debug("Order product added - Product: {}, Price: {}, Total for item: {}",
                product.getProductName(), obj.getPriceAtPurchase(), obj.getPriceAtPurchase() * obj.getStock());
        }

        order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
        order.setTotalPrice(totalPrice);
        user.addOrder(order);

        order = orderRepo.save(order);
        log.info("Order created successfully - Order ID: {}, Total Price: {}, User: {}", order.getId(), totalPrice, userName);

        return order.getId();
    }

    private List<Order> getAllMyOrders(String userName){

        return orderRepo.findAllByUserUsername(userName);

    }

    public OrderResponseDTO getOrderByIdDTO(String userName, int id){
        log.info("Fetching order ID: {} for user: {}", id, userName);

        Order order = orderRepo.findById(id).orElseThrow(
                () -> new RuntimeException("Order Not Found")
        );

        if(!order.getUser().getUsername().equals(userName)){
            log.warn("Unauthorized order access attempt - Order ID: {}, Requested by: {}, Owner: {}",
                id, userName, order.getUser().getUsername());
            throw new RuntimeException(" UserName doesnot match Order Not Found ");
        }
        log.debug("Order found and authorized - Order ID: {}, Status: {}, Total: {}",
            id, order.getOrderStatus(), order.getTotalPrice());

        OrderResponseDTO result = new OrderResponseDTO();

        result.setOrderId(order.getId());
        result.setOrderDate(order.getUpdatedAt());
        result.setUserName(userName);
        result.setTotalPrice(order.getTotalPrice());
        result.setOrderStatus(order.getOrderStatus().toString());

        result.setProducts(this.getOrderProductDTO(order));
        result.setTransactions(transactionService.getAllTransactionsByOrder(order));

        return result;
    }

    public List<ManyOrderResponseDTO> getAllMyOrdersDTO(String userName){
        log.info("Fetching all orders for user: {}", userName);
        List<Order> orders = this.getAllMyOrders(userName);

        List<ManyOrderResponseDTO> result = new ArrayList<>();

        if(orders.isEmpty()){
            log.debug("No orders found for user: {}", userName);
            return result;
        }
        log.debug("Found {} orders for user: {}", orders.size(), userName);

        for(Order order: orders){
            Transaction latestTransaction = transactionService.getLatestTransaction(order.getId());

            ManyOrderResponseDTO dto = new ManyOrderResponseDTO();
            dto.setOrderId(order.getId());
            dto.setOrderDate(order.getUpdatedAt());
            dto.setOrderStatus(order.getOrderStatus().toString());
            dto.setTotalPrice(order.getTotalPrice());

            if(latestTransaction != null){
                dto.setLatestTransactionId("T_"+ latestTransaction.getId());
                dto.setLatestTransactionStatus(latestTransaction.getTransactionStatus().toString());
            }
            else{
                dto.setLatestTransactionId("NULL");
                dto.setLatestTransactionStatus("NULL");
            }

            dto.setProducts(this.getOrderProductDTO(order));

            result.add(dto);
        }
        return result;
    }

    private boolean isValidStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            return false;
        }

        return switch (currentStatus) {
            case PROCESSING -> newStatus == OrderStatus.SHIPPED;
            case SHIPPED -> newStatus == OrderStatus.DELIVERED;
            default -> false;
        };
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, OrderStatus newStatus, String merchantUsername) {
        log.info("Updating order status - Order ID: {}, New Status: {}, Merchant: {}", orderId, newStatus, merchantUsername);

        Order order = orderRepo.findById(orderId).orElseThrow(
                () -> new RuntimeException("Order Not Found")
        );

        if (!isValidStatusTransition(order.getOrderStatus(), newStatus)) {
            log.warn("Invalid status transition attempted - Order ID: {}, Current: {}, Requested: {}",
                orderId, order.getOrderStatus(), newStatus);
            throw new RuntimeException("Invalid status transition from " + order.getOrderStatus() + " to " + newStatus);
        }

        Merchant merchant = merchantRepo.findByUserUsername(merchantUsername).orElseThrow(
                () -> new MerchantProfileNotFoundException("Merchant profile not found")
        );
        log.debug("Merchant found: {} (ID: {})", merchantUsername, merchant.getId());

        if (!merchant.isApproved()) {
            log.warn("Merchant not approved for status update - Merchant: {}", merchantUsername);
            throw new MerchantNotAuthorizedException("Merchant is not authorized");
        }

        boolean merchantOwnsOrder = order.getOrderProducts().stream()
                .anyMatch(op -> op.getProduct().getMerchant().getId() == merchant.getId());

        if (!merchantOwnsOrder) {
            log.warn("Unauthorized order status update attempt - Merchant: {}, Order ID: {}", merchantUsername, orderId);
            throw new MerchantNotAuthorizedException("Merchant does not own this order");
        }

        for(OrderProduct orderProduct: order.getOrderProducts()){
            if(orderProduct.getProduct().getMerchant().getId() == merchant.getId()){
                if(!isValidStatusTransition(orderProduct.getProductStatus(),newStatus)){
                    log.warn("Invalid product status transition - Product ID: {}, Current: {}, Requested: {}",
                        orderProduct.getProduct().getId(), orderProduct.getProductStatus(), newStatus);
                    throw new RuntimeException("Invalid status transition from "
                            + orderProduct.getProductStatus()
                            + " to "
                            + newStatus
                    );
                }
                log.debug("Updating product status in order - Product: {}, New Status: {}",
                    orderProduct.getProduct().getProductName(), newStatus);
                orderProduct.setProductStatus(newStatus);
            }
        }
        order.updateOrderStatus();
        orderRepo.save(order);
        log.info("Order status updated successfully - Order ID: {}, New Status: {}", orderId, newStatus);
    }

}

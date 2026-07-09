package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.request.CheckoutItemRequestDTO;
import com.example.SpringWebAPI.dto.response.ManyOrderResponseDTO;
import com.example.SpringWebAPI.dto.response.OrderProductDTO;
import com.example.SpringWebAPI.dto.response.OrderResponseDTO;
import com.example.SpringWebAPI.exception.ProductNotFoundException;
import com.example.SpringWebAPI.exception.UsernameNotFoundException;
import com.example.SpringWebAPI.model.*;
import com.example.SpringWebAPI.model.enums.OrderStatus;
import com.example.SpringWebAPI.repository.OrderRepository;
import com.example.SpringWebAPI.repository.ProductRepository;
import com.example.SpringWebAPI.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;

    private final UserRepository userRepo;

    private final ProductRepository productRepo;

    private final TransactionService transactionService;

    public OrderService(OrderRepository orderRepo,UserRepository userRepo, ProductRepository productRepo,TransactionService transactionService){
        this.orderRepo=orderRepo;
        this.userRepo=userRepo;
        this.productRepo=productRepo;
        this.transactionService=transactionService;
    }

    @Transactional
    public int createOrder(String userName,List<CheckoutItemRequestDTO> items){
        Order order = new Order();

        User user = userRepo.findByUsername(userName).orElseThrow(() ->
                new UsernameNotFoundException("User Not Found")
        );

        double totalPrice=0.0;

        for(CheckoutItemRequestDTO item: items){
            // Need to optimize to fetch all Products in single query

            Product product = productRepo.findById(item.getProductId()).orElseThrow(()->
                    new ProductNotFoundException("Product Not Found",item.getProductId())
            );

            if(product.getStock() < item.getQuantity()){
                throw new RuntimeException("Stock Not Available");
            }

            OrderProduct obj = new OrderProduct();
            obj.setProduct(product);
            obj.setPriceAtPurchase(product.getPrice());
            obj.setStock(item.getQuantity());

            totalPrice += obj.getPriceAtPurchase() * obj.getStock();

            order.addOrderProduct(obj);
        }

        order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
        order.setTotalPrice(totalPrice);
        user.addOrder(order);

        order = orderRepo.save(order);

        return order.getId();
    }

    private List<Order> getAllMyOrders(String userName){

        return orderRepo.findAllByUserUsername(userName);

    }

    private List<OrderProductDTO> getOrderProductDTO(Order order){

        List<OrderProductDTO> result = new ArrayList<>();

        for(OrderProduct orderProduct: order.getOrderProducts()){
            OrderProductDTO productDTO = new OrderProductDTO();
            Product product = orderProduct.getProduct();

            productDTO.setProductName(product.getProductName());
            productDTO.setProductId(product.getProductId());
            productDTO.setQuantity(orderProduct.getStock());
            productDTO.setPriceAtPurchase(orderProduct.getPriceAtPurchase());

            result.add(productDTO);
        }

        return result;
    }

    public OrderResponseDTO getOrderByIdDTO(String userName, int id){

        Order order = orderRepo.findById(id).orElseThrow(
                () -> new RuntimeException("Order Not Found")
        );

        if(!order.getUser().getUsername().equals(userName)){
            throw new RuntimeException(" UserName doesnot match Order Not Found ");
        };

        OrderResponseDTO result = new OrderResponseDTO();

        result.setOrderId(order.getId());
        result.setOrderDate(order.getOrderDate());
        result.setUserName(userName);
        result.setTotalPrice(order.getTotalPrice());
        result.setOrderStatus(order.getOrderStatus().toString());

        result.setProducts(this.getOrderProductDTO(order));
        result.setTransactions(transactionService.getAllTransactionsByOrder(order));

        return result;
    }

    public List<ManyOrderResponseDTO> getAllMyOrdersDTO(String userName){
        List<Order> orders = this.getAllMyOrders(userName);

        List<ManyOrderResponseDTO> result = new ArrayList<>();

        if(orders.isEmpty()){
            return result;
        }

        for(Order order: orders){
            Transaction latestTransaction = transactionService.getLatestTransaction(order.getId());

            ManyOrderResponseDTO dto = new ManyOrderResponseDTO();
            dto.setOrderId(order.getId());
            dto.setOrderDate(order.getOrderDate());
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

}

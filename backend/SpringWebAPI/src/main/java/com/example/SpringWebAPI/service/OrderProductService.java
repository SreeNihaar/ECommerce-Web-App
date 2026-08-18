package com.example.SpringWebAPI.service;

import com.example.SpringWebAPI.dto.internal.MerchantOrderProductFlatDTO;
import com.example.SpringWebAPI.dto.internal.MerchantProductDTO;
import com.example.SpringWebAPI.dto.response.MerchantOrderResponseDTO;
import com.example.SpringWebAPI.dto.response.PageResponseDTO;
import com.example.SpringWebAPI.exception.MerchantNotAuthorizedException;
import com.example.SpringWebAPI.exception.MerchantProfileNotFoundException;
import com.example.SpringWebAPI.model.Merchant;
import com.example.SpringWebAPI.model.User;
import com.example.SpringWebAPI.repository.MerchantRepository;
import com.example.SpringWebAPI.repository.OrderProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class OrderProductService extends ParentService{

    private final OrderProductRepository orderProductRepo;

    private final MerchantRepository merchantRepo;

    public OrderProductService(OrderProductRepository orderProductRepo,MerchantRepository merchantRepo){
        this.orderProductRepo=orderProductRepo;
        this.merchantRepo=merchantRepo;
    }

    public PageResponseDTO<MerchantOrderResponseDTO> getMerchantOrdersPageable(int page, int size) {
        User user = this.getAuthenticatedUser();
        log.info("Fetching merchant orders - User: {}, Page: {}, Size: {}", user.getUsername(), page, size);

        Merchant merchant = merchantRepo.findByUserUsername(user.getUsername()).orElseThrow(()->new MerchantProfileNotFoundException("No Merchant Found"));
        if(!merchant.isApproved()){
            log.warn("Unauthorized merchant orders access attempt - Merchant not approved, User: {}", user.getUsername());
            throw new MerchantNotAuthorizedException("Merchant is Not Authorized. Please Contact Admin");
        }

        List<MerchantOrderProductFlatDTO> allRows = orderProductRepo.findSuccessfulOrderProductsForMerchant(merchant.getId());
        log.debug("Retrieved {} order products for merchant: {}", allRows.size(), merchant.getLegalBusinessName());

        Map<Integer, MerchantOrderResponseDTO> map = new LinkedHashMap<>();

        for(MerchantOrderProductFlatDTO row: allRows){

            MerchantOrderResponseDTO order = map.get(row.getOrderId());
            if(order == null){
                order = new MerchantOrderResponseDTO();
                order.setOrderId(row.getOrderId());
                order.setOrderStatus(row.getOrderStatus());
                order.setUpdatedAt(row.getUpdatedAt());
                order.setOrderDate(row.getOrderDate());
                order.setProducts(new ArrayList<>());
                order.setTotalAmount(0.0);

                map.put(row.getOrderId(),order);
            }

            MerchantProductDTO productDTO = new MerchantProductDTO();
            productDTO.setProductId(row.getProductId());
            productDTO.setProductName(row.getProductName());
            productDTO.setStock(row.getStock());
            productDTO.setPriceAtPurchase(row.getPriceAtPurchase());

            order.getProducts().add(productDTO);
            order.setTotalAmount(order.getTotalAmount() + row.getPriceAtPurchase()*row.getStock());
        }

        List<MerchantOrderResponseDTO> allOrders = new ArrayList<>(map.values());

        int totalOrders = allOrders.size();
        int fromIndex = page * size;
        int toIndex = Math.min((page + 1) * size, totalOrders);
        List<MerchantOrderResponseDTO> content = allOrders.subList(fromIndex, toIndex);

        PageResponseDTO<MerchantOrderResponseDTO> response = new PageResponseDTO<>();
        response.setContent(content);
        response.setPage(page);
        response.setSize(size);
        response.setTotalElements(totalOrders);
        response.setTotalPages((totalOrders + size - 1) / size);
        response.setLast(toIndex >= totalOrders);

        log.debug("Merchant orders paginated - Total Orders: {}, Current Page Content: {}, Total Pages: {}",
            totalOrders, content.size(), response.getTotalPages());
        return response;
    }

}

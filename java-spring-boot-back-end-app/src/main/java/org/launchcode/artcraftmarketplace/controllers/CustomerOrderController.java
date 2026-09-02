package org.launchcode.artcraftmarketplace.controllers;

import org.launchcode.artcraftmarketplace.models.CustomerOrder;
import org.launchcode.artcraftmarketplace.repositories.CustomerOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerOrderController {

    private final CustomerOrderRepository customerOrderRepository;

    public CustomerOrderController(CustomerOrderRepository customerOrderRepository) {
        this.customerOrderRepository = customerOrderRepository;
    }

    @GetMapping
    public List<CustomerOrder> getAllOrders() {
        return customerOrderRepository.findAll();
    }

    @PostMapping
    public CustomerOrder createOrder(@RequestBody CustomerOrder order) {
        return customerOrderRepository.save(order);
    }
}
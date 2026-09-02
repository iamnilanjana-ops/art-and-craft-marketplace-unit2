package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {
}
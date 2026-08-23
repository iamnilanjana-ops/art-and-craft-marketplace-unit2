package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
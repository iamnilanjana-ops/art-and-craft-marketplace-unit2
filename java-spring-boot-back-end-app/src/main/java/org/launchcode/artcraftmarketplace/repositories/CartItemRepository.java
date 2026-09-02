package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}
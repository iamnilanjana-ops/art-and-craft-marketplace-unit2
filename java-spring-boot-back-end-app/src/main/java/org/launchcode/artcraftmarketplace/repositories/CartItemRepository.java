package org.launchcode.artcraftmarketplace.repositories;

import org.launchcode.artcraftmarketplace.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByCartId(int cartId);

    List<CartItem> findByCartIdAndProductId(int cartId, int productId);
}
package org.launchcode.artcraftmarketplace.controllers;

import org.launchcode.artcraftmarketplace.models.Cart;
import org.launchcode.artcraftmarketplace.models.CartItem;
import org.launchcode.artcraftmarketplace.models.Product;
import org.launchcode.artcraftmarketplace.repositories.CartItemRepository;
import org.launchcode.artcraftmarketplace.repositories.CartRepository;
import org.launchcode.artcraftmarketplace.repositories.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@CrossOrigin(origins = "http://localhost:3000")
public class CartItemController {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartItemController(
            CartItemRepository cartItemRepository,
            CartRepository cartRepository,
            ProductRepository productRepository) {

        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<CartItem> getCartItems(@RequestParam int cartId) {

        List<CartItem> items =
                cartItemRepository.findByCartId(cartId);

        for (CartItem item : items) {

            int productId = item.getProduct().getId();

            Product latestProduct = productRepository
                    .findById(productId)
                    .orElseThrow();

            item.setProduct(latestProduct);
        }

        return items;
    }

    @PostMapping
    public CartItem addToCart(
            @RequestParam int cartId,
            @RequestParam int productId,
            @RequestParam(defaultValue = "1") int quantity) {

        Cart cart = cartRepository
                .findById(cartId)
                .orElseThrow();

        Product latestProduct = productRepository
                .findById(productId)
                .orElseThrow();

        List<CartItem> existingItems =
                cartItemRepository.findByCartIdAndProductId(
                        cartId,
                        productId
                );

        if (!existingItems.isEmpty()) {

            CartItem item = existingItems.get(0);

            item.setProduct(latestProduct);

            item.setQuantity(latestProduct.getQuantity());

            CartItem savedItem =
                    cartItemRepository.save(item);

            for (int i = 1; i < existingItems.size(); i++) {
                cartItemRepository.delete(existingItems.get(i));
            }

            return savedItem;
        }

        CartItem item = new CartItem();

        item.setCart(cart);
        item.setProduct(latestProduct);
        item.setQuantity(latestProduct.getQuantity());

        return cartItemRepository.save(item);
    }

    @PutMapping("/{id}")
    public CartItem updateCartItem(
            @PathVariable int id,
            @RequestParam int quantity) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        Product latestProduct = productRepository
                .findById(item.getProduct().getId())
                .orElseThrow();

        item.setProduct(latestProduct);
        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable int id) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        cartItemRepository.delete(item);
    }
}
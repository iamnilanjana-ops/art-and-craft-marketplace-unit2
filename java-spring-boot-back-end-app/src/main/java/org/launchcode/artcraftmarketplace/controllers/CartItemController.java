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

    // GET all items for one cart
    @GetMapping
    public List<CartItem> getCartItems(@RequestParam int cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    // ADD product to cart
    @PostMapping
    public CartItem addToCart(
            @RequestParam int cartId,
            @RequestParam int productId,
            @RequestParam(defaultValue = "1") int quantity) {

        Cart cart = cartRepository
                .findById(cartId)
                .orElseThrow();

        Product product = productRepository
                .findById(productId)
                .orElseThrow();

        // Check if the product is already in this cart
        CartItem existingItem = cartItemRepository
                .findByCartIdAndProductId(cartId, productId)
                .orElse(null);

        // If it already exists, increase its quantity
        if (existingItem != null) {
            existingItem.setQuantity(
                    existingItem.getQuantity() + quantity
            );

            return cartItemRepository.save(existingItem);
        }

        // Otherwise create a new cart item
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }

    // UPDATE cart item quantity
    @PutMapping("/{id}")
    public CartItem updateCartItem(
            @PathVariable int id,
            @RequestParam int quantity) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }

    // DELETE cart item
    @DeleteMapping("/{id}")
    public void deleteCartItem(@PathVariable int id) {

        CartItem item = cartItemRepository
                .findById(id)
                .orElseThrow();

        cartItemRepository.delete(item);
    }
}
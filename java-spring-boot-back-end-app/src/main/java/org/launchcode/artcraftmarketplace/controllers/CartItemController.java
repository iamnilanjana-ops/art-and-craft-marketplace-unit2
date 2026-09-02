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
        return cartItemRepository.findByCartId(cartId);
    }

    @PostMapping
    public CartItem addToCart(
            @RequestParam int cartId,
            @RequestParam int productId,
            @RequestParam(defaultValue = "1") int quantity) {

        Cart cart = cartRepository.findById(cartId).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }
}
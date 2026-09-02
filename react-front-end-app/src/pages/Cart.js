import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cartId = localStorage.getItem("cartId");

        if (cartId) {
            fetch(`http://localhost:8080/api/cart-items?cartId=${cartId}`)
                .then((response) => response.json())
                .then((data) => setCartItems(data))
                .catch((error) =>
                    console.error("Error fetching cart items:", error)
                );
        }
    }, []);

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>

    {item.product.image ? (
        <img
            src={item.product.image}
            alt={item.product.name}
            className="cart-item-image"
        />
    ) : (
        <div className="cart-no-image">
            No Image
        </div>
    )}

    <div className="cart-item-details">
        <h4>{item.product.name}</h4>
        <p>Price: ${item.product.price}</p>
        <p>Quantity: {item.quantity}</p>
    </div>

</div>
                    ))}

                    <div className="cart-summary">
                        <h3>Total: ${total.toFixed(2)}</h3>

                        <Link to="/checkout" className="checkout-button">
                            Proceed to Checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
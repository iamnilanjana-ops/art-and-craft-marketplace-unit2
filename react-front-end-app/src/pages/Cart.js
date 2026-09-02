import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);

    const loadCart = async () => {
        const cartId = localStorage.getItem("cartId");

        if (!cartId) {
            setCartItems([]);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/cart-items?cartId=${cartId}&t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error("Could not load cart");
            }

            const data = await response.json();

            setCartItems(data);

        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleEdit = (itemId) => {
        setEditingItemId(itemId);
    };

    const updateQuantity = async (item, newQuantity) => {

        if (newQuantity < 1) {
            return;
        }

        if (newQuantity > item.product.quantity) {
            alert(
                `Only ${item.product.quantity} item(s) available.`
            );
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/cart-items/${item.id}?quantity=${newQuantity}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Could not update cart quantity"
                );
            }

            await loadCart();

        } catch (error) {
            console.error(
                "Error updating quantity:",
                error
            );

            alert("Could not update quantity.");
        }
    };

    const handleDelete = async (itemId) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this item from your cart?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/cart-items/${itemId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Could not delete cart item"
                );
            }

            await loadCart();

        } catch (error) {
            console.error(
                "Error deleting cart item:",
                error
            );

            alert("Could not remove item.");
        }
    };

    const total = cartItems.reduce(
        (sum, item) =>
            sum +
            Number(item.product.price) *
            Number(item.quantity),
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

                        <div
                            className="cart-item"
                            key={item.id}
                        >

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

                                <h4>
                                    {item.product.name}
                                </h4>

                                <p>
                                    Price: $
                                    {Number(
                                        item.product.price
                                    ).toFixed(2)}
                                </p>

                                <p>
                                    Available:{" "}
                                    {item.product.quantity}
                                </p>

                                <p>
                                    Subtotal: $
                                    {(
                                        Number(
                                            item.product.price
                                        ) *
                                        Number(
                                            item.quantity
                                        )
                                    ).toFixed(2)}
                                </p>

                                {editingItemId === item.id ? (

                                    <div className="quantity-control">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                item.quantity <= 1
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item,
                                                    item.quantity + 1
                                                )
                                            }
                                            disabled={
                                                item.quantity >=
                                                item.product.quantity
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                ) : (

                                    <p>
                                        Cart Quantity:{" "}
                                        {item.quantity}
                                    </p>
                                )}

                                <div className="cart-item-buttons">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(item.id)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(item.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}

                    <div className="cart-summary">

                        <h3>
                            Total: $
                            {total.toFixed(2)}
                        </h3>

                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Proceed to Checkout
                        </Link>

                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
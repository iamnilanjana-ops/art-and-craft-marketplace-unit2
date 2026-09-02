import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editQuantity, setEditQuantity] = useState(1);

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

    const handleEdit = (item) => {
        setEditingItemId(item.id);
        setEditQuantity(item.quantity);
    };

    const decreaseQuantity = () => {
        if (editQuantity > 1) {
            setEditQuantity(editQuantity - 1);
        }
    };

    const increaseQuantity = (availableQuantity) => {
        if (editQuantity < availableQuantity) {
            setEditQuantity(editQuantity + 1);
        }
    };

    const handleUpdate = async (item) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/cart-items/${item.id}?quantity=${editQuantity}`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Could not update cart quantity");
            }

            await loadCart();
            setEditingItemId(null);

            alert("Cart updated successfully!");

        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Could not update quantity.");
        }
    };

    const handleCancel = () => {
        setEditingItemId(null);
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
                throw new Error("Could not remove cart item");
            }

            await loadCart();

        } catch (error) {
            console.error("Error removing cart item:", error);
            alert("Could not remove item.");
        }
    };

    const total = cartItems.reduce((sum, item) => {
        const quantity =
            editingItemId === item.id
                ? editQuantity
                : item.quantity;

        return (
            sum +
            Number(item.product.price) *
            Number(quantity)
        );
    }, 0);

    return (
        <div className="cart-page">

            <h2>Your Cart</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map((item) => {

                        const displayedQuantity =
                            editingItemId === item.id
                                ? editQuantity
                                : item.quantity;

                        const subtotal =
                            Number(item.product.price) *
                            Number(displayedQuantity);

                        return (
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

                                    {editingItemId === item.id ? (
                                        <>
                                            <div className="quantity-control">

                                                <span>
                                                    Cart Quantity:
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={decreaseQuantity}
                                                    disabled={
                                                        editQuantity <= 1
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {editQuantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            item.product.quantity
                                                        )
                                                    }
                                                    disabled={
                                                        editQuantity >=
                                                        item.product.quantity
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <p>
                                                Subtotal: $
                                                {subtotal.toFixed(2)}
                                            </p>

                                            <div className="cart-item-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleUpdate(item)
                                                    }
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                Cart Quantity:{" "}
                                                {item.quantity}
                                            </p>

                                            <p>
                                                Subtotal: $
                                                {subtotal.toFixed(2)}
                                            </p>

                                            <div className="cart-item-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(item)
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
                                                    Remove
                                                </button>

                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        );
                    })}

                    <div className="cart-summary">

                        <h3>
                            Total: ${total.toFixed(2)}
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
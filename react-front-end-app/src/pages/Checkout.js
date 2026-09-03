import React, { useEffect, useState } from "react";
import "./Checkout.css";
import { Link } from "react-router-dom";

function Checkout() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      const cartId = localStorage.getItem("cartId");

      if (!cartId) {
        setCartItems([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/cart-items?cartId=${cartId}`
        );

        if (!response.ok) {
          throw new Error("Could not load cart items");
        }

        const data = await response.json();
        setCartItems(data);

      } catch (error) {
        console.error("Error loading checkout cart:", error);
      }
    };

    loadCartItems();
  }, []);

  const total = cartItems.reduce((sum, item) => {
    return (
      sum +
      Number(item.product.price) *
      Number(item.quantity)
    );
  }, 0);

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");

    const order = {
      customerName,
      customerEmail,
      shippingAddress
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error("Could not place order");
      }

      const savedOrder = await response.json();

      setOrderId(savedOrder.id);

      localStorage.removeItem("cartId");
      window.dispatchEvent(new Event("cartUpdated"));

      setCustomerName("");
      setCustomerEmail("");
      setShippingAddress("");
      setCartItems([]);

    } catch (error) {
      console.error("Error placing order:", error);
      setError("Order could not be placed. Please try again.");
    }
  };

  if (orderId) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-check">✓</div>

          <h2>Order Confirmed!</h2>

          <p>Thank you for your order.</p>

          <p>
            Your Order ID is: <strong>{orderId}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <p>
        Enter your shipping information to place your order.
      </p>
        <Link to="/cart" className="back-to-cart-button">
        ← Back to Cart
        </Link>

      <div className="order-summary">
        <h3>Order Summary</h3>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const subtotal =
                Number(item.product.price) *
                Number(item.quantity);

              return (
                <div
                  className="order-summary-item"
                  key={item.id}
                >
                  <div>
                    <strong>{item.product.name}</strong>

                    <p>
                      ${Number(item.product.price).toFixed(2)}
                      {" "}×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ${subtotal.toFixed(2)}
                  </strong>
                </div>
              );
            })}

            <div className="order-summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </>
        )}
      </div>

      <form
        onSubmit={placeOrder}
        className="checkout-form"
      >
        <div>
          <label>Full Name</label>

          <input
            type="text"
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            value={customerEmail}
            onChange={(event) =>
              setCustomerEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Shipping Address</label>

          <textarea
            value={shippingAddress}
            onChange={(event) =>
              setShippingAddress(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          className="place-order-button"
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </form>

      <p className="demo-note">
        Demo checkout — no payment information is collected.
      </p>
    </div>
  );
}

export default Checkout;
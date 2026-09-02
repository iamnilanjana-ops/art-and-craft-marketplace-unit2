import React, { useState } from "react";
import "./Checkout.css";

function Checkout() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

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

      setCustomerName("");
      setCustomerEmail("");
      setShippingAddress("");
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
    <div className="page-container">
      <h2>Checkout</h2>

      <p>Enter your shipping information to place your order.</p>

      <form onSubmit={placeOrder}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Shipping Address</label>
          <textarea
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">
          Place Order
        </button>
      </form>

      <p>Demo checkout — no payment information is collected.</p>
    </div>
  );
}

export default Checkout;
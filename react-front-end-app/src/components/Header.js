import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      const cartId = localStorage.getItem("cartId");

      if (!cartId) {
        setCartCount(0);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/cart-items?cartId=${cartId}`
        );

        if (!response.ok) {
          throw new Error("Could not load cart count");
        }

        const data = await response.json();

        const totalQuantity = data.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        );

        setCartCount(totalQuantity);
      } catch (error) {
        console.error("Error loading cart count:", error);
      }
    };

    // Load count when Header first appears
    loadCartCount();

    // Update count whenever the cart changes
    window.addEventListener("cartUpdated", loadCartCount);

    // Clean up listener
    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
    };
  }, []);

  return (
    <header className="header">
      <h1>Art & Craft Marketplace</h1>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/checkout">Checkout</Link>

        <Link to="/cart" className="cart-link">
          🛒 Cart ({cartCount})
        </Link>
      </nav>
    </header>
  );
}

export default Header;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/art-craft-logo.png";
import "./Header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole")
  );

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

    const updateLoginStatus = () => {
      setUserRole(localStorage.getItem("userRole"));
    };

    loadCartCount();

    window.addEventListener("cartUpdated", loadCartCount);
    window.addEventListener("loginUpdated", updateLoginStatus);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
      window.removeEventListener("loginUpdated", updateLoginStatus);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    setUserRole(null);

    window.dispatchEvent(new Event("loginUpdated"));
  };

  return (
    <header className="header">
      <img
        src={logo}
        alt="Art and Craft Marketplace Logo"
        className="header-logo"
      />

      {userRole ? (
        <div className="user-login-area">
          <span className="user-role">
            {userRole === "buyer" ? "Buyer" : "Seller"}
          </span>

          <button
            type="button"
            className="signout-button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link to="/login" className="login-link">
          Login
        </Link>
      )}

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
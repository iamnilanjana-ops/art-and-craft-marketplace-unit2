import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    window.dispatchEvent(new Event("loginUpdated"));

    if (role === "buyer") {
      alert("Buyer login successful!");
      navigate("/");
    } else {
      alert("Seller login successful!");
      navigate("/upload");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2>Marketplace Login</h2>

        <p>Choose how you want to continue.</p>

        <div className="role-options">
          <button
            type="button"
            className={role === "buyer" ? "active-role" : ""}
            onClick={() => setRole("buyer")}
          >
            Buyer
          </button>

          <button
            type="button"
            className={role === "seller" ? "active-role" : ""}
            onClick={() => setRole("seller")}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">
            Login as {role === "buyer" ? "Buyer" : "Seller"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
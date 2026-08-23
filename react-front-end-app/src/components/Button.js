import React, { useState } from "react";

function Button() {
  const [count, setCount] = useState(0);        // Track number of clicks
  const [message, setMessage] = useState("");   // Conditional message

  // Handle button click
  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Conditional message (Step 7)
    if (newCount === 5) {
      setMessage("You clicked 5 times!");
    } else if (newCount > 5) {
      setMessage("Keep going!");
    } else {
      setMessage(""); // clear message for lower clicks
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", width: "250px" }}>
      <h2>Click Counter</h2>
      <button onClick={handleClick}>Click me!</button>
      <p>Clicked: {count} times</p>

      {/* Step 7 — Conditional Rendering */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default Button;
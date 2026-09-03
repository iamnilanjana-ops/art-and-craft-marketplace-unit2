import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";


function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-label">HANDMADE • UNIQUE • CREATIVE</p>

          <h1>Discover Art Made With Heart</h1>

          <p className="home-description">
            Explore unique handmade art and crafts created by talented makers.
            Find something special or share your own creativity with our
            marketplace community.
          </p>

          <div className="home-actions">
            <Link to="/upload" className="home-primary-button">
              Explore Products
            </Link>

            <Link to="/upload" className="home-secondary-button">
              Sell Your Art
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <h2>Why Shop With Us?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Unique Creations</h3>
            <p>
              Discover handmade products that bring creativity and personality
              into everyday life.
            </p>
          </div>

          <div className="feature-card">
            <h3>Creative Makers</h3>
            <p>
              Our marketplace gives artists and makers a place to showcase
              their work.
            </p>
          </div>

          <div className="feature-card">
            <h3>Simple Shopping</h3>
            <p>
              Browse products, add your favorites to the cart, and complete
              your order with our simple checkout.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
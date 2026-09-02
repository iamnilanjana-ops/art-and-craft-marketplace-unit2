import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="about-label">ABOUT OUR MARKETPLACE</p>

        <h1>Connecting Creativity With Community</h1>

        <p className="about-intro">
          Art & Craft Marketplace is a simple online space where creative
          makers can share their work and customers can discover unique
          handmade products.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            Our mission is to support artists and makers by giving them a
            place to showcase their handmade products while making it easy for
            shoppers to discover creative and meaningful items.
          </p>
        </div>

        <div className="about-card">
          <h2>What You Can Do</h2>
          <p>
            Browse available products, add items to your cart, update
            quantities, remove products, and complete a simple checkout
            process.
          </p>
        </div>

        <div className="about-card">
          <h2>For Creative Makers</h2>
          <p>
            Makers can upload products and share their creative work with
            customers through a simple marketplace experience.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
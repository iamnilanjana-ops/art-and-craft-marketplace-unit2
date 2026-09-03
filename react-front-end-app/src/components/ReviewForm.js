import React, { useState } from "react";
import "./ReviewForm.css";

function ReviewForm({ productId, reviews, addReview }) {
  const [formData, setFormData] = useState({
    reviewerName: "",
    rating: "",
    comment: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewerName = formData.reviewerName.trim();
    const comment = formData.comment.trim();
    const rating = Number(formData.rating);

    const reviewerEmail = localStorage.getItem("userEmail");
    const reviewerRole = localStorage.getItem("userRole");

    if (reviewerRole !== "buyer") {
      setError("Only buyers can write reviews.");
      return;
    }

    if (!reviewerEmail) {
      setError("Please login before writing a review.");
      return;
    }

    if (!reviewerName || !comment || !rating) {
      setError("Please complete all fields.");
      return;
    }

    const alreadyReviewed = reviews.some(
      (review) =>
        review.productId === productId &&
        review.reviewerEmail &&
        review.reviewerEmail.toLowerCase() ===
          reviewerEmail.toLowerCase() &&
        review.reviewerRole === "buyer"
    );

    if (alreadyReviewed) {
      setError("You have already reviewed this product.");
      return;
    }

    addReview({
      productId: productId,
      reviewerName: reviewerName,
      reviewerEmail: reviewerEmail,
      reviewerRole: reviewerRole,
      rating: rating,
      comment: comment
    });

    setFormData({
      reviewerName: "",
      rating: "",
      comment: ""
    });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Write a Review</h4>

      <input
        type="text"
        name="reviewerName"
        placeholder="Your Name"
        value={formData.reviewerName}
        onChange={handleChange}
        required
      />

      <select
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        required
      >
        <option value="">Select Rating</option>
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>

      <textarea
        name="comment"
        placeholder="Share your thoughts about this product"
        value={formData.comment}
        onChange={handleChange}
        required
      />

      {error && <p className="review-error">{error}</p>}

      <div className="review-form-buttons">
        <button type="submit">Submit Review</button>
      </div>
    </form>
  );
}

export default ReviewForm;
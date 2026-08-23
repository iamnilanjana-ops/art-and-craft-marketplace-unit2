import React, { useState } from "react";
import "./ReviewForm.css";

// Form for submitting a single review for a given product.
// Enforces: non-empty reviewer name, non-empty comment, rating is an
// integer 1-5, and at most one review per reviewerName per productId.
function ReviewForm({ productId, reviews, addReview }) {
  const [formData, setFormData] = useState({
    reviewerName: "",
    rating: "",
    comment: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    // Clear any previous error once the user starts editing again.
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewerName = formData.reviewerName.trim();
    const comment = formData.comment.trim();
    const rating = Number(formData.rating);

    if (!reviewerName) {
      setError("Reviewer name is required.");
      return;
    }

    if (!comment) {
      setError("Comment is required.");
      return;
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError("Rating must be a whole number between 1 and 5.");
      return;
    }

    const alreadyReviewed = reviews.some(
      (review) =>
        review.productId === productId &&
        review.reviewerName.toLowerCase() === reviewerName.toLowerCase()
    );

    if (alreadyReviewed) {
      setError("You have already reviewed this product");
      return;
    }

    addReview({
      id: Date.now(),
      productId,
      reviewerName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    setFormData({
      reviewerName: "",
      rating: "",
      comment: ""
    });
    setError("");
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

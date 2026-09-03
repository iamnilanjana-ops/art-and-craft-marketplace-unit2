import React from "react";
import "./ReviewList.css";

function ReviewList({ reviews, onEditReview, onDeleteReview }) {
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list">
        <h3>Reviews</h3>
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const averageRating =
    reviews.reduce(
      (total, review) => total + Number(review.rating),
      0
    ) / reviews.length;

  return (
    <div className="review-list">
      <h3>Reviews</h3>

      <h4>
        Average Rating: {averageRating.toFixed(1)} / 5 (
        {reviews.length} reviews)
      </h4>

      {reviews.map((review) => {
        const isOwnReview =
          userRole === "buyer" &&
          review.reviewerRole === "buyer" &&
          review.reviewerEmail &&
          userEmail &&
          review.reviewerEmail.toLowerCase() ===
            userEmail.toLowerCase();

        return (
          <div className="review-item" key={review.id}>
            <div className="review-header">
              <strong>{review.reviewerName}</strong>

              <span className="review-rating">
                {review.rating} / 5
              </span>
            </div>

            <p>{review.comment}</p>

            {isOwnReview && (
              <div className="review-actions">
                <button
                  type="button"
                  onClick={() => onEditReview(review)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteReview(review)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReviewList;
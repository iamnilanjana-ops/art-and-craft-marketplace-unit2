import React from "react";
import "./ReviewList.css";

// Renders the aggregate rating/count for a product's reviews, followed by
// the individual review items. Shows an empty state when there are none.
function ReviewList({ reviews }) {
  const reviewCount = reviews.length;

  const averageRating =
    reviewCount === 0
      ? 0
      : reviews.reduce((total, review) => total + review.rating, 0) /
        reviewCount;

  // Rounded to one decimal place for display (e.g. 4.3 average of 1-5 ratings).
  const displayedAverage = Math.round(averageRating * 10) / 10;

  return (
    <div className="review-list">
      <h4>Reviews</h4>

      {reviewCount === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          <p className="review-summary">
            Average Rating: {displayedAverage} / 5 ({reviewCount}{" "}
            {reviewCount === 1 ? "review" : "reviews"})
          </p>

          <ul className="review-items">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <div className="review-item-header">
                  <span className="review-reviewer-name">
                    {review.reviewerName}
                  </span>
                  <span className="review-rating">{review.rating} / 5</span>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ReviewList;

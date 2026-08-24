import React from "react";
import "./ReviewList.css";

function ReviewList({ reviews }) {

    if (!reviews || reviews.length === 0) {
        return (
            <div className="review-list">
                <h3>Reviews</h3>
                <p>No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    const averageRating =
        reviews.reduce((total, review) => total + Number(review.rating), 0) /
        reviews.length;

    return (
        <div className="review-list">

            <h3>Reviews</h3>

            <h4>
                Average Rating: {averageRating.toFixed(1)} / 5 ({reviews.length} reviews)
            </h4>

            {reviews.map((review) => (
                <div className="review-item" key={review.id}>

                    <div className="review-header">
                        <strong>{review.reviewerName}</strong>

                        <span className="review-rating">
              {review.rating} / 5
            </span>
                    </div>

                    <p>{review.comment}</p>

                </div>
            ))}

        </div>
    );
}

export default ReviewList;
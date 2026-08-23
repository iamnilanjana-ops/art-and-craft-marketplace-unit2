import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewForm from "./ReviewForm";

function fillAndSubmit({ reviewerName, rating, comment }) {
  if (reviewerName !== undefined) {
    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: reviewerName }
    });
  }

  if (rating !== undefined) {
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: rating }
    });
  }

  if (comment !== undefined) {
    fireEvent.change(
      screen.getByPlaceholderText("Share your thoughts about this product"),
      { target: { value: comment } }
    );
  }

  fireEvent.click(screen.getByText("Submit Review"));
}

describe("ReviewForm", () => {
  test("successful submission produces the correct review object", () => {
    const addReview = jest.fn();

    render(
      <ReviewForm productId={1} reviews={[]} addReview={addReview} />
    );

    fillAndSubmit({
      reviewerName: "Alex",
      rating: "4",
      comment: "Great product, loved it!"
    });

    expect(addReview).toHaveBeenCalledTimes(1);

    const submittedReview = addReview.mock.calls[0][0];
    expect(submittedReview).toMatchObject({
      productId: 1,
      reviewerName: "Alex",
      rating: 4,
      comment: "Great product, loved it!"
    });
    expect(submittedReview.id).toBeDefined();
    expect(submittedReview.createdAt).toBeDefined();
  });

  test("validation blocks empty comment", () => {
    const addReview = jest.fn();

    render(
      <ReviewForm productId={1} reviews={[]} addReview={addReview} />
    );

    fillAndSubmit({
      reviewerName: "Alex",
      rating: "3",
      comment: ""
    });

    expect(addReview).not.toHaveBeenCalled();
    expect(screen.getByText("Comment is required.")).toBeInTheDocument();
  });

  test("validation blocks empty/whitespace-only reviewer name", () => {
    const addReview = jest.fn();

    render(
      <ReviewForm productId={1} reviews={[]} addReview={addReview} />
    );

    fillAndSubmit({
      reviewerName: "   ",
      rating: "3",
      comment: "Decent item"
    });

    expect(addReview).not.toHaveBeenCalled();
    expect(screen.getByText("Reviewer name is required.")).toBeInTheDocument();
  });

  test("validation blocks out-of-range/non-integer rating", () => {
    const addReview = jest.fn();

    render(
      <ReviewForm productId={1} reviews={[]} addReview={addReview} />
    );

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Alex" }
    });
    fireEvent.change(
      screen.getByPlaceholderText("Share your thoughts about this product"),
      { target: { value: "Decent item" } }
    );

    // The rendered <select> only offers valid integer options (1-5), so to
    // exercise the out-of-range guard we append an out-of-range option
    // (mirroring what could happen via a manipulated/legacy form payload)
    // before selecting it.
    const select = screen.getByRole("combobox");
    const outOfRangeOption = document.createElement("option");
    outOfRangeOption.value = "6";
    outOfRangeOption.text = "6";
    select.appendChild(outOfRangeOption);

    fireEvent.change(select, { target: { value: "6" } });
    fireEvent.click(screen.getByText("Submit Review"));

    expect(addReview).not.toHaveBeenCalled();
    expect(
      screen.getByText("Rating must be a whole number between 1 and 5.")
    ).toBeInTheDocument();
  });

  test("validation blocks a second review from the same reviewerName on the same productId", () => {
    const addReview = jest.fn();

    const existingReviews = [
      {
        id: 1,
        productId: 1,
        reviewerName: "Alex",
        rating: 5,
        comment: "Loved it",
        createdAt: new Date().toISOString()
      }
    ];

    render(
      <ReviewForm
        productId={1}
        reviews={existingReviews}
        addReview={addReview}
      />
    );

    fillAndSubmit({
      reviewerName: "Alex",
      rating: "3",
      comment: "Trying to review again"
    });

    expect(addReview).not.toHaveBeenCalled();
    expect(
      screen.getByText("You have already reviewed this product")
    ).toBeInTheDocument();
  });
});

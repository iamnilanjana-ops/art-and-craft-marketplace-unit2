import React from "react";
import { render, screen } from "@testing-library/react";
import ReviewList from "./ReviewList";

describe("ReviewList", () => {
  test("renders the correct average/count and review items", () => {
    const reviews = [
      {
        id: 1,
        productId: 1,
        reviewerName: "Alex",
        rating: 4,
        comment: "Really nice quality.",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        productId: 1,
        reviewerName: "Jordan",
        rating: 5,
        comment: "Exceeded expectations!",
        createdAt: new Date().toISOString()
      }
    ];

    render(<ReviewList reviews={reviews} />);

    // Average of 4 and 5 is 4.5.
    expect(
      screen.getByText("Average Rating: 4.5 / 5 (2 reviews)")
    ).toBeInTheDocument();

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("Really nice quality.")).toBeInTheDocument();
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    expect(screen.getByText("Exceeded expectations!")).toBeInTheDocument();
  });

  test("shows the empty state when there are no reviews for a product", () => {
    render(<ReviewList reviews={[]} />);

    expect(
      screen.getByText("No reviews yet. Be the first to review!")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Average Rating/)).not.toBeInTheDocument();
  });
});

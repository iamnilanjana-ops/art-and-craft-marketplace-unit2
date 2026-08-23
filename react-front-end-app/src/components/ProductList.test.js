import React from "react";
import { render, screen, within } from "@testing-library/react";
import ProductList from "./ProductList";

// Verifies that ProductList correctly filters the shared `reviews` array so
// that each ProductCard/ReviewList only ever sees reviews belonging to its
// own productId (src/components/ProductList.js:
// reviews.filter(r => r.productId === product.id)).
describe("ProductList", () => {
  test("each product card only shows reviews belonging to that product", () => {
    const products = [
      { id: 1, name: "Handmade Clay Pot", price: 25 },
      { id: 2, name: "Knitted Scarf", price: 15 }
    ];

    const reviews = [
      {
        id: 101,
        productId: 1,
        reviewerName: "Alex",
        rating: 4,
        comment: "Pot review from Alex",
        createdAt: new Date().toISOString()
      },
      {
        id: 102,
        productId: 1,
        reviewerName: "Sam",
        rating: 5,
        comment: "Another pot review",
        createdAt: new Date().toISOString()
      },
      {
        id: 201,
        productId: 2,
        reviewerName: "Jordan",
        rating: 3,
        comment: "Scarf review from Jordan",
        createdAt: new Date().toISOString()
      }
    ];

    render(
      <ProductList
        products={products}
        deleteProduct={jest.fn()}
        editProduct={jest.fn()}
        reviews={reviews}
        addReview={jest.fn()}
      />
    );

    const potHeading = screen.getByText("Handmade Clay Pot");
    const potCard = potHeading.closest(".product-card");

    const scarfHeading = screen.getByText("Knitted Scarf");
    const scarfCard = scarfHeading.closest(".product-card");

    // The pot's card shows its own two reviews...
    expect(
      within(potCard).getByText("Pot review from Alex")
    ).toBeInTheDocument();
    expect(
      within(potCard).getByText("Another pot review")
    ).toBeInTheDocument();
    expect(
      within(potCard).getByText("Average Rating: 4.5 / 5 (2 reviews)")
    ).toBeInTheDocument();

    // ...but not the scarf's review.
    expect(
      within(potCard).queryByText("Scarf review from Jordan")
    ).not.toBeInTheDocument();

    // The scarf's card shows only its own review...
    expect(
      within(scarfCard).getByText("Scarf review from Jordan")
    ).toBeInTheDocument();
    expect(
      within(scarfCard).getByText("Average Rating: 3 / 5 (1 review)")
    ).toBeInTheDocument();

    // ...and none of the pot's reviews.
    expect(
      within(scarfCard).queryByText("Pot review from Alex")
    ).not.toBeInTheDocument();
    expect(
      within(scarfCard).queryByText("Another pot review")
    ).not.toBeInTheDocument();
  });

  test("renders a product card for every product even when no reviews exist for it", () => {
    const products = [{ id: 1, name: "Wooden Wall Art", price: 40 }];

    render(
      <ProductList
        products={products}
        deleteProduct={jest.fn()}
        editProduct={jest.fn()}
        reviews={[]}
        addReview={jest.fn()}
      />
    );

    expect(screen.getByText("Wooden Wall Art")).toBeInTheDocument();
    expect(
      screen.getByText("No reviews yet. Be the first to review!")
    ).toBeInTheDocument();
  });
});

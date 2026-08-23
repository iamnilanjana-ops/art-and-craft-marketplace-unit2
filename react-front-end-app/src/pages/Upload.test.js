import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Upload from "./Upload";

// Upload.js owns `products`/`reviews` state, mirrors both to localStorage
// ("products" / "reviews" keys), and cascades review deletion when a
// product is deleted. These tests seed/inspect localStorage directly and
// drive the real rendered UI (UploadForm / ProductList / ProductCard /
// ReviewForm) rather than reaching into component internals.

function getCardByProductName(name) {
  return screen.getByText(name).closest(".product-card");
}

function submitReview(card, { reviewerName, rating, comment }) {
  fireEvent.change(within(card).getByPlaceholderText("Your Name"), {
    target: { value: reviewerName }
  });
  fireEvent.change(within(card).getByRole("combobox"), {
    target: { value: rating }
  });
  fireEvent.change(
    within(card).getByPlaceholderText(
      "Share your thoughts about this product"
    ),
    { target: { value: comment } }
  );
  fireEvent.click(within(card).getByText("Submit Review"));
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("Upload page - reviews localStorage persistence", () => {
  test("loads reviews from the 'reviews' localStorage key on mount and displays them for the correct product", () => {
    const seededProducts = [
      { id: 1, name: "Test Product One", price: 10 },
      { id: 2, name: "Test Product Two", price: 20 }
    ];
    const seededReviews = [
      {
        id: 501,
        productId: 1,
        reviewerName: "Priya",
        rating: 5,
        comment: "Preloaded review for product one",
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem("products", JSON.stringify(seededProducts));
    localStorage.setItem("reviews", JSON.stringify(seededReviews));

    render(<Upload />);

    const productOneCard = getCardByProductName("Test Product One");
    const productTwoCard = getCardByProductName("Test Product Two");

    expect(
      within(productOneCard).getByText("Preloaded review for product one")
    ).toBeInTheDocument();
    expect(
      within(productTwoCard).queryByText(
        "Preloaded review for product one"
      )
    ).not.toBeInTheDocument();
    expect(
      within(productTwoCard).getByText(
        "No reviews yet. Be the first to review!"
      )
    ).toBeInTheDocument();
  });

  test("adding a review via the addReview flow persists the updated array back to the 'reviews' localStorage key", () => {
    const seededProducts = [{ id: 1, name: "Test Product One", price: 10 }];
    localStorage.setItem("products", JSON.stringify(seededProducts));
    localStorage.setItem("reviews", JSON.stringify([]));

    render(<Upload />);

    const card = getCardByProductName("Test Product One");
    submitReview(card, {
      reviewerName: "Morgan",
      rating: "4",
      comment: "Solid purchase, would buy again"
    });

    // Reflected in the UI...
    expect(
      within(card).getByText("Solid purchase, would buy again")
    ).toBeInTheDocument();

    // ...and persisted to localStorage under the "reviews" key.
    const storedReviews = JSON.parse(localStorage.getItem("reviews"));
    expect(storedReviews).toHaveLength(1);
    expect(storedReviews[0]).toMatchObject({
      productId: 1,
      reviewerName: "Morgan",
      rating: 4,
      comment: "Solid purchase, would buy again"
    });
  });
});

describe("Upload page - cascade delete", () => {
  test("deleting a product removes only that product's reviews from state and localStorage, leaving other products' reviews intact", () => {
    const seededProducts = [
      { id: 1, name: "Test Product One", price: 10 },
      { id: 2, name: "Test Product Two", price: 20 }
    ];
    const seededReviews = [
      {
        id: 601,
        productId: 1,
        reviewerName: "Priya",
        rating: 5,
        comment: "Review for product one",
        createdAt: new Date().toISOString()
      },
      {
        id: 602,
        productId: 2,
        reviewerName: "Sam",
        rating: 3,
        comment: "Review for product two",
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem("products", JSON.stringify(seededProducts));
    localStorage.setItem("reviews", JSON.stringify(seededReviews));

    render(<Upload />);

    const productOneCard = getCardByProductName("Test Product One");
    fireEvent.click(within(productOneCard).getByText("Delete"));

    // Product one (and its card/review) is gone from the DOM...
    expect(screen.queryByText("Test Product One")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Review for product one")
    ).not.toBeInTheDocument();

    // ...but product two and its review remain.
    const productTwoCard = getCardByProductName("Test Product Two");
    expect(
      within(productTwoCard).getByText("Review for product two")
    ).toBeInTheDocument();

    // localStorage reflects both the product removal and the cascade
    // delete of its reviews, while leaving unrelated data intact.
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    expect(storedProducts).toHaveLength(1);
    expect(storedProducts[0]).toMatchObject({ id: 2 });

    const storedReviews = JSON.parse(localStorage.getItem("reviews"));
    expect(storedReviews).toHaveLength(1);
    expect(storedReviews[0]).toMatchObject({ productId: 2 });
  });
});

describe("Upload page - regression coverage", () => {
  test("adding a product still updates state and persists to the 'products' localStorage key", () => {
    localStorage.setItem("products", JSON.stringify([]));
    localStorage.setItem("reviews", JSON.stringify([]));

    render(<Upload />);

    fireEvent.change(screen.getByPlaceholderText("Product Name"), {
      target: { value: "Brand New Product" }
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "99" }
    });
    // UploadForm's <h3> heading also reads "Add Product" when not editing,
    // so scope to the submit button specifically to avoid ambiguity.
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    expect(screen.getByText("Brand New Product")).toBeInTheDocument();

    const storedProducts = JSON.parse(localStorage.getItem("products"));
    expect(storedProducts).toHaveLength(1);
    expect(storedProducts[0]).toMatchObject({
      name: "Brand New Product",
      price: "99"
    });
  });

  test("deleting a product still removes the product itself from state and localStorage", () => {
    const seededProducts = [{ id: 1, name: "Test Product One", price: 10 }];
    localStorage.setItem("products", JSON.stringify(seededProducts));
    localStorage.setItem("reviews", JSON.stringify([]));

    render(<Upload />);

    const card = getCardByProductName("Test Product One");
    fireEvent.click(within(card).getByText("Delete"));

    expect(screen.queryByText("Test Product One")).not.toBeInTheDocument();

    const storedProducts = JSON.parse(localStorage.getItem("products"));
    expect(storedProducts).toHaveLength(0);
  });
});

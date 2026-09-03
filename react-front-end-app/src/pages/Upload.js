import React, { useEffect, useState } from "react";
import UploadForm from "../components/UploadForm";
import ProductList from "../components/ProductList";

function Upload() {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    // GET products
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) =>
                console.error("Error fetching products:", error)
            );
    }, []);

    // GET reviews
    useEffect(() => {
        fetch("http://localhost:8080/api/reviews")
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) =>
                console.error("Error fetching reviews:", error)
            );
    }, []);

    // ADD product
    const addProduct = (product) => {
        return fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
            .then((response) => response.json())
            .then((savedProduct) => {
                setProducts((currentProducts) => [
                    ...currentProducts,
                    savedProduct
                ]);

                return savedProduct;
            })
            .catch((error) =>
                console.error("Error adding product:", error)
            );
    };

    // EDIT product
    const editProduct = (product) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // UPDATE product
    const updateProduct = async (updatedProduct) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/products/${updatedProduct.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedProduct)
                }
            );

            if (!response.ok) {
                alert("Update failed. Status: " + response.status);
                return;
            }

            const savedProduct = await response.json();

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === savedProduct.id
                        ? savedProduct
                        : product
                )
            );

            setEditingProduct(null);

            alert("Product updated successfully!");

            return savedProduct;

        } catch (error) {
            console.error("Error updating product:", error);
            alert("Product update failed.");
        }
    };

    // DELETE product
    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                setProducts((currentProducts) =>
                    currentProducts.filter(
                        (product) => product.id !== id
                    )
                );
            })
            .catch((error) =>
                console.error("Error deleting product:", error)
            );
    };

    // ADD review
    const addReview = (review) => {
        fetch("http://localhost:8080/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Could not add review");
                }

                return response.json();
            })
            .then((savedReview) => {
                setReviews((currentReviews) => [
                    ...currentReviews,
                    savedReview
                ]);
            })
            .catch((error) => {
                console.error("Error adding review:", error);
                alert("Could not add review.");
            });
    };

    // EDIT review
    const editReview = async (review) => {
        const updatedComment = window.prompt(
            "Edit your review:",
            review.comment
        );

        if (updatedComment === null) {
            return;
        }

        const trimmedComment = updatedComment.trim();

        if (!trimmedComment) {
            alert("Review comment cannot be empty.");
            return;
        }

        const ratingInput = window.prompt(
            "Enter rating from 1 to 5:",
            review.rating
        );

        if (ratingInput === null) {
            return;
        }

        const updatedRating = Number(ratingInput);

        if (
            !Number.isInteger(updatedRating) ||
            updatedRating < 1 ||
            updatedRating > 5
        ) {
            alert("Rating must be between 1 and 5.");
            return;
        }

        const reviewerEmail = localStorage.getItem("userEmail");
        const reviewerRole = localStorage.getItem("userRole");

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/${review.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...review,
                        reviewerEmail,
                        reviewerRole,
                        rating: updatedRating,
                        comment: trimmedComment
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Could not update review");
            }

            const savedReview = await response.json();

            setReviews((currentReviews) =>
                currentReviews.map((currentReview) =>
                    currentReview.id === savedReview.id
                        ? savedReview
                        : currentReview
                )
            );

            alert("Review updated successfully!");

        } catch (error) {
            console.error("Error updating review:", error);
            alert("Could not update review.");
        }
    };

    // DELETE review
    const deleteReview = async (review) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your review?"
        );

        if (!confirmed) {
            return;
        }

        const reviewerEmail = localStorage.getItem("userEmail");
        const reviewerRole = localStorage.getItem("userRole");

        try {
            const response = await fetch(
                `http://localhost:8080/api/reviews/${review.id}?reviewerEmail=${encodeURIComponent(
                    reviewerEmail
                )}&reviewerRole=${encodeURIComponent(reviewerRole)}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Could not delete review");
            }

            setReviews((currentReviews) =>
                currentReviews.filter(
                    (currentReview) =>
                        currentReview.id !== review.id
                )
            );

            alert("Review deleted successfully!");

        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Could not delete review.");
        }
    };

    // ADD TO CART
    const addToCart = async (productId) => {
        try {
            let cartId = localStorage.getItem("cartId");

            if (!cartId) {
                const cartResponse = await fetch(
                    "http://localhost:8080/api/cart",
                    {
                        method: "POST"
                    }
                );

                const newCart = await cartResponse.json();

                cartId = newCart.id;
                localStorage.setItem("cartId", cartId);
            }

            const response = await fetch(
                `http://localhost:8080/api/cart-items?cartId=${cartId}&productId=${productId}&quantity=1`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error("Could not add item to cart");
            }

            alert("Product added to cart!");
            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="page-container">
            <h2>Upload Page</h2>

            <UploadForm
                addProduct={addProduct}
                editingProduct={editingProduct}
                updateProduct={updateProduct}
                setEditingProduct={setEditingProduct}
            />

            <ProductList
                products={products}
                deleteProduct={deleteProduct}
                editProduct={editProduct}
                reviews={reviews}
                addReview={addReview}
                addToCart={addToCart}
                editReview={editReview}
                deleteReview={deleteReview}
            />
        </div>
    );
}

export default Upload;
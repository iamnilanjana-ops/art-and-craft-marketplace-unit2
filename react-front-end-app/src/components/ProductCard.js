import React from "react";
import "./ProductCard.css";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

function ProductCard({
    product,
    deleteProduct,
    editProduct,
    reviews,
    addReview,
    addToCart
}) {
    return (
        <div className="product-card">
            <h4>{product.name}</h4>

            <p className="price">Price: ${product.price}</p>
            <p>Available Quantity: {product.quantity}</p>

            <p>{product.description}</p>

            {product.image ? (
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            ) : (
                <p>No image available</p>
            )}

            <div className="card-buttons">
                <button
                    type="button"
                    onClick={() => editProduct(product)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                >
                    Delete
                </button>

                <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                >
                    Add to Cart
                </button>
            </div>

            <ReviewList reviews={reviews} />

            <ReviewForm
                productId={product.id}
                reviews={reviews}
                addReview={addReview}
            />
        </div>
    );
}

export default ProductCard;
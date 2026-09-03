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
    addToCart,
    editReview,
    deleteReview
}) {
    return (
        <div className="product-row-wrapper">

            <div className="product-table-row">

                <div className="product-name-cell">
                    <strong>{product.name}</strong>
                </div>

                <div className="product-image-cell">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="table-product-image"
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>

                <div className="product-details-cell">
                    <p>{product.description || "No description"}</p>

                    <p>
                        Quantity: {product.quantity}
                    </p>
                </div>

                <div className="product-price-cell">
                    ${Number(product.price).toFixed(2)}
                </div>

                <div className="product-stock-cell">
                    {product.quantity > 0 ? (
                        <span className="in-stock">
                            In Stock
                        </span>
                    ) : (
                        <span className="out-of-stock">
                            Out of Stock
                        </span>
                    )}
                </div>

                <div className="product-actions-cell">

                    <button
                        type="button"
                        className="edit-button"
                        onClick={() => editProduct(product)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteProduct(product.id)}
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        className="cart-button"
                        onClick={() => addToCart(product.id)}
                        disabled={product.quantity === 0}
                    >
                        {product.quantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </button>

                </div>

            </div>

            <div className="product-review-row">

                <div className="review-title">
                    Reviews
                </div>

                <ReviewList
                    reviews={reviews}
                    onEditReview={editReview}
                    onDeleteReview={deleteReview}
                />

                <ReviewForm
                    productId={product.id}
                    reviews={reviews}
                    addReview={addReview}
                />

            </div>

        </div>
    );
}

export default ProductCard;
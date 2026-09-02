import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

function ProductList({
  products,
  deleteProduct,
  editProduct,
  reviews,
  addReview,
  addToCart
}) {
  return (
    <div className="product-list">
      <h3>Product List</h3>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              deleteProduct={deleteProduct}
              editProduct={editProduct}
              reviews={reviews.filter(
                (review) => review.productId === product.id
              )}
              addReview={addReview}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
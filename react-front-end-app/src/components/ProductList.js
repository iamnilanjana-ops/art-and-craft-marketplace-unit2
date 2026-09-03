import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

function ProductList({
  products,
  deleteProduct,
  editProduct,
  reviews,
  addReview,
  addToCart,
  editReview,
  deleteReview
}) {
  return (
    <div className="product-list">
      <h3>Product List</h3>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-table">

          <div className="product-table-header">
            <div>Product Name</div>
            <div>Image</div>
            <div>Details</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>

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
              editReview={editReview}
              deleteReview={deleteReview}
            />
          ))}

        </div>
      )}
    </div>
  );
}

export default ProductList;
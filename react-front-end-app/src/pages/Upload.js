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
            .then((response) => response.json())
            .then((savedReview) => {
                setReviews((currentReviews) => [
                    ...currentReviews,
                    savedReview
                ]);
            })
            .catch((error) =>
                console.error("Error adding review:", error)
            );
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
            />
        </div>
    );
}

export default Upload;
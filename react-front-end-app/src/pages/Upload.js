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
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // GET reviews
    useEffect(() => {
        fetch("http://localhost:8080/api/reviews")
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    // ADD product
    const addProduct = (product) => {
        fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
            .then((response) => response.json())
            .then((savedProduct) => {
                setProducts([...products, savedProduct]);
            })
            .catch((error) => console.error("Error adding product:", error));
    };

    // EDIT button
    const editProduct = (product) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // UPDATE product
    const updateProduct = (updatedProduct) => {
        fetch(`http://localhost:8080/api/products/${updatedProduct.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProduct)
        })
            .then((response) => response.json())
            .then((savedProduct) => {
                setProducts(
                    products.map((product) =>
                        product.id === savedProduct.id
                            ? savedProduct
                            : product
                    )
                );

                setEditingProduct(null);
            })
            .catch((error) =>
                console.error("Error updating product:", error)
            );
    };

    // DELETE product
    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                setProducts(
                    products.filter((product) => product.id !== id)
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
                setReviews([...reviews, savedReview]);
            })
            .catch((error) =>
                console.error("Error adding review:", error)
            );
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
            />
        </div>
    );
}

export default Upload;
import React, { useEffect, useState } from "react";
import UploadForm from "../components/UploadForm";
import ProductList from "../components/ProductList";

function Upload() {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    // GET products from backend
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // GET reviews from backend
    useEffect(() => {
        fetch("http://localhost:8080/api/reviews")
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error("Error fetching reviews:", error));
    }, []);

    // POST new product to backend
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

    const deleteProduct = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const editProduct = (product) => {
        setEditingProduct(product);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(
            products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );

        setEditingProduct(null);
    };

    // POST new review to backend
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
            .catch((error) => console.error("Error adding review:", error));
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
import React, { useEffect, useState } from "react";
import "./UploadForm.css";

function UploadForm({
    addProduct,
    editingProduct,
    updateProduct,
    setEditingProduct
}) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name || "");
            setPrice(editingProduct.price || "");
            setQuantity(editingProduct.quantity || "");
            setDescription(editingProduct.description || "");
            setImage(editingProduct.image || "");
        }
    }, [editingProduct]);

    const handleImageFile = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const product = {
            id: editingProduct ? editingProduct.id : undefined,
            name: name,
            price: Number(price),
            quantity: Number(quantity),
            description: description,
            image: image
        };

        if (editingProduct) {
            updateProduct(product);
        } else {
            addProduct(product);
        }

        setName("");
        setPrice("");
        setQuantity("");
        setDescription("");
        setImage("");
        setEditingProduct(null);
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setName("");
        setPrice("");
        setQuantity("");
        setDescription("");
        setImage("");
    };

    return (
        <form className="upload-form" onSubmit={handleSubmit}>
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

            <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Price"
                value={price}
                min="0.01"
                step="0.01"
                onChange={(event) => setPrice(event.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                min="0"
                step="1"
                onChange={(event) => setQuantity(event.target.value)}
                required
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <input
                type="text"
                placeholder="Paste image URL (optional)"
                value={image.startsWith("data:") ? "" : image}
                onChange={(event) => setImage(event.target.value)}
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleImageFile}
            />

            {image && (
                <img
                    src={image}
                    alt="Preview"
                    className="product-image"
                />
            )}

            <div className="form-buttons">
                <button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                </button>

                {editingProduct && (
                    <button type="button" onClick={cancelEdit}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default UploadForm;
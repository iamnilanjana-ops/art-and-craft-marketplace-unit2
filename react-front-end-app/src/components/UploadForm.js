import React, { useState } from "react";
import "./UploadForm.css";

function UploadForm({ addProduct }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

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
            name: name,
            price: Number(price),
            description: description,
            image: image
        };

        addProduct(product);

        setName("");
        setPrice("");
        setDescription("");
        setImage("");
    };

    return (
        <form className="upload-form" onSubmit={handleSubmit}>
            <h3>Add Product</h3>

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
                onChange={(event) => setPrice(event.target.value)}
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

            <button type="submit">Add Product</button>
        </form>
    );
}

export default UploadForm;
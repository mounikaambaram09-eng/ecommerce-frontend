import React, { useState, useEffect } from "react";

const ProductForm = ({ selectedProduct, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    fetch("http://localhost:5000/category/list")
      .then((res) => res.json())
      .then((data) => {
        const catData = data.data || data;
        if (Array.isArray(catData)) setCategories(catData);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        price: selectedProduct.price || "",
        description: selectedProduct.description || "",
        stock: selectedProduct.stock || "",
        categoryId: selectedProduct.categoryId?._id || selectedProduct.categoryId || "",
        image: selectedProduct.image || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        stock: "",
        categoryId: "",
        image: "",
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isEdit = Boolean(selectedProduct);
    const prodId = selectedProduct?._id || selectedProduct?.id;

    
    const url = isEdit
      ? `http://localhost:5000/product/${prodId}`
      : "http://localhost:5000/product/create";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

    
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response (${res.status}). Check backend routes.`);
      }

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Operation failed");
      }

      alert(isEdit ? "Product updated successfully!" : "Product created successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{selectedProduct ? "Edit Product" : "Add New Product"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "10px" }}>
        <label>Product Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Price (₹):</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Category:</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Image Path / URL:</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : selectedProduct ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
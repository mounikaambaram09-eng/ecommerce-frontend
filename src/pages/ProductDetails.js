import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/cartcontext";

const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/product/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setProduct(resData.data);
        } else {
          setProduct(resData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading Product Details...</h2>;
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "red" }}>{error || "Product not found"}</h2>
        <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>← Back to Products</Link>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${cleanPath}`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "20px auto", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name || "Product"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
          }}
          style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "4px" }}
        />
      </div>

      <h2>{product.name}</h2>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>
        Price: ₹{product.price}
      </p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <div style={{ marginTop: "15px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
        <strong>Quantity:</strong>
        <button 
          onClick={handleDecrease}
          style={{ padding: "5px 12px", border: "1px solid #ccc", background: "#f8f9fa", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}
        >
          -
        </button>
        <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>
          {quantity}
        </span>
        <button 
          onClick={handleIncrease}
          style={{ padding: "5px 12px", border: "1px solid #ccc", background: "#f8f9fa", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}
        >
          +
        </button>
      </div>

      <button
        onClick={() => addToCart(product._id || product.id, quantity)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Add to Cart ({quantity})
      </button>
      
      <br /><br />
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>← Back to Products</Link>
    </div>
  );
};

export default ProductDetails;
import React, { useContext } from "react";
import { CartContext } from "../context/cartcontext";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  const product = typeof item.productId === "object" ? item.productId : (item.product || {});

  
  const cartItemId = item._id;

  const productName = product.name || item.name || "Product";
  const itemPrice = item.price || product.price || 0;
  
  const imageUrl = product.image 
    ? `http://localhost:5000/uploads/${product.image.replace(/^\/uploads\//, '')}` 
    : "https://via.placeholder.com/80";

  const handleRemove = () => {
    console.log("Cart Item ID for Removal:", cartItemId);
    if (cartItemId) {
      removeFromCart(cartItemId);
    } else {
      console.error("Cart Item ID missing for item:", item);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px",
        borderBottom: "1px solid #ddd",
        marginBottom: "10px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img
          src={imageUrl}
          alt={productName}
          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/80?text=No+Image";
          }}
        />
        <div>
          <h4 style={{ margin: "0 0 5px 0" }}>{productName}</h4>
          <p style={{ margin: 0, color: "#666" }}>Price: ₹{itemPrice}</p>
          <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
            Subtotal: ₹{itemPrice * (item.quantity || 1)}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => updateQuantity(cartItemId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          style={{
            padding: "5px 12px",
            fontSize: "16px",
            cursor: item.quantity <= 1 ? "not-allowed" : "pointer"
          }}
        >
          -
        </button>

        <span style={{ fontSize: "16px", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>
          {item.quantity}
        </span>

        <button
          onClick={() => updateQuantity(cartItemId, item.quantity + 1)}
          style={{ padding: "5px 12px", fontSize: "16px", cursor: "pointer" }}
        >
          +
        </button>
      </div>

      <button
        onClick={handleRemove}
        style={{
          backgroundColor: "#ff4d4f",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Remove 🗑️
      </button>
    </div>
  );
}

export default CartItem;
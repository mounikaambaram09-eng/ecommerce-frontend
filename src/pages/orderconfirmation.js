import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "green" }}>Order Placed Successfully!</h1>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      
      <div style={{ margin: "20px 0", fontSize: "18px" }}>
        <strong>Order ID: </strong> 
        <span style={{ background: "#f1f1f1", padding: "5px 10px", borderRadius: "4px" }}>{orderId}</span>
      </div>

      <button 
        onClick={() => navigate("/products")}
        style={{ padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}
      >
        Continue Shopping
      </button>
    </div>
  );
}
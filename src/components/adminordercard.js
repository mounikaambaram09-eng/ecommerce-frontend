import React from "react";
import { Link } from "react-router-dom";

const AdminOrderCard = ({ order }) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      }}
    >

     
      <p style={{ marginBottom: "10px" }}>
        <strong>Order ID:</strong> {order._id}
      </p>

      
      <p style={{ marginBottom: "10px" }}>
        <strong>Customer:</strong>{" "}
        {order.userId?.name || "Customer"}
      </p>

      <p style={{ marginBottom: "10px" }}>
        <strong>Customer Email:</strong>{" "}
        {order.userId?.email || "N/A"}
      </p>

      
      <p style={{ marginBottom: "10px" }}>
        <strong>Date:</strong>{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : "N/A"}
      </p>

   
      <div
        style={{
          marginTop: "18px",
          marginBottom: "18px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <strong>Products:</strong>

        {order.items?.length > 0 ? (
          <div style={{ marginTop: "10px" }}>

            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    index !== order.items.length - 1
                      ? "1px solid #ddd"
                      : "none",
                }}
              >

                <div>
                  <strong>{item.name}</strong>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    Quantity: {item.quantity}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  ₹{item.total}
                </div>

              </div>
            ))}

          </div>
        ) : (
          <p style={{ color: "#777" }}>
            No products found
          </p>
        )}
      </div>

     
      <p style={{ marginBottom: "10px" }}>
        <strong>Total Items:</strong>{" "}
        {order.items?.length || 0}
      </p>

     
      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        <strong>Total Amount:</strong> ₹
        {order.totalAmount || 0}
      </p>

      <p style={{ marginBottom: "15px" }}>
        <strong>Status:</strong>{" "}

        <span
          style={{
            display: "inline-block",
            padding: "5px 12px",
            borderRadius: "15px",
            backgroundColor:
              order.status === "delivered"
                ? "#d4edda"
                : order.status === "cancelled"
                ? "#f8d7da"
                : order.status === "shipped"
                ? "#d1ecf1"
                : "#fff3cd",
            color:
              order.status === "delivered"
                ? "#155724"
                : order.status === "cancelled"
                ? "#721c24"
                : order.status === "shipped"
                ? "#0c5460"
                : "#856404",
            fontWeight: "bold",
            fontSize: "13px",
          }}
        >
          {order.status || "N/A"}
        </span>
      </p>

      
      <Link
        to={`/admin/orders/${order._id}`}
        style={{
          display: "inline-block",
          marginTop: "5px",
          padding: "10px 18px",
          backgroundColor: "#333",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        View Details
      </Link>

    </div>
  );
};

export default AdminOrderCard;
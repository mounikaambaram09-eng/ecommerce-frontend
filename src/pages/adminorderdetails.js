import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        const orderData = data.data || data;

        setOrder(orderData);
        setStatus(orderData.status || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    try {
      setUpdating(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setOrder(data.data || data);
      setMessage("Order status updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading order details...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Order not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <Link
        to="/admin/orders"
        style={{
          textDecoration: "none",
          color: "#007bff",
        }}
      >
        &larr; Back to Admin Orders
      </Link>

      <h2 style={{ marginTop: "20px" }}>Admin Order Details</h2>

      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h3>Order Information</h3>

        <p>
          <strong>Order ID:</strong> {order._id}
        </p>

        <p>
          <strong>Customer ID:</strong>{" "}
          {order.userId?._id || order.userId || "N/A"}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : "N/A"}
        </p>

        <hr />

        <h3>Products</h3>

        {order.items?.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <strong>{item.name}</strong>
              <p style={{ margin: "5px 0" }}>
                Quantity: {item.quantity}
              </p>
              <p style={{ margin: "5px 0" }}>
                Price: ₹{item.price}
              </p>
            </div>

            <strong>₹{item.total}</strong>
          </div>
        ))}

        <hr />

        <h3>Delivery Information</h3>

        <p>
          <strong>Address:</strong>{" "}
          {order.shippingAddress?.address || "N/A"}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {order.shippingAddress?.city || "N/A"}
        </p>

        <p>
          <strong>Postal Code:</strong>{" "}
          {order.shippingAddress?.postalCode || "N/A"}
        </p>

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <span>Total Amount:</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <hr />

        <h3>Update Order Status</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={updating}
          style={{
            padding: "10px",
            width: "200px",
            marginRight: "10px",
          }}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={updateStatus}
          disabled={updating}
          style={{
            padding: "10px 15px",
            cursor: updating ? "not-allowed" : "pointer",
          }}
        >
          {updating ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
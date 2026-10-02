import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setActionError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to update order status"
        );
      }

      const updatedOrder = data.data || data.order || data;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...(updatedOrder &&
                typeof updatedOrder === "object"
                  ? updatedOrder
                  : {}),
                status:
                  updatedOrder?.status || newStatus,
              }
            : order
        )
      );
    } catch (err) {
      setActionError(
        err.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };


  const cancelOrder = async (orderId) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!shouldCancel) return;

    try {
      setUpdatingOrderId(orderId);
      setActionError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to cancel order"
        );
      }

      const updatedOrder = data.data || data.order || data;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...(updatedOrder &&
                typeof updatedOrder === "object"
                  ? updatedOrder
                  : {}),
                status:
                  updatedOrder?.status || "cancelled",
              }
            : order
        )
      );
    } catch (err) {
      setActionError(
        err.message || "Failed to cancel order"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <div className="admin-orders-page">
          <div className="loading-box">
            <div className="loader"></div>

            <h3>Loading Orders...</h3>

            <p>Please wait...</p>
          </div>
        </div>
      </>
    );
  }


  if (error) {
    return (
      <>
        <style>{styles}</style>

        <div className="admin-orders-page">
          <div className="error-box">
            <h2>Unable to load orders</h2>

            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }


  if (orders.length === 0) {
    return (
      <>
        <style>{styles}</style>

        <div className="admin-orders-page">

          <div className="page-heading">

            <div>
              <h1>Admin Orders</h1>

              <p>
                Manage customer orders
              </p>
            </div>

            <div className="total-box">
              <span>0</span>

              <small>
                Total Orders
              </small>
            </div>

          </div>

          <div className="empty-box">

            <div className="empty-icon">
              📦
            </div>

            <h2>
              No Orders Found
            </h2>

            <p>
              There are no customer orders available.
            </p>

          </div>

        </div>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>

      <div className="admin-orders-page">

        

        <div className="page-heading">

          <div className="heading-left">

            <div className="heading-icon">
              📋
            </div>

            <div>

              <h1>
                Admin Orders
              </h1>

              <p>
                Manage and track customer orders
              </p>

            </div>

          </div>

          <div className="total-box">

            <span>
              {orders.length}
            </span>

            <small>
              Total Orders
            </small>

          </div>

        </div>


        {actionError && (
          <div className="action-error">

            <span>
              {actionError}
            </span>

            <button
              type="button"
              onClick={() => setActionError("")}
              aria-label="Close error"
            >
              ×
            </button>

          </div>
        )}


        <div className="orders-grid">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

             

              <div className="card-header">

                <div>

                  <span className="label">
                    ORDER ID
                  </span>

                  <h3>
                    {order._id}
                  </h3>

                </div>

                <span
                  className={`status ${
                    order.status
                      ? order.status.toLowerCase()
                      : "unknown"
                  }`}
                >

                  <span className="status-circle"></span>

                  {order.status || "N/A"}

                </span>

              </div>

              

              <div className="order-details">

                <div className="detail-row">

                  <span className="detail-label">
                    Customer
                  </span>

                  <span className="detail-value">
                    {order.userId?._id ||
                      order.userId ||
                      "N/A"}
                  </span>

                </div>

                <div className="detail-row">

                  <span className="detail-label">
                    Date
                  </span>

                  <span className="detail-value">

                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "N/A"}

                  </span>

                </div>

                <div className="detail-row">

                  <span className="detail-label">
                    Items
                  </span>

                  <span className="detail-value">
                    {order.items?.length || 0}
                  </span>

                </div>

              </div>

             

              {order.items &&
                order.items.length > 0 && (

                  <div className="products-box">

                    <div className="products-heading">
                      Products
                    </div>

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="product-row"
                          key={index}
                        >

                          <div className="product-left">

                            <div className="product-image">
                              🛍️
                            </div>

                            <div>

                              <strong>
                                {item.name || "N/A"}
                              </strong>

                              <span>
                                Quantity:{" "}
                                {item.quantity || 0}
                              </span>

                            </div>

                          </div>

                          <div className="product-price">

                            <span>
                              ₹{item.price || 0}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              <div className="status-actions">

              
                {order.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="action-button confirm-button"
                      disabled={
                        updatingOrderId === order._id
                      }
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "confirmed"
                        )
                      }
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : "✓ Confirm"}
                    </button>

                    <button
                      type="button"
                      className="action-button cancel-button"
                      disabled={
                        updatingOrderId === order._id
                      }
                      onClick={() =>
                        cancelOrder(order._id)
                      }
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : "✕ Cancel"}
                    </button>
                  </>
                )}

              

                {order.status === "confirmed" && (
                  <>
                    <button
                      type="button"
                      className="action-button ship-button"
                      disabled={
                        updatingOrderId === order._id
                      }
                      onClick={() =>
                        updateOrderStatus(
                          order._id,
                          "shipped"
                        )
                      }
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : "🚚 Ship Order"}
                    </button>

                    <button
                      type="button"
                      className="action-button cancel-button"
                      disabled={
                        updatingOrderId === order._id
                      }
                      onClick={() =>
                        cancelOrder(order._id)
                      }
                    >
                      {updatingOrderId === order._id
                        ? "Updating..."
                        : "✕ Cancel"}
                    </button>
                  </>
                )}


                {order.status === "shipped" && (
                  <button
                    type="button"
                    className="action-button deliver-button"
                    disabled={
                      updatingOrderId === order._id
                    }
                    onClick={() =>
                      updateOrderStatus(
                        order._id,
                        "delivered"
                      )
                    }
                  >
                    {updatingOrderId === order._id
                      ? "Updating..."
                      : "✓ Mark Delivered"}
                  </button>
                )}


                {order.status === "delivered" && (
                  <span className="final-status delivered-final">
                    ✓ Order Delivered
                  </span>
                )}


                {order.status === "cancelled" && (
                  <span className="final-status cancelled-final">
                    ✕ Order Cancelled
                  </span>
                )}

              </div>

              

              <div className="card-footer">

                <div className="total-section">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{order.totalAmount || 0}
                  </strong>

                </div>

                <Link
                  to={`/admin/orders/${order._id}`}
                  className="details-button"
                >
                  View Details

                  <span>
                    →
                  </span>

                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
};



const styles = `

.admin-orders-page {
  min-height: calc(100vh - 80px);

  padding: 38px 45px 60px;

  background: #f4f6f5;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #243238;
}



.page-heading {

  max-width: 1250px;

  margin: 0 auto 30px;

  padding: 27px 32px;

  background: #ffffff;

  border: 1px solid #e2e7e5;

  border-radius: 15px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  box-shadow:
    0 6px 18px
    rgba(36, 50, 56, 0.07);

}


.heading-left {

  display: flex;

  align-items: center;

  gap: 17px;

}


.heading-icon {

  width: 54px;

  height: 54px;

  border-radius: 13px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #e8f3ef;

  border: 1px solid #cce4da;

  font-size: 24px;

}


.page-heading h1 {

  margin: 0;

  font-size: 31px;

  color: #26383d;

  font-weight: 750;

  letter-spacing: -0.5px;

}


.page-heading p {

  margin: 7px 0 0;

  color: #758287;

  font-size: 14px;

}



.total-box {

  min-width: 135px;

  padding: 14px 20px;

  border-radius: 12px;

  background: #f1f7f5;

  border: 1px solid #d7e9e2;

  text-align: center;

}


.total-box span {

  display: block;

  color: #28745d;

  font-size: 28px;

  font-weight: 800;

  line-height: 1;

}


.total-box small {

  display: block;

  margin-top: 6px;

  color: #72817e;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.7px;

}


.orders-grid {

  max-width: 1250px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 24px;

}



.order-card {

  background: #ffffff;

  border: 1px solid #e0e5e3;

  border-radius: 17px;

  padding: 27px;

  box-shadow:
    0 7px 22px
    rgba(36, 50, 56, 0.065);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;

}


.order-card:hover {

  transform: translateY(-4px);

  border-color: #c9dcd5;

  box-shadow:
    0 13px 30px
    rgba(36, 50, 56, 0.11);

}



.card-header {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 15px;

  padding-bottom: 19px;

  border-bottom: 1px solid #edf0ef;

}


.label {

  display: block;

  margin-bottom: 7px;

  color: #8b9896;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1px;

}


.card-header h3 {

  margin: 0;

  color: #27383d;

  font-size: 14px;

  font-family: monospace;

  font-weight: 700;

  word-break: break-all;

}


.status {

  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 7px 12px;

  border-radius: 30px;

  font-size: 11px;

  font-weight: 750;

  text-transform: capitalize;

  white-space: nowrap;

}


/* PENDING */

.status.pending {

  color: #9a6412;

  background: #fff7e6;

  border: 1px solid #f2dfb4;

}



.status.confirmed {

  color: #2c6470;

  background: #eaf5f6;

  border: 1px solid #c9e3e6;

}


.status.shipped {

  color: #315f96;

  background: #edf4ff;

  border: 1px solid #cfe0f6;

}



.status.processing {

  color: #66528c;

  background: #f2eef9;

  border: 1px solid #ded4ed;

}




.status.delivered {

  color: #28745d;

  background: #e8f5ef;

  border: 1px solid #cce6da;

}




.status.cancelled {

  color: #a24848;

  background: #fbeeee;

  border: 1px solid #edcece;

}



.status.unknown {

  color: #667174;

  background: #f1f3f3;

  border: 1px solid #dfe4e3;

}


.status-circle {

  width: 7px;

  height: 7px;

  border-radius: 50%;

  background: currentColor;

}



.order-details {

  padding: 18px 0;

}


.detail-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 7px 0;

}


.detail-label {

  color: #87928f;

  font-size: 12px;

  font-weight: 600;

}


.detail-value {

  max-width: 65%;

  color: #37484d;

  font-size: 12px;

  font-weight: 650;

  text-align: right;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}


.products-box {

  margin-top: 3px;

  background: #f7f9f8;

  border: 1px solid #e4e9e7;

  border-radius: 12px;

  overflow: hidden;

}


.products-heading {

  padding: 12px 15px;

  color: #52625f;

  background: #eef3f1;

  border-bottom: 1px solid #e0e7e4;

  font-size: 12px;

  font-weight: 800;

}


.product-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding: 13px 15px;

  background: #ffffff;

  border-bottom: 1px solid #edf0ef;

}


.product-row:last-child {

  border-bottom: none;

}


.product-left {

  min-width: 0;

  display: flex;

  align-items: center;

  gap: 11px;

}


.product-image {

  width: 38px;

  height: 38px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f1f5f3;

  border: 1px solid #dde6e2;

  border-radius: 9px;

  font-size: 16px;

}


.product-left > div:last-child {

  min-width: 0;

}


.product-left strong {

  display: block;

  margin-bottom: 3px;

  color: #35464a;

  font-size: 12px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

}


.product-left span {

  color: #8a9694;

  font-size: 10px;

}


.product-price {

  flex-shrink: 0;

}


.product-price span {

  color: #2f6d5a;

  font-size: 12px;

  font-weight: 800;

}


.status-actions {

  display: flex;

  align-items: center;

  gap: 9px;

  flex-wrap: wrap;

  margin-top: 18px;

  padding-top: 17px;

  border-top: 1px solid #edf0ef;

}


.action-button {

  border: none;

  border-radius: 9px;

  padding: 10px 14px;

  font-size: 11px;

  font-weight: 800;

  cursor: pointer;

  transition: 0.2s ease;

}


.action-button:hover:not(:disabled) {

  transform: translateY(-2px);

}


.action-button:disabled {

  opacity: 0.6;

  cursor: not-allowed;

  transform: none;

}


.confirm-button {

  color: #17633f;

  background: #e5f6ec;

  border: 1px solid #c8e9d6;

}


.confirm-button:hover:not(:disabled) {

  background: #d4f0df;

}


.ship-button {

  color: #285b8d;

  background: #eaf3ff;

  border: 1px solid #cfe1f5;

}


.ship-button:hover:not(:disabled) {

  background: #dcecff;

}


.deliver-button {

  color: #166b50;

  background: #e5f7ef;

  border: 1px solid #c8eadb;

}


.deliver-button:hover:not(:disabled) {

  background: #d4f1e4;

}


.cancel-button {

  color: #a33f3f;

  background: #fceeee;

  border: 1px solid #efcece;

}


.cancel-button:hover:not(:disabled) {

  background: #f9dddd;

}


.final-status {

  display: inline-flex;

  align-items: center;

  padding: 10px 14px;

  border-radius: 9px;

  font-size: 11px;

  font-weight: 800;

}


.delivered-final {

  color: #176b50;

  background: #e8f7ef;

  border: 1px solid #ccebdc;

}


.cancelled-final {

  color: #a33f3f;

  background: #fceeee;

  border: 1px solid #efcece;

}



.action-error {

  max-width: 1250px;

  margin: 0 auto 20px;

  padding: 12px 15px;

  border: 1px solid #efcece;

  border-radius: 10px;

  background: #fff5f5;

  color: #a33f3f;

  font-size: 12px;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

}


.action-error button {

  border: none;

  background: transparent;

  color: #a33f3f;

  font-size: 20px;

  line-height: 1;

  cursor: pointer;

}



.card-footer {

  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-top: 20px;

  padding-top: 18px;

  border-top: 1px solid #edf0ef;

}


.total-section span {

  display: block;

  margin-bottom: 5px;

  color: #8b9795;

  font-size: 10px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 0.6px;

}


.total-section strong {

  color: #26383d;

  font-size: 22px;

  font-weight: 800;

}



.details-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 12px 18px;

  border-radius: 9px;

  background: #304b52;

  color: #ffffff;

  text-decoration: none;

  font-size: 12px;

  font-weight: 750;

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;

}


.details-button:hover {

  background: #243a40;

  transform: translateY(-2px);

  box-shadow:
    0 7px 16px
    rgba(48, 75, 82, 0.20);

}


.details-button span {

  font-size: 16px;

  transition:
    transform 0.2s ease;

}


.details-button:hover span {

  transform: translateX(4px);

}



.loading-box {

  min-height: 500px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}


.loader {

  width: 42px;

  height: 42px;

  border: 4px solid #dce7e3;

  border-top-color: #367c68;

  border-radius: 50%;

  animation:
    spin 0.8s linear infinite;

}


@keyframes spin {

  to {
    transform: rotate(360deg);
  }

}


.loading-box h3 {

  margin: 17px 0 5px;

  color: #34474c;

}


.loading-box p {

  margin: 0;

  color: #8b9795;

  font-size: 13px;

}


.error-box {

  max-width: 500px;

  margin: 70px auto;

  padding: 35px;

  background: #ffffff;

  border: 1px solid #ecd5d5;

  border-radius: 15px;

  text-align: center;

}


.error-box h2 {

  margin: 0 0 10px;

  color: #9a4d4d;

}


.error-box p {

  margin: 0;

  color: #b56565;

}



.empty-box {

  max-width: 700px;

  margin: 50px auto;

  padding: 65px 25px;

  background: #ffffff;

  border: 1px solid #e1e7e5;

  border-radius: 17px;

  text-align: center;

  box-shadow:
    0 7px 22px
    rgba(36, 50, 56, 0.06);

}


.empty-icon {

  width: 65px;

  height: 65px;

  margin: 0 auto 15px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #edf5f2;

  border-radius: 16px;

  font-size: 27px;

}


.empty-box h2 {

  margin: 0 0 7px;

  color: #35474b;

}


.empty-box p {

  margin: 0;

  color: #899593;

  font-size: 13px;

}



@media (max-width: 900px) {

  .admin-orders-page {

    padding: 30px 25px 50px;

  }

  .orders-grid {

    grid-template-columns: 1fr;

  }

}



@media (max-width: 600px) {

  .admin-orders-page {

    padding: 22px 15px 40px;

  }

  .page-heading {

    padding: 20px;

    align-items: flex-start;

    gap: 18px;

    flex-direction: column;

  }

  .heading-left {

    align-items: flex-start;

  }

  .page-heading h1 {

    font-size: 27px;

  }

  .total-box {

    width: 100%;

  }

  .order-card {

    padding: 20px;

  }

  .card-header {

    flex-direction: column;

    align-items: flex-start;

  }

  .detail-row {

    align-items: flex-start;

    flex-direction: column;

    gap: 4px;

  }

  .detail-value {

    max-width: 100%;

    text-align: left;

    white-space: normal;

  }

  .status-actions {

    align-items: stretch;

  }

  .action-button {

    flex: 1;

    min-width: 120px;

  }

  .card-footer {

    align-items: stretch;

    flex-direction: column;

  }

  .details-button {

    width: 100%;

  }

}

`;

export default AdminOrders;
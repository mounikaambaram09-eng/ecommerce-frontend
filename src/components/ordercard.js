import React from "react";
import { Link } from "react-router-dom";
import OrderStatus from "./orderstatus";

const OrderCard = ({ order }) => {
  /* =========================
     ITEMS
  ========================= */

  const orderItems =
    order.orderItems ||
    order.items ||
    order.products ||
    [];

  const itemsCount = orderItems.length;


  /* =========================
     TOTAL AMOUNT
  ========================= */

  const totalAmount =
    order.totalPrice ??
    order.totalAmount ??
    order.amount ??
    0;


  /* =========================
     PRODUCT IMAGE
  ========================= */

  const getProductImage = (item) => {
    const image =
      item?.product?.image ||
      item?.productId?.image ||
      item?.image ||
      item?.product?.imageUrl ||
      item?.productId?.imageUrl ||
      null;

    if (!image) {
      return null;
    }

    // Already complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend relative image path
    return `http://localhost:5000${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };


  /* =========================
     STATUS
  ========================= */

  const status = order.status || "pending";

  const normalizedStatus = String(status).toLowerCase();


  /* =========================
     CANCEL ORDER STATE
  ========================= */

  const [isCancelling, setIsCancelling] = React.useState(false);


  /* =========================
     CANCEL ORDER
  ========================= */

  const cancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setIsCancelling(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/${order._id}/cancel`,
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
          data.message || "Failed to cancel order"
        );
      }

      alert("Order cancelled successfully");

      window.location.reload();

    } catch (error) {
      alert(
        error.message ||
          "Failed to cancel order"
      );

    } finally {
      setIsCancelling(false);
    }
  };


  /* =========================
     STATUS CLASS
  ========================= */

  const getStatusClass = () => {
    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {
      return "status-cancelled";
    }

    if (
      normalizedStatus === "confirmed" ||
      normalizedStatus === "confirm"
    ) {
      return "status-confirmed";
    }

    if (normalizedStatus === "shipped") {
      return "status-shipped";
    }

    if (normalizedStatus === "delivered") {
      return "status-delivered";
    }

    return "status-pending";
  };


  /* =========================
     STATUS TEXT
  ========================= */

  const getStatusText = () => {
    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {
      return "Cancelled";
    }

    if (
      normalizedStatus === "confirmed" ||
      normalizedStatus === "confirm"
    ) {
      return "Confirmed";
    }

    if (normalizedStatus === "shipped") {
      return "Shipped";
    }

    if (normalizedStatus === "delivered") {
      return "Delivered";
    }

    return "Pending";
  };


  return (
    <div className="order-card">

      {/* =========================
          HEADER
      ========================= */}

      <div className="order-header">

        <strong className="order-id">
          Order ID: {order._id}
        </strong>

        <div
          className={`order-status ${getStatusClass()}`}
        >
          {getStatusText()}
        </div>

      </div>


      {/* =========================
          PRODUCT IMAGES
      ========================= */}

      {orderItems.length > 0 && (
        <div className="order-products">

          {orderItems.map((item, index) => {
            const image = getProductImage(item);

            const productName =
              item?.product?.name ||
              item?.productId?.name ||
              item?.name ||
              "Product";

            return (
              <div
                className="order-product"
                key={
                  item?._id ||
                  item?.productId?._id ||
                  index
                }
              >

                <div className="order-image-box">

                  {image ? (
                    <img
                      src={image}
                      alt={productName}
                      className="order-product-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/180x140?text=No+Image";
                      }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/180x140?text=No+Image"
                      alt="No product"
                      className="order-product-image"
                    />
                  )}

                </div>

                <p className="order-product-name">
                  {productName}
                </p>

              </div>
            );
          })}

        </div>
      )}


      {/* =========================
          DATE
      ========================= */}

      <p className="order-info">
        <strong>Date:</strong>{" "}
        {order.createdAt
          ? new Date(
              order.createdAt
            ).toLocaleDateString()
          : "N/A"}
      </p>


      {/* =========================
          ITEMS COUNT
      ========================= */}

      <p className="order-info">
        <strong>Items Count:</strong>{" "}
        {itemsCount}
      </p>


      {/* =========================
          TOTAL AMOUNT
      ========================= */}

      <p className="order-total">
        <strong>
          Total Amount: ₹{totalAmount}
        </strong>
      </p>


      {/* =========================
          VIEW DETAILS + CANCEL
      ========================= */}

      <div className="order-details-wrapper">

        <Link
          to={`/orders/${order._id}`}
          className="order-details-button"
        >
          View Details
        </Link>

        {(normalizedStatus === "pending" ||
          normalizedStatus === "confirmed") && (
          <button
            type="button"
            className="order-cancel-button"
            onClick={cancelOrder}
            disabled={isCancelling}
          >
            {isCancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}

      </div>


      {/* =========================
          CSS
      ========================= */}

      <style>{`

        /* =========================
           ORDER CARD
        ========================= */

        .order-card {
          border: 1px solid #dfe3ea;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 18px;
          background: #ffffff;

          box-shadow:
            0 6px 18px
            rgba(15, 23, 42, 0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }


        .order-card:hover {
          transform: translateY(-3px);

          border-color: #c7d2fe;

          box-shadow:
            0 10px 25px
            rgba(37, 99, 235, 0.10);
        }


        /* =========================
           HEADER
        ========================= */

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }


        .order-id {
          font-size: 16px;
          color: #172033;
          word-break: break-word;
        }


        /* =========================
           STATUS
        ========================= */

        .order-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          text-transform: capitalize;
          white-space: nowrap;
        }


        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }


        .status-confirmed {
          background: #dcfce7;
          color: #166534;
        }


        .status-shipped {
          background: #dbeafe;
          color: #1d4ed8;
        }


        .status-delivered {
          background: #dcfce7;
          color: #166534;
        }


        .status-cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }


        /* =========================
           PRODUCTS
        ========================= */

        .order-products {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;

          margin-bottom: 18px;
          padding-bottom: 18px;

          border-bottom: 1px solid #e5e7eb;
        }


        /* =========================
           PRODUCT
        ========================= */

        .order-product {
          width: 150px;
        }


        /* =========================
           IMAGE BOX
        ========================= */

        .order-image-box {
          width: 150px;
          height: 120px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 8px;
          box-sizing: border-box;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #f5f7ff,
              #eef2ff
            );

          border: 1px solid #e2e8f0;
        }


        /* =========================
           PRODUCT IMAGE
        ========================= */

        .order-product-image {
          width: 100%;
          height: 105px;

          object-fit: contain;

          border-radius: 7px;
        }


        /* =========================
           PRODUCT NAME
        ========================= */

        .order-product-name {
          margin: 8px 2px 0;

          font-size: 14px;
          font-weight: 700;

          color: #263246;

          text-align: center;

          word-break: break-word;
        }


        /* =========================
           INFO
        ========================= */

        .order-info {
          margin: 8px 0;

          color: #596579;

          font-size: 15px;
        }


        .order-info strong {
          color: #263246;
        }


        /* =========================
           TOTAL AMOUNT
        ========================= */

        .order-total {
          margin: 10px 0;

          color: #111827;

          font-size: 17px;
          font-weight: 800;
        }


        /* =========================
           BUTTON WRAPPER
        ========================= */

        .order-details-wrapper {
          margin-top: 16px;

          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }


        /* =========================
           VIEW DETAILS
        ========================= */

        .order-details-button {
          display: inline-block;

          text-decoration: none;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #3b82f6
            );

          color: white;

          padding: 9px 18px;

          border-radius: 8px;

          font-size: 14px;
          font-weight: 700;

          box-shadow:
            0 4px 10px
            rgba(37, 99, 235, 0.18);

          transition:
            background 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }


        .order-details-button:hover {
          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #2563eb
            );

          transform: translateY(-2px);

          box-shadow:
            0 7px 15px
            rgba(37, 99, 235, 0.25);
        }


        .order-details-button:active {
          background:
            linear-gradient(
              135deg,
              #f97316,
              #dc2626
            );

          transform: scale(0.97);
        }


        /* =========================
           CANCEL ORDER BUTTON
        ========================= */

        .order-cancel-button {
          display: inline-block;

          border: none;

          background:
            linear-gradient(
              135deg,
              #dc2626,
              #ef4444
            );

          color: white;

          padding: 9px 18px;

          border-radius: 8px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 4px 10px
            rgba(220, 38, 38, 0.18);

          transition:
            background 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }


        .order-cancel-button:hover:not(:disabled) {
          background:
            linear-gradient(
              135deg,
              #b91c1c,
              #dc2626
            );

          transform: translateY(-2px);

          box-shadow:
            0 7px 15px
            rgba(220, 38, 38, 0.25);
        }


        .order-cancel-button:active:not(:disabled) {
          transform: scale(0.97);
        }


        .order-cancel-button:disabled {
          opacity: 0.65;

          cursor: not-allowed;

          transform: none;
        }



        @media (max-width: 600px) {

          .order-card {
            padding: 16px;
          }


          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }


          .order-status {
            align-self: flex-start;
          }


          .order-products {
            justify-content: center;
          }


          .order-product {
            width: 100%;
          }


          .order-image-box {
            width: 100%;
            height: 180px;
          }


          .order-product-image {
            height: 165px;
          }


          .order-details-button {
            width: 100%;

            box-sizing: border-box;

            text-align: center;
          }


          .order-cancel-button {
            width: 100%;

            margin-top: 0;

            box-sizing: border-box;
          }

        }

      `}</style>

    </div>
  );
};

export default OrderCard;
import React, { useContext } from "react";
import { CartContext } from "../context/cartcontext";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/cartitem";

function Cart() {
  const {
    cartItems,
    loading,
    error,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const calculateGrandTotal = () => {
    if (!Array.isArray(cartItems)) return 0;

    return cartItems.reduce((total, item) => {
      const price =
        item.product?.price ||
        item.price ||
        0;

      const quantity =
        item.quantity || 1;

      return total + price * quantity;
    }, 0);
  };

  /* =========================
     PRODUCT IMAGE
  ========================= */

  const getProductImage = (item) => {
    const image =
      item.product?.image ||
      item.image ||
      item.productId?.image;

    if (!image) {
      return "https://placehold.co/250x200?text=No+Image";
    }

    return image;
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        Loading your cart... ⏳
      </h2>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <h2
        style={{
          textAlign: "center",
          color: "red",
          marginTop: "40px",
        }}
      >
        {error}
      </h2>
    );
  }

  /* =========================
     EMPTY CART
  ========================= */

  if (!cartItems || cartItems.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        <h2>
          Your Cart is Empty! 🛒
        </h2>

        <p>
          Looks like you haven't added anything
          to your cart yet.
        </p>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* =========================
          CART TITLE
      ========================= */}

      <h2 className="cart-title">
        Shopping Cart
      </h2>


      {/* =========================
          CART ITEMS
      ========================= */}

      <div className="cart-list">

        {cartItems.map((item, index) => {

          const itemKey =
            item._id ||
            item.productId?._id ||
            item.product?._id ||
            item.productId ||
            index;

          return (
            <div
              key={itemKey}
              className="cart-product-box"
            >

              {/* PRODUCT IMAGE */}

              <div className="cart-image-box">

                <img
                  src={getProductImage(item)}
                  alt={
                    item.product?.name ||
                    item.name ||
                    "Product"
                  }
                  className="cart-product-image"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/250x200?text=No+Image";
                  }}
                />

              </div>


              {/* EXISTING CART ITEM */}

              <div className="cart-item-content">

                <CartItem item={item} />

              </div>

            </div>
          );
        })}

      </div>


      {/* =========================
          CART SUMMARY
      ========================= */}

      <div className="cart-summary">

        <h3 className="grand-total">
          Grand Total: ₹{calculateGrandTotal()}
        </h3>


        <div className="cart-actions">

          {/* CLEAR CART */}

          <button
            onClick={clearCart}
            className="clear-cart-button"
          >
            Clear Cart 🗑️
          </button>


          {/* CHECKOUT */}

          <button
            onClick={() => navigate("/checkout")}
            className="checkout-button"
          >
            Proceed to Checkout 🚀
          </button>

        </div>

      </div>


      {/* =========================
          CSS
      ========================= */}

      <style>{`

        /* =========================
           CART PAGE
        ========================= */

        .cart-page {
          max-width: 900px;

          margin: 0 auto;

          padding: 35px 20px 60px;

          box-sizing: border-box;
        }


        /* =========================
           TITLE
        ========================= */

        .cart-title {
          text-align: center;

          margin-bottom: 30px;

          font-size: 30px;

          font-weight: 800;

          color: #172033;
        }


        /* =========================
           CART LIST
        ========================= */

        .cart-list {
          display: flex;

          flex-direction: column;

          gap: 20px;
        }


        /* =========================
           EACH PRODUCT BOX
        ========================= */

        .cart-product-box {
          display: flex;

          align-items: center;

          gap: 25px;

          padding: 22px;

          background: #ffffff;

          border: 1px solid #e2e8f0;

          border-radius: 16px;

          box-shadow:
            0 8px 24px
            rgba(15, 23, 42, 0.08);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .cart-product-box:hover {
          transform: translateY(-3px);

          border-color: #c7d2fe;

          box-shadow:
            0 12px 28px
            rgba(37, 99, 235, 0.12);
        }


        /* =========================
           IMAGE BOX
        ========================= */

        .cart-image-box {
          width: 210px;

          min-width: 210px;

          height: 170px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 12px;

          box-sizing: border-box;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #f5f7ff,
              #eef2ff
            );
        }


        /* =========================
           PRODUCT IMAGE
        ========================= */

        .cart-product-image {
          width: 100%;

          height: 145px;

          object-fit: contain;

          border-radius: 8px;
        }


        /* =========================
           CART ITEM CONTENT
        ========================= */

        .cart-item-content {
          flex: 1;

          min-width: 0;
        }


        /* =========================
           SUMMARY
        ========================= */

        .cart-summary {
          margin-top: 30px;

          padding: 25px;

          border-top: 2px solid #dbe2ea;

          background: #f8fafc;

          border-radius: 12px;
        }


        /* =========================
           GRAND TOTAL
        ========================= */

        .grand-total {
          margin: 0 0 20px;

          font-size: 22px;

          color: #172033;
        }


        /* =========================
           ACTIONS
        ========================= */

        .cart-actions {
          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 15px;
        }


        /* =========================
           CLEAR CART
        ========================= */

        .clear-cart-button {
          border: none;

          padding: 12px 22px;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #ef4444,
              #dc2626
            );

          color: white;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.15s ease,
            background 0.15s ease;
        }

        .clear-cart-button:hover {
          background:
            linear-gradient(
              135deg,
              #dc2626,
              #b91c1c
            );

          transform: translateY(-2px);
        }

        .clear-cart-button:active {
          transform: scale(0.97);
        }


        /* =========================
           CHECKOUT
        ========================= */

        .checkout-button {
          border: none;

          padding: 12px 22px;

          border-radius: 8px;

          background:
            linear-gradient(
              135deg,
              #16a34a,
              #22c55e
            );

          color: white;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.15s ease,
            background 0.15s ease;
        }

        .checkout-button:hover {
          background:
            linear-gradient(
              135deg,
              #15803d,
              #16a34a
            );

          transform: translateY(-2px);
        }

        .checkout-button:active {
          transform: scale(0.97);
        }


        @media (max-width: 700px) {

          .cart-page {
            padding: 25px 12px 50px;
          }

          .cart-title {
            font-size: 26px;
          }

          .cart-product-box {
            flex-direction: column;

            align-items: stretch;

            padding: 16px;

            gap: 18px;
          }

          .cart-image-box {
            width: 100%;

            min-width: 0;

            height: 200px;
          }

          .cart-product-image {
            height: 175px;
          }

          .cart-actions {
            flex-direction: column;

            align-items: stretch;
          }

          .clear-cart-button,
          .checkout-button {
            width: 100%;
          }
        }

      `}</style>

    </div>
  );
}

export default Cart;
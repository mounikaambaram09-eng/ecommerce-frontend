import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartcontext"; 

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const totalPrice = calculateTotal(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    console.log("Place Order button clicked!");
    setError("");

    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      setError("Please fill in all the required fields.");
      return;
    }

    try {
      setLoading(true); 
      const token = localStorage.getItem("token"); 

      let userId = localStorage.getItem("userId");
      if (!userId) {
        const userObj = JSON.parse(localStorage.getItem("user") || "{}");
        userId = userObj._id || userObj.id;
      }


      const formattedAddress = `${formData.fullName}, Phone: ${formData.phone}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      
      const formattedItems = cartItems.map(item => ({
        productId: item.product?._id || item.product || item._id,
        name: item.product?.name || item.name || "Product",
        quantity: item.quantity || 1,
        price: item.product?.price || item.price || 0,
        total: (item.product?.price || item.price || 0) * (item.quantity || 1)
      }));

      const response = await fetch("http://localhost:5000/api/orders/", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), 
        },
        body: JSON.stringify({
          userId: userId,
          items: formattedItems,        
          shippingAddress: formattedAddress,
                    totalAmount: totalPrice       
        }),
      });

      const data = await response.json();
      console.log("Full Backend Response:", data);


      if (!response.ok) {
        throw new Error(data.message || "Failed to place the order.");
      }
      console.log("Data Object:", data.data);
     const orderId = data.data?._id || data.data?.id || data._id || data.id || data.orderId;

      clearCart(); 
      navigate(`/order-confirmation/${orderId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Checkout Page</h2>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>Order Summary</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => {
            const itemName = item.product?.name || item.name || "Product";
            const itemPrice = item.product?.price || item.price || 0;
            const itemQty = item.quantity || 1;
            return (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span>{itemName} (x{itemQty})</span>
                <span>₹{itemPrice * itemQty}</span>
              </div>
            );
          })
        )}
        <hr />
        <h4>Total Amount: ₹{totalPrice}</h4>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <h3>Delivery Information</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>Full Name: </label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Phone Number: </label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Address: </label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>City: </label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>State: </label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Pincode: </label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
        </div>

        <button 
          type="submit" 
          disabled={loading || cartItems.length === 0}
          style={{ padding: "10px 20px", backgroundColor: "green", color: "white", cursor: "pointer" }}
        >
          {loading ? "Processing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
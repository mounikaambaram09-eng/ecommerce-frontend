import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get User ID safely
  const getUserId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser._id || parsedUser.id || parsedUser.userId || null;
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
    return null;
  };

  // Fetch Cart Items
  const fetchCart = async () => {
    const userId = getUserId();
    if (!userId) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      // ఒకవేళ మీ బ్యాకెండ్ రూట్ లో /api/ ఉంటే ఇక్కడ 'http://localhost:5000/api/cart/' అని మార్చండి
      const res = await fetch(`http://localhost:5000/cart/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const items = data.data || data.items || data || [];
        setCartItems(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const getCartCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Add to Cart
  const addToCart = async (productId, quantity = 1) => {
    const userId = getUserId();

    if (!userId) {
      alert("Please log in first to add items to cart!");
      return;
    }

    if (!productId) {
      alert("Product ID is missing!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add product to cart.");
        return;
      }

      alert("Item added to cart successfully! 🛒");
      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Server connection failed. Check if backend is running.");
    }
  };

  // Update Quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    const userId = getUserId();
    if (!userId || newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const id = item._id || item.productId?._id || item.productId;
        return String(id) === String(cartItemId)
          ? { ...item, quantity: newQuantity }
          : item;
      })
    );

    try {
      const res = await fetch(`http://localhost:5000/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          quantity: Number(newQuantity),
        }),
      });

      if (!res.ok) fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      fetchCart();
    }
  };

  // Remove Single Item
  const removeFromCart = async (cartItemId) => {
    if (!cartItemId) return;

    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const pId = item._id || item.productId?._id || item.productId;
        return String(pId) !== String(cartItemId);
      })
    );

    try {
      const res = await fetch(`http://localhost:5000/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Backend remove failed");
        fetchCart();
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
      fetchCart();
    }
  };

 
  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    setCartItems([]);

    try {
      const res = await fetch(`http://localhost:5000/cart/user/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Backend clear cart failed");
        fetchCart();
      }
    } catch (err) {
      console.error("Clear cart error:", err);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        getCartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/productcard";
import { CartContext } from "../context/cartcontext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:5000/product/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        console.log("API RESPONSE:", data);

        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
        }}
      >
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          color: "red",
        }}
      >
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Products
      </h1>

      {products.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>
          No products found
        </h2>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              handleAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
import React, { useState, useEffect, useContext } from "react";
import ProductForm from "../components/productForm";
import { AuthContext } from "../context/authcontext";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { token } = useContext(AuthContext);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/product/list");
      if (!res.ok) throw new Error("Failed to fetch products");
      const resData = await res.json();
      
      if (resData && Array.isArray(resData.data)) {
        setProducts(resData.data);
      } else if (Array.isArray(resData)) {
        setProducts(resData);
      } else {
        setProducts([]);
      }
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || localStorage.getItem("token")}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete product");

      alert("Product deleted successfully!");
      setProducts(products.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProduct(null);
    fetchProducts(); 
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Admin Product Management</h2>
        <button
          onClick={handleAddNew}
          style={{ padding: "10px 18px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
        >
          + Add New Product
        </button>
      </div>
      
      {showForm && (
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <ProductForm
            selectedProduct={selectedProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading && <h3>Loading Products...</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#343a40", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Price</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Stock</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Category</th>
              <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No products found.</td>
              </tr>
            ) : (
              products.map((prod) => {
                const prodId = prod._id || prod.id;
                return (
                  <tr key={prodId} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{prod.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>₹{prod.price}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{prod.stock}</td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {prod.categoryId?.name || prod.category || "N/A"}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(prod)}
                        style={{ padding: "6px 12px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontWeight: "bold" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prodId)}
                        style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
import React, { useState, useEffect } from "react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/category/list");
      const data = await res.json();
      setCategories(data.data || data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/category/${editingId}`
      : "http://localhost:5000/category/create";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName("");
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      alert("Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id || cat.id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:5000/category/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Category Management</h2>
      
      {/* Category Create/Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button 
          type="submit" 
          style={{ padding: "10px 20px", backgroundColor: "#00d2d3", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ backgroundColor: "#343a40", color: "#fff", textAlign: "left" }}>
            <th style={{ padding: "12px", border: "1px solid #ddd" }}>Category Name</th>
            <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center", width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: "center", padding: "15px" }}>
                No categories found.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat._id || cat.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{cat.name}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                  <button 
                    onClick={() => handleEdit(cat)} 
                    style={{ padding: "6px 12px", backgroundColor: "#ffc107", border: "none", borderRadius: "4px", marginRight: "8px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat._id || cat.id)} 
                    style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;
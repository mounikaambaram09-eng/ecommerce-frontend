import React from "react";

const ProductFilters = ({
  category,
  setCategory,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories = [],
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px",
        flexWrap: "wrap",
      }}
    >
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
          minWidth: "180px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
          width: "150px",
        }}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
          width: "150px",
        }}
      />

      
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "15px",
          minWidth: "180px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        <option value="">Sort By</option>

        <option value="lowToHigh">
          Price: Low to High
        </option>

        <option value="highToLow">
          Price: High to Low
        </option>
      </select>
    </div>
  );
};

export default ProductFilters;
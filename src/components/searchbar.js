import React from "react";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "30px",
        marginTop: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "500px",
          height: "55px",
          padding: "0 20px",
          border: "2px solid #ccc",
          borderRadius: "10px",
          fontSize: "18px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            marginLeft: "12px",
            height: "50px",
            padding: "0 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#333",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;
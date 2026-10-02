import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartcontext";
import Pagination from "../components/pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 4;

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:5000/product/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((result) => {
        if (result && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    ...new Set(
      products
        .map((product) => product.categoryId?.name)
        .filter(Boolean)
    ),
  ];

  /* =========================
     SEARCH + FILTER
  ========================= */

  let filteredProducts = products.filter((product) => {
    const productName = product.name || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" ||
      product.categoryId?.name === category;

    const matchesMinPrice =
      minPrice === "" ||
      Number(product.price) >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" ||
      Number(product.price) <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  /* =========================
     SORTING
  ========================= */

  if (sort === "lowToHigh") {
    filteredProducts.sort(
      (a, b) => Number(a.price) - Number(b.price)
    );
  }

  if (sort === "highToLow") {
    filteredProducts.sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
  }

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  /* =========================
     RESET PAGE WHEN FILTER CHANGES
  ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, minPrice, maxPrice, sort]);

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const endIndex =
    startIndex + productsPerPage;

  const currentProducts =
    filteredProducts.slice(startIndex, endIndex);

  /* =========================
     CLEAR FILTERS
  ========================= */

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="products-loading">
        Loading products...
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <div className="products-error">
        Error: {error}
      </div>
    );
  }

  /* =========================
     IMAGE
  ========================= */

  const getImageUrl = (product) => {
    if (!product?.image) {
      return "https://placehold.co/300x200?text=No+Image";
    }

    return product.image;
  };

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = (productId) => {
    if (addToCart) {
      addToCart(productId, 1);
    }
  };

  return (
    <div className="products-page">

      {/* =========================
          TITLE
      ========================= */}

      <h1 className="products-title">
        Products
      </h1>


      {/* =========================
          FILTER BOX
      ========================= */}

      <div className="filter-box">

        {/* SEARCH */}

        <div className="search-row">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="product-search"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="search-clear-button"
            >
              Clear
            </button>
          )}

        </div>


        {/* FILTERS */}

        <div className="filter-row">

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-input"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>


          {/* SORT */}

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="filter-input"
          >
            <option value="">
              Sort By
            </option>

            <option value="lowToHigh">
              Price: Low to High
            </option>

            <option value="highToLow">
              Price: High to Low
            </option>
          </select>


          {/* MIN PRICE */}

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />


          {/* MAX PRICE */}

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />

        </div>


        {/* CLEAR FILTERS */}

        {(search ||
          category ||
          sort ||
          minPrice ||
          maxPrice) && (

          <div className="clear-filters-wrapper">

            <button
              onClick={handleClearFilters}
              className="clear-filters-button"
            >
              Clear Filters
            </button>

          </div>
        )}

      </div>


      {/* =========================
          RESULT COUNT
      ========================= */}

      <div className="result-count">

        Showing{" "}

        <strong>
          {filteredProducts.length}
        </strong>{" "}

        product
        {filteredProducts.length !== 1 ? "s" : ""}

      </div>


      {/* =========================
          NO PRODUCTS
      ========================= */}

      {filteredProducts.length === 0 ? (

        <div className="no-products">

          <h2>
            No products found.
          </h2>

          <p>
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <>

          {/* =========================
              PRODUCT GRID
          ========================= */}

          <div className="product-grid">

            {currentProducts.map((product) => {

              const productId =
                product._id || product.id;

              /*
                Stock is used ONLY for checking
                whether product is sold out.

                Stock number is NOT displayed.
              */

              const isSoldOut =
                Number(product.stock) === 0;

              return (

                <div
                  key={productId}
                  className="product-card"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="product-image-box">

                    <img
                      src={getImageUrl(product)}
                      alt={product.name || "Product"}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/300x200?text=No+Image";
                      }}
                    />

                  </div>


                  {/* PRODUCT NAME */}

                  <h2 className="product-name">
                    {product.name}
                  </h2>


                  {/* CATEGORY */}

                  <p className="product-info">

                    <strong>
                      Category:
                    </strong>{" "}

                    {product.categoryId?.name || "N/A"}

                  </p>


                  {/* PRICE */}

                  <p className="product-price">
                    ₹{product.price}
                  </p>


                  {/* =========================
                      VIEW DETAILS
                  ========================= */}

                  <Link
                    to={`/products/${productId}`}
                    className="view-details-button"
                  >
                    View Details
                  </Link>


                  {/* =========================
                      ADD TO CART / SOLD OUT

                      IMPORTANT:
                      Stock number is NOT shown.
                  ========================= */}

                  {isSoldOut ? (

                    <button
                      className="add-cart-button sold-out-button"
                      disabled
                    >
                      🚫 Sold Out
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        handleAddToCart(productId)
                      }
                      className="add-cart-button"
                    >
                      Add to Cart
                    </button>

                  )}

                </div>
              );
            })}

          </div>


          {/* =========================
              PAGINATION
          ========================= */}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />

        </>
      )}


      {/* =========================
          CSS
      ========================= */}

      <style>{`

        /* =========================
           PRODUCTS PAGE
        ========================= */

        .products-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px 60px;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(99, 102, 241, 0.07),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #f8faff 0%,
              #ffffff 100%
            );
        }


        /* =========================
           TITLE
        ========================= */

        .products-title {
          text-align: center;

          margin: 10px 0 30px;

          font-size: 38px;

          font-weight: 800;

          color: #172033;
        }


        /* =========================
           FILTER BOX
        ========================= */

        .filter-box {
          max-width: 1050px;

          margin: 0 auto 25px;

          padding: 25px;

          background:
            linear-gradient(
              135deg,
              #f1f5ff,
              #f8f5ff
            );

          border: 1px solid #dfe6ff;

          border-radius: 18px;

          box-shadow:
            0 10px 30px
            rgba(37, 99, 235, 0.07);
        }


        /* =========================
           SEARCH
        ========================= */

        .search-row {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 18px;
        }

        .product-search {
          width: 100%;

          padding: 14px 16px;

          box-sizing: border-box;

          border: 1px solid #cfd7ea;

          border-radius: 10px;

          background: white;

          font-size: 16px;

          color: #172033;

          outline: none;

          transition:
            border 0.2s ease,
            box-shadow 0.2s ease;
        }

        .product-search:focus {
          border-color: #6366f1;

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.12);
        }


        /* =========================
           SEARCH CLEAR
        ========================= */

        .search-clear-button {
          padding: 11px 16px;

          border: none;

          border-radius: 8px;

          background: #ef4444;

          color: white;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.15s ease;
        }

        .search-clear-button:hover {
          background: #dc2626;

          transform: translateY(-1px);
        }


        /* =========================
           FILTER ROW
        ========================= */

        .filter-row {
          display: grid;

          grid-template-columns:
            1.2fr
            1.2fr
            1fr
            1fr;

          gap: 12px;
        }

        .filter-input,
        .price-input {
          width: 100%;

          box-sizing: border-box;

          padding: 12px 14px;

          border: 1px solid #cfd7ea;

          border-radius: 9px;

          background: white;

          color: #263246;

          font-size: 15px;

          outline: none;
        }

        .filter-input:focus,
        .price-input:focus {
          border-color: #6366f1;

          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.10);
        }


        /* =========================
           CLEAR FILTERS
        ========================= */

        .clear-filters-wrapper {
          display: flex;

          justify-content: center;

          margin-top: 18px;
        }

        .clear-filters-button {
          padding: 10px 20px;

          border: none;

          border-radius: 8px;

          background: #64748b;

          color: white;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        .clear-filters-button:hover {
          background: #475569;

          transform: translateY(-1px);
        }


        /* =========================
           RESULT COUNT
        ========================= */

        .result-count {
          width: fit-content;

          margin: 20px auto 28px;

          padding: 8px 16px;

          border-radius: 20px;

          background: #eef2ff;

          color: #596579;

          font-size: 14px;
        }

        .result-count strong {
          color: #4338ca;
        }


        /* =========================
           PRODUCT GRID
        ========================= */

        .product-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 22px;
        }


        /* =========================
           PRODUCT CARD
        ========================= */

        .product-card {
          padding: 16px;

          background: #ffffff;

          border: 1px solid #e3e8f2;

          border-radius: 16px;

          box-shadow:
            0 6px 20px
            rgba(15, 23, 42, 0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);

          border-color: #c7d2fe;

          box-shadow:
            0 14px 30px
            rgba(37, 99, 235, 0.12);
        }


        /* =========================
           PRODUCT IMAGE
        ========================= */

        .product-image-box {
          height: 190px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 10px;

          box-sizing: border-box;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #f7f9ff,
              #f1f4ff
            );
        }

        .product-image {
          width: 100%;

          height: 180px;

          object-fit: contain;

          border-radius: 8px;
        }


        /* =========================
           PRODUCT NAME
        ========================= */

        .product-name {
          margin: 17px 0 12px;

          font-size: 21px;

          line-height: 1.25;

          font-weight: 800;

          color: #172033;
        }


        /* =========================
           CATEGORY
        ========================= */

        .product-info {
          margin: 8px 0;

          font-size: 14px;

          font-weight: 500;

          color: #596579;
        }

        .product-info strong {
          color: #263246;
        }


        /* =========================
           PRICE
        ========================= */

        .product-price {
          margin: 12px 0 16px;

          font-size: 21px;

          font-weight: 800;

          color: #111827;
        }


        /* =========================
           VIEW DETAILS

           NORMAL = PURPLE
           CLICK = ORANGE / RED
        ========================= */

        .view-details-button {
          display: block;

          width: 100%;

          box-sizing: border-box;

          padding: 11px;

          text-align: center;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6366f1
            );

          color: white;

          text-decoration: none;

          font-size: 15px;

          font-weight: 700;

          box-shadow:
            0 5px 12px
            rgba(124, 58, 237, 0.20);

          transition:
            background 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }


        /* Mouse hover */

        .view-details-button:hover {
          background:
            linear-gradient(
              135deg,
              #6d28d9,
              #4f46e5
            );

          transform: translateY(-2px);

          box-shadow:
            0 8px 18px
            rgba(124, 58, 237, 0.30);
        }


        /* CLICK / PRESS */

        .view-details-button:active {
          background:
            linear-gradient(
              135deg,
              #f97316,
              #dc2626
            );

          transform: scale(0.98);

          box-shadow:
            0 4px 10px
            rgba(220, 38, 38, 0.30);
        }


        /* =========================
           ADD TO CART

           NORMAL = BLUE
           CLICK = ORANGE / RED
        ========================= */

        .add-cart-button {
          width: 100%;

          margin-top: 10px;

          padding: 11px;

          border: none;

          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #3b82f6
            );

          color: white;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 5px 12px
            rgba(37, 99, 235, 0.20);

          transition:
            background 0.15s ease,
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }


        /* Mouse hover */

        .add-cart-button:hover {
          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #2563eb
            );

          transform: translateY(-2px);

          box-shadow:
            0 8px 18px
            rgba(37, 99, 235, 0.30);
        }


        /* CLICK / PRESS */

        .add-cart-button:active {
          background:
            linear-gradient(
              135deg,
              #f97316,
              #dc2626
            );

          transform: scale(0.98);

          box-shadow:
            0 4px 10px
            rgba(220, 38, 38, 0.30);
        }


        /* =========================
           SOLD OUT

           Stock number is NOT shown.
           Only this button appears.
        ========================= */

        .sold-out-button {
          background: #e2e8f0;

          color: #dc2626;

          cursor: not-allowed;

          box-shadow: none;

          border: 1px solid #cbd5e1;
        }

        .sold-out-button:hover {
          background: #e2e8f0;

          color: #dc2626;

          transform: none;

          box-shadow: none;
        }

        .sold-out-button:active {
          background: #e2e8f0;

          transform: none;
        }


        /* =========================
           NO PRODUCTS
        ========================= */

        .no-products {
          text-align: center;

          margin: 70px auto;

          padding: 40px;

          color: #64748b;
        }

        .no-products h2 {
          color: #334155;

          margin-bottom: 8px;
        }

        .no-products p {
          margin: 0;
        }


        /* =========================
           LOADING
        ========================= */

        .products-loading {
          text-align: center;

          padding: 70px;

          font-size: 22px;

          font-weight: 700;

          color: #4338ca;
        }


        /* =========================
           ERROR
        ========================= */

        .products-error {
          text-align: center;

          padding: 70px;

          color: #dc2626;

          font-size: 20px;

          font-weight: 700;
        }


        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1000px) {

          .product-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .filter-row {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }


        @media (max-width: 600px) {

          .products-page {
            padding: 20px 12px 50px;
          }

          .products-title {
            font-size: 32px;
          }

          .filter-box {
            padding: 18px;
          }

          .search-row {
            flex-direction: column;
          }

          .product-search {
            width: 100%;
          }

          .search-clear-button {
            width: 100%;
          }

          .filter-row {
            grid-template-columns: 1fr;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .product-name {
            font-size: 20px;
          }

          .product-price {
            font-size: 20px;
          }

        }

      `}</style>

    </div>
  );
};

export default Products;
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { AuthProvider } from "./context/authcontext";
import { CartProvider } from "./context/cartcontext";

import Orders from "./pages/orders";
import OrderDetails from "./pages/orderDetails";

import AdminRoute from "./components/adminroute";
import AdminDashboard from "./pages/admindashboard";
import AdminOrders from "./pages/adminorders";
import AdminOrderDetails from "./pages/adminorderdetails";

import ProtectedRoute from "./components/protectedRoute";
import "./App.css";
import Navbar from "./components/navbar";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Login from "./pages/login";
import Register from "./pages/register";

import AdminProducts from "./pages/adminproducts";
import AdminCategories from "./pages/admincategories";
import OrderConfirmation from "./pages/orderconfirmation";


// Home Page
const Home = () => {
  return (
    <div className="home-page">

      {/* TOP WELCOME */}
      <section className="top-welcome">

        <p>WELCOME</p>

        <h1>
          Welcome to <span>MyStore</span>
        </h1>

      </section>


      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <h2>
            Everything You Need,
            <br />
            All in One Place
          </h2>

          <p className="hero-label">
            START SHOPPING
          </p>

          <p className="hero-description">
            Browse our complete collection and find
            the right products for you.
          </p>

          <Link
            to="/products"
            className="hero-button"
          >
            Explore Products
          </Link>

        </div>


        {/* SHOPPING ILLUSTRATION */}
        <div className="hero-illustration">

          <div className="shopping-bag bag-one">
            <div className="bag-handle"></div>
            <div className="bag-shape"></div>
          </div>

          <div className="shopping-bag bag-two">
            <div className="bag-handle"></div>
            <div className="bag-shape"></div>
          </div>

          <div className="small-box"></div>

        </div>

      </section>

    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <CartProvider>

        <Router>

          <Navbar />

          <div style={{ padding: "20px" }}>

            <Routes>

              {/* HOME */}
              <Route
                path="/"
                element={
                  <ProtectedRoute userOnly={true}>
                    <Home />
                  </ProtectedRoute>
                }
              />


              {/* PRODUCTS */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute userOnly={true}>
                    <Products />
                  </ProtectedRoute>
                }
              />


              {/* PRODUCT DETAILS */}
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute userOnly={true}>
                    <ProductDetails />
                  </ProtectedRoute>
                }
              />


              {/* LOGIN */}
              <Route
                path="/login"
                element={<Login />}
              />


              {/* REGISTER */}
              <Route
                path="/register"
                element={<Register />}
              />


              {/* CART */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute userOnly={true}>
                    <Cart />
                  </ProtectedRoute>
                }
              />


              {/* ORDERS */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute userOnly={true}>
                    <Orders />
                  </ProtectedRoute>
                }
              />


              {/* ORDER DETAILS */}
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute userOnly={true}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />


              {/* CHECKOUT */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute userOnly={true}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />


              {/* ORDER CONFIRMATION */}
              <Route
                path="/order-confirmation/:orderId"
                element={
                  <ProtectedRoute userOnly={true}>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />


              {/* ADMIN PRODUCTS */}
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />


              {/* ADMIN CATEGORIES */}
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />


              {/* ADMIN ROUTES */}
              <Route element={<AdminRoute />}>

                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/orders"
                  element={<AdminOrders />}
                />

                <Route
                  path="/admin/orders/:id"
                  element={<AdminOrderDetails />}
                />

              </Route>


              {/* 404 */}
              <Route
                path="*"
                element={
                  <h2>404 - Page Not Found</h2>
                }
              />

            </Routes>

          </div>

        </Router>

      </CartProvider>
    </AuthProvider>
  );
}

export default App;
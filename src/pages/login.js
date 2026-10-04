import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setApiError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters";
    }

    return newErrors;
  };

  /* =========================
     LOGIN SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      setIsSubmitted(false);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        "http://localhost:5000/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok && data.status) {
        const token = data.token;
        const userData = data.user;

        const role = userData?.role || "user";
        const userId = userData?.id;

        /* =========================
           SAVE LOGIN DATA
        ========================= */

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", formData.email);

        console.log("TOKEN:", token);
        console.log("ROLE:", role);
        console.log("USER ID:", userId);

        /* =========================
           AUTH CONTEXT
        ========================= */

        if (login) {
          login(
            {
              id: userId,
              name: userData?.name,
              email: formData.email,
              role: role,
            },
            token
          );
        }

        /* =========================
           SUCCESS
        ========================= */

        setIsSubmitted(true);

        setTimeout(() => {
          navigate("/products");
        }, 1000);
      } else {
        setApiError(
          data.message || "Invalid Email or Password"
        );
      }
    } catch (error) {
      console.error("Login API Error:", error);

      setApiError(
        "Server error. Please check if Backend is running."
      );
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="login-page">
      <div className="login-container">

        {/* =================================
            LEFT SIDE - SHOWCASE
        ================================= */}

        <div className="login-showcase">
          <div className="showcase-content">

            <div className="showcase-logo">
              🛍️
            </div>

            <h1>
              Shop Smarter.
              <br />
              Live Better.
            </h1>

            <p>
              Discover amazing products, great deals,
              and everything you love in one place.
            </p>

            <div className="showcase-items">

              <div>
                <span>🛍️</span>
                <p>Wide Collection</p>
              </div>

              <div>
                <span>🛒</span>
                <p>Easy Shopping</p>
              </div>

              <div>
                <span>❤️</span>
                <p>Made For You</p>
              </div>

            </div>
          </div>
        </div>

        {/* =================================
            RIGHT SIDE - LOGIN
        ================================= */}

        <div className="login-card">

          {isSubmitted ? (

            /* =================================
               SUCCESS MESSAGE
            ================================= */

            <div className="login-success">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Login Successful!
              </h2>

              <p>
                Welcome back! Redirecting you
                to products...
              </p>

            </div>

          ) : (

            <>
              {/* BRAND */}

              <div className="login-brand">

                <div className="login-brand-icon">
                  🛍️
                </div>

                <h2>
                  MyStore
                </h2>

              </div>

              {/* HEADING */}

              <div className="login-heading">

                <h3>
                  Welcome Back! 👋
                </h3>

                <p>
                  Login to continue your
                  shopping journey
                </p>

              </div>

              {/* API ERROR */}

              {apiError && (
                <div className="login-api-error">
                  ⚠️ {apiError}
                </div>
              )}

              {/* LOGIN FORM */}

              <form
                onSubmit={handleSubmit}
                className="login-form"
              >

                {/* EMAIL */}

                <div className="login-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div className="login-input-wrapper">

                    <span className="input-icon">
                      ✉️
                    </span>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />

                  </div>

                  {errors.email && (
                    <span className="login-error">
                      {errors.email}
                    </span>
                  )}

                </div>

                {/* PASSWORD */}

                <div className="login-field">

                  <label htmlFor="password">
                    Password
                  </label>

                  <div className="login-input-wrapper">

                    <span className="input-icon">
                      🔒
                    </span>

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>

                  </div>

                  {errors.password && (
                    <span className="login-error">
                      {errors.password}
                    </span>
                  )}

                </div>

                {/* OPTIONS */}

                <div className="login-options">

                  <label>
                    <input
                      type="checkbox"
                    />

                    <span>
                      Remember me
                    </span>
                  </label>

                  <span className="forgot-password">
                    Forgot password?
                  </span>

                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="login-button"
                >
                  Login
                </button>

              </form>

              {/* DIVIDER */}

              <div className="login-divider">
                <span>or</span>
              </div>

              {/* REGISTER */}

              <p className="register-text">
                Don't have an account?

                <Link to="/register">
                  Create Account
                </Link>
              </p>

            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
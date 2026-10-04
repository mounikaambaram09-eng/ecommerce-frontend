import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password should contain at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword =
        "Confirm Password must match Password";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      fetch("http://localhost:5000/user/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.message ||
                data.error ||
                "Registration failed on server side."
            );
          }

          return data;
        })

        .then(() => {
          setIsSubmitted(true);
        })

        .catch((err) => {
          setApiError(
            err.message ||
              "Something went wrong. Please try again."
          );

          setIsSubmitted(false);
        });
    } else {
      setErrors(validationErrors);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="register-header">

          <div className="register-brand">
            🛍️
          </div>

          <h1>MyStore</h1>

          <h2>Create Your Account ✨</h2>

          <p>
            Join us and start your shopping journey
          </p>

        </div>


        {/* =========================
            REGISTRATION CARD
        ========================== */}

        <div className="register-card">

          {apiError && (
            <div className="register-api-error">
              ⚠️ {apiError}
            </div>
          )}

          {isSubmitted ? (

            <div className="register-success">

              <div className="register-success-icon">
                ✓
              </div>

              <h3>
                Registration Successful!
              </h3>

              <p>
                Welcome to MyStore 🎉
              </p>

              <Link
                to="/login"
                className="success-login-button"
              >
                Continue to Login
              </Link>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >

              {/* NAME */}

              <div className="register-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>

                {errors.name && (
                  <span className="register-error">
                    {errors.name}
                  </span>
                )}

              </div>


              {/* PHONE */}

              <div className="register-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    📱
                  </span>

                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    autoComplete="tel"
                  />

                </div>

                {errors.phone && (
                  <span className="register-error">
                    {errors.phone}
                  </span>
                )}

              </div>


              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
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
                  <span className="register-error">
                    {errors.email}
                  </span>
                )}

              </div>


              {/* PASSWORD */}

              <div className="register-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>

                {errors.password && (
                  <span className="register-error">
                    {errors.password}
                  </span>
                )}

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-input-wrapper">

                  <span className="register-input-icon">
                    🔐
                  </span>

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <span className="register-error">
                    {errors.confirmPassword}
                  </span>
                )}

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                className="register-button"
              >
                Create Account
              </button>

            </form>
          )}

          {/* LOGIN LINK */}

          {!isSubmitted && (
            <p className="register-login-text">
              Already have an account?
              <Link to="/login">
                Login
              </Link>
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default Register;
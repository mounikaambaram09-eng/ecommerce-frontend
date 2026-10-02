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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password should contain at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Confirm Password must match Password";
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
              data.message || data.error || "Registration failed on server side."
            );
          }
          return data;
        })
        .then(() => {
          setIsSubmitted(true);
        })
        .catch((err) => {
          setApiError(err.message || "Something went wrong. Please try again.");
          setIsSubmitted(false);
        });
    } else {
      setErrors(validationErrors);
      setIsSubmitted(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Create Account</h2>

      {apiError && (
        <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
          {apiError}
        </p>
      )}

      {isSubmitted ? (
        <div style={{ color: "green", margin: "20px 0", textAlign: "center" }}>
          <h3>Registration successful!</h3>
          <p>Welcome to MyStore.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
            {errors.phone && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.password}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
            {errors.confirmPassword && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </form>
      )}

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
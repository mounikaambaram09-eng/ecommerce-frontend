import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});

      try {
        const response = await fetch("http://localhost:5000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

        if (response.ok && data.status) {
                  
          const token = data.token;
          const userData = data.user;
          const role = userData?.role || "user";
          const userId = userData?.id;

        
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("email", formData.email);

          console.log("TOKEN:", token);
          console.log("ROLE:", role);
          console.log("USER ID:", userId);

         
          if (login) {
            login(
              {
                id: userId,
                name: userData?.name,
                email: formData.email,
                role: role
              },
              token
            );
          }

          setIsSubmitted(true);

          setTimeout(() => {
            navigate("/products");
          }, 1000);
        } else {
          setApiError(data.message || "Invalid Email or Password");
        }
      } catch (error) {
        console.error("Login API Error:", error);

        setApiError("Server error. Please check if Backend is running.");
      }
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
        borderRadius: "8px"
      }}
    >
      <h2>Welcome Back</h2>

      {apiError && (
        <div
          style={{
            color: "red",
            marginBottom: "15px",
            fontWeight: "bold"
          }}
        >
          {apiError}
        </div>
      )}

      {isSubmitted ? (
        <div
          style={{
            color: "green",
            margin: "20px 0",
            textAlign: "center"
          }}
        >
          <h3>Login successful!</h3>
          <p>Redirecting to products...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px"
              }}
            />

            {errors.email && (
              <span
                style={{
                  color: "red",
                  fontSize: "12px"
                }}
              >
                {errors.email}
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
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px"
              }}
            />

            {errors.password && (
              <span
                style={{
                  color: "red",
                  fontSize: "12px"
                }}
              >
                {errors.password}
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
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>
      )}

      <p
        style={{
          marginTop: "15px",
          textAlign: "center"
        }}
      >
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
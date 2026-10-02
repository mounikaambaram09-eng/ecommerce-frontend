import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  userOnly = false,
}) => {
  const { isLoggedIn, user, token } = useContext(AuthContext);

  const isAuthenticated =
    isLoggedIn || Boolean(token) || Boolean(user);

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();

 
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

 
  if (userOnly && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
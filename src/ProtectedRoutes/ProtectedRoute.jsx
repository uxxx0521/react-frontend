import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token found. Redirecting to login page.");
      return false;
    }

    try {
      const decodedToken = jwt_decode(token); // Decode the token
      if (decodedToken.exp > Date.now() / 1000) {
        return true; // Token is valid and not expired
      } else {
        console.log("Token has expired.");
        return false;
      }
    } catch (error) {
      console.error("Invalid token:", error.message);
      return false; // Invalid token
    }
  };

  // Call isAuthenticated to check if the user is authenticated
  return isAuthenticated() ? children : <Navigate to="/portfolio/expense_tracker/sign_in" />;
};

export default ProtectedRoute;

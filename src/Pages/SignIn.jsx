import Button_Expense_Tracker from "../Button/Button_Expense_tracker";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";



function Sign_in() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For login messages
  const navigate = useNavigate(); // Initialize useNavigate

  const login = async (e) => {

    try {
      const response = await axios.post("http://localhost:3000/auth", {
        username,
        password,
      });
      if (response.status === 201) {
        setMessage("Login successful!");
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken); // Save token in localStorage
        // Redirect to the user's main page
        navigate("/portfolio/expense_tracker/me");

      } else {
        setMessage(response.data.error || "Login failed");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Check token for auto login.
  const checkTokens = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");


      // Check if access token exists and is valid
      if (accessToken) {
        const decodedToken = jwt_decode(accessToken);
        if (decodedToken.exp > Date.now() / 1000) {
          // Access token is valid, redirect to user main page
          console.log("Access token is valid.");
          navigate("/portfolio/expense_tracker/me");
          return;
        }
      }
      console.log("accesToken is expired or not exist.");

      // If access token is expired, try to use refresh token
      const response = await axios.post("http://localhost:3000/refresh", {}, { withCredentials: true });

      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        console.log("New access token obtained via refresh token.");
        navigate("/portfolio/expense_tracker/me");
      } else {
        console.log("Unable to refresh token, redirecting to login.");
        navigate("/portfolio/expense_tracker/sign_in");
        setMessage("Please log in.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Refresh token is invalid or expired.");
      } else if (error.response.status === 403) {
        console.error("Forbidden: You do not have access to this resource.");
      } else {
        console.error("Error during token check:", error.message);
      }
      navigate("/portfolio/expense_tracker/sign_in");
    }
  };

  // check token when log in page mounts.
  useEffect(() => {
    checkTokens();
  }, []);


  return (
    <>
      <div className="sign-in-page">
        <div>
          <h1>Sign in</h1>
          <div className="id-input-group">
            <label>ID:</label>
            <input
              type="text"
              id="id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div className="password-input-group">
            <label>Password:</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <Button_Expense_Tracker
            text="Submit"
            className="sign-in-page-ok-button"
            onClick={login}
          />
          {message && <p>{message}</p>} {/* Display login messages */}
        </div>
      </div>
    </>
  );
}

export default Sign_in;

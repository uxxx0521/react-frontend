import Button_Expense_Tracker from "../Button/Button_Expense_tracker";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


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

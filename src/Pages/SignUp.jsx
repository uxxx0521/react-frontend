import Button_Expense_Tracker from "../Button/Button_Expense_tracker";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Sign_up() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // For login messages
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle sign up.
  const signup = async (e) => {
    try {
      const response = await axios.post("/api/register", {
        nickname,
        email,
        username,
        password,
      });

      if (response.status === 201) {
        setMessage("Signup successful!");
        await login();  //  Ensure login only runs after signup
      }
    } catch (err) {
      if (err.response) {  //  Axios error response handling
        if (err.response.status === 409) {
          setMessage("Please enter a different username.");  // Correctly handles duplicate username
        } else {
          setMessage(err.response.data.error || "Signup failed.");
        }
      } else {
        console.error("Error during signup:", err);
        setMessage("An error occurred. Please try again.(signup)");
      }
    }
  };


  const login = async (e) => {

    try {
      const response = await axios.post("/api/auth", {
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
      setMessage("An error occurred. Please try again.(login)");
    }
  };

  return (
    <>
      <div className="sign-in-page">
        <div className="sign-up-content">
          <button className="go-back-button" onClick={() => navigate("/portfolio/expense_tracker")}>←</button>
          <h1>Sign up</h1>
          <div className="nickname-input-group">
            <label>Nickname:</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            ></input>
          </div>
          <div className="email-input-group">
            <label>E-mail:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="id-input-group">
            <label>Username:</label>
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
            text="Create Account"
            className="sign-in-page-ok-button"
            onClick={signup}
          />


          {message && <p>{message}</p>} {/* Display login messages */}
          <div className="signin-link">
            Already have an account? <a href="/portfolio/expense_tracker/sign_in">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sign_up;

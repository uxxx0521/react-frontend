import Button_Expense_Tracker from "../Button/Button_Expense_tracker";
import React, { useEffect, useState } from "react";
import axios from 'axios'

function Sign_up() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Handle sign up.
  const signup = async (e) => {
    try {
      const response = await axios.post("http://localhost:3000/register", {
        nickname,
        email,
        username,
        password,
      });
      if (response.status === 201) {
        setMessage("Signup successful! Please log in.");
      } else {
        setMessage(response.data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setMessage("An error occurred. Please try again.");
    }
  };


  return (
    <>
      <div className="sign-in-page">
        <div>
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
            onClick={signup}
          />
        </div>
      </div>
    </>
  );
}

export default Sign_up;

import React from "react";
import { Link } from "react-router-dom";

function Button_Expense_Tracker({ text, link, className, onClick }) {
  return (
    <Link to={link}>
      <button className={className} onClick={onClick}>
        {text}
      </button>
    </Link>
  );
}

export default Button_Expense_Tracker;

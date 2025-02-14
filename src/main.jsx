import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Pages/Homepage.jsx";
import Blog from "./Pages/Blog.jsx";
import Portfolio from "./Pages/Portfolio.jsx";
import Resume from "./Pages/Resume.jsx";
import Github from "./Pages/Github.jsx";
import Expense_tracker from "./Pages/Expense_tracker.jsx";
import Sign_in from "./Pages/SignIn.jsx";
import Sign_up from "./Pages/SignUp.jsx";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.jsx";
import Me from "./ProtectedRoutes/Me.jsx";
import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <div>404 Not found. Wrong URL!!</div>,
    children: [
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
      {
        path: "/resume",
        element: <Resume />,
      },
      {
        path: "/github",
        element: <Github />,
      },
    ],
  },
  {
    path: "/portfolio/expense_tracker",
    element: <Expense_tracker />,
  },
  {
    path: "/portfolio/blog_website",
    element: <Blog />,
  },
  {
    path: "/portfolio/expense_tracker/sign_in",
    element: <Sign_in />,
  },
  {
    path: "/portfolio/expense_tracker/sign_up",
    element: <Sign_up />,
  },
  {
    path: "/portfolio/expense_tracker/me",
    element: (
      <ProtectedRoute>
        <Me />
      </ProtectedRoute>
    ),
  },

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

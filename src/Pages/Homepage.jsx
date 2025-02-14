import Header from '../components/Header'
import Footer from '../components/Footer'
import Contact from '../components/Contact'
import AboutMe from '../components/AboutMe'
import SkillStack from "../components/SkillStack";
import LoadingScreen from "../components/LoadingScreen";
import { Link, Outlet, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";


function Homepage() {
  // Check if the current path is the base path or
  // specific route where "About me:" should appear
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Keep track of first page load
  // Check if user has visited before (stored in localStorage)
  const [loading, setLoading] = useState(!sessionStorage.getItem("visited"));

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("visited", "true"); // Store flag in localStorage
      }, 3000);
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="Background">
          <div className="Homepage-content-div">
            <Header />
            <div className="Content-div">
              {isHomePage && <AboutMe />}
              <Outlet />
            </div>
            <div className="Skill-div">{isHomePage && <SkillStack />}</div>
          </div>
          <div className="Contact-div">
            <Contact />
          </div>
        </div>
      )}
    </>


  );


}

export default Homepage;

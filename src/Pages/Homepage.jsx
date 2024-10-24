import Header from '../components/Header'
import Footer from '../components/Footer'
import Contact from '../components/Contact'
import AboutMe from '../components/AboutMe'
import {Link, Outlet,useLocation} from "react-router-dom";

function Homepage() {
  const location = useLocation();

  // Check if the current path is the base path or
  // specific route where "About me:" should appear
  const showAboutMe = location.pathname === '/';

  return (
    <>   
      <div className = "Background">
        <Header/>

        <div class ="Content-div">
          {showAboutMe && <AboutMe />}
          <Outlet />
        </div>
        
        <Footer/>
        <Contact/>
      </div>
    </>


  );


}

export default Homepage;

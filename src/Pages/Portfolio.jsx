import { Link } from "react-router-dom";
import Card_portfolio from "../components/Card_portfolio";
import Card_blog from "../components/Card_blog";
import Card_chat from "../components/Card_chat";

function Portfolio() {
  return (
    <>
      <div className="card-container">
        <div className="Card-div">
          <Link to="/portfolio/expense_tracker">
            <Card_portfolio />
          </Link>
          <Link to="/portfolio/blog">
            <Card_blog />
          </Link>
          <Link to="/portfolio/chat">
            <Card_chat />
          </Link>




        </div>
        <Link to="https://www.youtube.com/watch?v=aqK2J2NVmNw" target="_blank" rel="noopener noreferrer">
          <p className="demo">DEMO</p>
        </Link>

      </div>
    </>
  );
}

export default Portfolio;

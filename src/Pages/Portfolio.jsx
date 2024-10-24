import { Link } from "react-router-dom";
import Card_portfolio from "../components/Card_portfolio";
import Card_blog from "../components/Card_blog";

function Portfolio() {
  return (
    <>
      <div className="Card-div">
        <Link to="/portfolio/expense_tracker">
          <Card_portfolio />
        </Link>
        <Link to="/portfolio/blog_website">
          <Card_blog />
        </Link>
      </div>
    </>
  );
}

export default Portfolio;

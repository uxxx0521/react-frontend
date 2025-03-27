import appPic from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/tracker.jpg'
import { Link } from "react-router-dom";

function Card_portfolio() {

  return (
    <><div className="card">
      <img className="card-img" src={appPic} ></img>
      <h2 className="card-title">Expense Tracker</h2>
      <p className="card-text">Keep track your expenses!</p>

    </div>
    </>

  );

}

export default Card_portfolio;
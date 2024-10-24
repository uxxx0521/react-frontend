import appPic from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/appPic.jpg'

function Card_portfolio() {

  return (
    <><div className="card">
      <img className="card-img" src={appPic} ></img>
      <h2 className="card-title">Expense Tracker</h2>
      <p className="card-text">This is an app that tracks your expense and analyze to provide some clever advice</p>
    </div>
    </>

  );

}

export default Card_portfolio;
import appPic from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/appPic.jpg'

function Card_blog() {

  return (
    <><div className="card">
      <img className="card-img" src={appPic} ></img>
      <h2 className="card-title">Documentation</h2>
      <p className="card-text">for Expense Tracker</p>
    </div>
    </>

  );

}

export default Card_blog;
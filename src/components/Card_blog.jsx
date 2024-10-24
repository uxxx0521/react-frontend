import appPic from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/appPic.jpg'

function Card_blog() {

  return (
    <><div className="card">
      <img className="card-img" src={appPic} ></img>
      <h2 className="card-title">Blog-website</h2>
      <p className="card-text">Record of my journey</p>
    </div>
    </>

  );

}

export default Card_blog;
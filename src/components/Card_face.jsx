import face from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/face.jpg'


function Card_face() {

    return (
        <><div className="card">
            <img className="card-img" src={face} ></img>
            <h2 className="card-title">Face Recognition App</h2>
            <p className="card-text"></p>
        </div>
        </>
    );
}

export default Card_face;
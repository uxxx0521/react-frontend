import chatapp from '/Users/uxxx/Desktop/Portfolio/react-app-js/src/assets/chatapp.jpg'


function Card_chat() {

    return (
        <><div className="card">
            <img className="card-img" src={chatapp} ></img>
            <h2 className="card-title">Chat App</h2>
            <p className="card-text">Lets Chat!!!</p>
        </div>
        </>

    );

}

export default Card_chat;
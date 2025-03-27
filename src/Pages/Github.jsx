import { Link } from "react-router-dom";
import Card_backend from '../components/Card_backend'
import Card_frontend from '../components/Card_frontend'
import Card_spring from "../components/Card_spring";

function Github() {
    return (
        <>
            <div className="Card-div">
                <Link to="https://github.com/uxxx0521/react-frontend " target="_blank" rel="noopener noreferrer">
                    <Card_frontend />
                </Link>
                <Link to="https://github.com/uxxx0521/express-backend" target="_blank" rel="noopener noreferrer">
                    <Card_backend />
                </Link>
                <Link to="https://github.com/uxxx0521/chat-app-backend-springboot" target="_blank" rel="noopener noreferrer">
                    <Card_spring />
                </Link>
            </div>
        </>
    );
}

export default Github;
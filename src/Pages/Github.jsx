import { Link } from "react-router-dom";
import Card_backend from '../components/Card_backend'
import Card_frontend from '../components/Card_frontend'

function Github() {
    return (
        <>
            <div className="Card-div">
                <Link to="https://github.com/uxxx0521/react-frontend">
                    <Card_frontend />
                </Link>
                <Link to="https://github.com/uxxx0521/express-backend">
                    <Card_backend />
                </Link>
            </div>
        </>
    );
}

export default Github;
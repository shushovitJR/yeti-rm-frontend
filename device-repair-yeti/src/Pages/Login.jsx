import { Link } from 'react-router-dom';
import './Login.css';

export function Login() {
    return(
        <div className="login-section">
            This is login page
            <Link to="/dashboard">
            <button className="login-button">
                Log in
            </button>
            </Link>
        </div>
    );
}
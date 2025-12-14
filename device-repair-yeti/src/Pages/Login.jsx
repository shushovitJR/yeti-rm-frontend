import { Link } from 'react-router-dom';
import { Header } from '../Components/Header';
import './Login.css';

export function Login() {
    return(
        <>
        <Header compact />
        <div className="login-section">
                <h1 className="text-center text-3xl text-grey-900">Login</h1>
            <div className="login-form-container">
                <form action="/dashboard" className="Login-Form">
                    <div>
                        <label>Username</label>
                        <input type="text" name="username" className="username-input" ></input>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password"></input>
                    </div>
                    <div className="form-button">
                        <button className="login-button" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}
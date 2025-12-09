import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const openLogin = () => {
        setError('');
        setUsername('');
        setPassword('');
        setShowLogin(true);
    };
    const closeLogin = () => setShowLogin(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        // Replace this with real auth integration
        alert(`Signing in as ${username}`);
        setShowLogin(false);
    };

    return(
        <header>
            <div className="image-section">
                <Link to="/">
                <img src="/images/yeti-logo.png" alt="Yeti Logo" />
                </Link>
            </div>
            <div className="login-section">
                <button className="loginButton" onClick={openLogin}>Login</button>
            </div>

            {showLogin && (
                <div className="modal-overlay" onClick={closeLogin}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="modal-close" onClick={closeLogin} aria-label="Close">&times;</button>
                            <h2>Sign In</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="login-form">
                            <label>
                                Username
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoFocus
                                />
                            </label>

                            <label>
                                Password
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>

                            {error && <div className="modal-error">{error}</div>}

                            <div className="modal-actions">
                                <button type="submit" className="modal-submit">Sign In</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
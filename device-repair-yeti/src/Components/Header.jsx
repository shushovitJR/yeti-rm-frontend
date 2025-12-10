import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
    return(
        <header>
            <div className="image-section">
                <Link to="/dashboard">
                <img src="/images/yeti-logo.png" alt="Yeti Logo" />
                </Link>
            </div> 
        </header>
    );
}
import { Link } from 'react-router-dom';
import './Header.css';

export function Header({ compact = false }) {
    return(
        <header>
            <div className={"image-section" + (compact ? " img-left" : "")}>
                <img src="/images/yeti-logo.png" alt="Yeti Logo" />
            </div>
        </header>
    );
}
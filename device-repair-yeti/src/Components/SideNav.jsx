import { useState } from "react";
import './SideNav.css';

export function SideNav(){
    const [repairOpen, setRepairOpen] = useState(false);
  const toggleRepair = () => setRepairOpen((v) => !v);
    return(
        <aside className="side-nav-section">
          <nav className="nav-items">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            <div className="nav-item dropdown">
              <button
                className="dropdown-toggle"
                onClick={toggleRepair}
                aria-expanded={repairOpen}
              >
                Repair
                <span className="caret">{repairOpen ? "▴" : "▾"}</span>
              </button>

              {repairOpen && (
                <div className="dropdown-menu">
                  <Link to="/inhouse" className="dropdown-item">
                    Inhouse
                  </Link>
                  <Link to="/vendor" className="dropdown-item">
                    Vendor
                  </Link>
                </div>
              )}
            </div>
            <Link to="/request" className="nav-link">
              Request
            </Link>
          </nav>
        </aside>
    );
}
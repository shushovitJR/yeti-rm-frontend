import { useState } from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";

export function SideNav() {
  const [repairOpen, setRepairOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const toggleRepair = () => setRepairOpen((v) => !v);
  const toggleNav = () => setNavOpen((v) => !v);
  return (
    <>
      {navOpen && (
        <aside className="side-nav-section">
          <div className="side-nav-header">
            <button
              onClick={toggleNav}
              className="text-3xl font-light hover:text-red-600"
            >
              &times;
            </button>
          </div>
          <nav className="nav-items">
            <Link to="/dashboard" className="nav-link">
              Dashboard
              {/* <i className="fa-solid fa-house"></i> */}
            </Link>

            <div className="nav-item dropdown">
              <button
                className="dropdown-toggle"
                onMouseOver={toggleRepair}
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
      )}
      {!navOpen && (
        <div className="mini-nav-section">
          <div className="mini-nav-section-header">
            <button onClick={toggleNav}>
              <i className="mini-nav-link fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
          <div className="mini-nav-items">
            <Link to="/dashboard" className="mini-nav-link">
              <i className="fa-solid fa-house"></i>
            </Link>
            <i
              onClick={toggleNav}
              className="mini-nav-link fa-solid fa-screwdriver-wrench"
            ></i>
            <Link to="/request" className="mini-nav-link">
              <i className="fa-solid fa-hand"></i>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

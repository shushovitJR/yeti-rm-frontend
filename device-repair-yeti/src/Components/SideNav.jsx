// eslint-disable-next-line no-unused-vars
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import "./SideNav.css";

export function SideNav() {
  const [repairOpen, setRepairOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const toggleRepair = () => setRepairOpen((v) => !v);
  const toggleNav = () => {
    setNavOpen((v)=>{
      const newState = !v;
      if (newState){
        document.body.classList.remove("nav-close");
        document.body.classList.remove("img-left");

      } else {
        document.body.classList.add("nav-close");
        document.body.classList.add("img-left");
      }
      return newState;
    })
  }

//   useEffect(() => {
//   if (navOpen) document.body.classList.add("nav-open");
//   return () => document.body.classList.remove("nav-open");
// }, []);


  return (
    <>
            
      <aside className={`side-nav ${navOpen ? "open" : "closed"}`}>
        <div className="side-nav-header">
          <button
            onClick={toggleNav}
            className="text-3xl font-light hover:text-red-600 nav-toggle-btn"
            aria-label="Toggle navigation"
          >
            {navOpen ? "\u00ab" : "\u00bb"}
          </button>
        </div>

        
        <div className="nav-mini" aria-hidden={navOpen}>
          <Link to="/dashboard" className="mini-nav-link" title="Dashboard">
            <i className="fa-solid fa-house"></i>
          </Link>
          <button onClick={toggleNav} className="mini-nav-link" title="Repair">
            <i className="fa-solid fa-screwdriver-wrench"></i>
          </button>
          <Link to="/request" className="mini-nav-link" title="Request">
            <i className="fa-solid fa-hand"></i>
          </Link>
          <Link to="/" className="mini-nav-link logout-icon" title="LogOut">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </Link>
        </div>

        <nav className="nav-full" aria-hidden={!navOpen}>
          <Link to="/dashboard" className="nav-link">
            Dashboard
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

          <Link to="/" className="nav-link logout-link">
           <i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out
          </Link>
        </nav>

        <div className="footer">#####S#######S</div>
        

      </aside>
      
    </>
  );
}

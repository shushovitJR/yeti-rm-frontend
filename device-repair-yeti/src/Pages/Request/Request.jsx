import { useState } from "react";
import { Header } from "../Components/Header";
import { SideNav } from "../Components/SideNav";
import "./Request.css";

export function Request() {
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");
  const [requestFromName, setRequestFromName] = useState("");

  const handleRequestSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <SideNav />
        <div className="main-content">
          <h1 className="request-header">Request a Device</h1>
          <div className="request-form-section">
            <form onSubmit={handleRequestSubmit} className="request-form">
              <label>
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  placeholder="Enter your name"
                />
              </label>
              <label>
                Device for Request
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  required
                >
                  <option value="Laptop">Laptop</option>
                  <option value="CPU">CPU</option>
                  <option value="Printer">Printer</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Keyboard">Keyboard</option>
                </select>
              </label>
              <label>
                Request From
                <input
                  type="text"
                  value={requestFromName}
                  onChange={(e) => setRequestFromName(e.target.value)}
                  placeholder="Enter Department Requesting Device"
                  required
                />
              </label>
              <label>
                Description
                <textarea placeholder="Why do you need the device" required />
              </label>
              <div className="form-actions">
                <button type="submit" className="request-submit">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

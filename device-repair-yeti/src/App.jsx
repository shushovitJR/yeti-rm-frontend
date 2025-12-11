import { Routes, Route } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Dashboard } from "./Pages/Dashboard";
import { Inhouse } from "./Pages/Inhouse/Inhouse";
import { Vendor } from "./Pages/Vendor/Vendor";
import { Request } from "./Pages/Request/Request";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/request" element={<Request />} />
      <Route path="/inhouse" element={<Inhouse />} />
      <Route path="/vendor" element={<Vendor />} />
    </Routes>
  );
}

export default App;

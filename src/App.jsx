import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Vehicles from "./pages/Vehicles";
import Appointments from "./pages/Appointments";
import "./App.css";

function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
     <NavLink to="/" className="brand">
  <div className="brand-icon">🚘</div>
  <div>
    <h2>AutoCare</h2>
    <span>Service Management</span>
  </div>
</NavLink>

        <div className="nav-label">MAIN MENU</div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          ▦ Dashboard
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          🔧 Services
        </NavLink>

        <NavLink
          to="/vehicles"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          🚗 Vehicles
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          📅 Appointments
        </NavLink>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <div>
            <strong>Backend API</strong>
            <span>localhost:8080</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route
            path="*"
            element={
              <div className="page-content">
                <h1>Page Not Found</h1>
                <p>Select a page from the sidebar.</p>
              </div>
            }
          />
        </Routes>

        <footer>
          AutoCare Vehicle Service Management System
          <span>React + Spring Boot</span>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
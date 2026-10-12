import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/services`;

function Dashboard() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load services");
        }

        const data = await response.json();
        setServices(data);
      } catch {
        setError("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const totalValue = services.reduce(
    (total, service) => total + Number(service.price || 0),
    0
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <p className="eyebrow">VEHICLE SERVICE MANAGEMENT</p>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your service center overview.</p>
        </div>
      </div>

      <section className="welcome-card">
        <div>
          <span className="welcome-tag">SERVICE CENTER</span>
          <h2>Welcome to AutoCare</h2>
          <p>
            Manage vehicle maintenance services, vehicles, and appointments
            from one place.
          </p>
        </div>
        <div className="welcome-car">🚙</div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">🔧</div>
          <p>Total Services</p>
          <h2>{loading ? "..." : services.length}</h2>
          <span>Services in the database</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">₹</div>
          <p>Combined Service Prices</p>
          <h2>
            {loading ? "..." : `₹${totalValue.toLocaleString("en-IN")}`}
          </h2>
          <span>Sum of listed service prices</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">⚙️</div>
          <p>System Status</p>
          <h2 className="status-text">
            {loading ? "Checking" : error ? "Disconnected" : "Connected"}
          </h2>
          <span>Spring Boot REST API</span>
        </div>
      </section>

      <section className="services-section">
        <h2>Quick Actions</h2>
        <p>Choose a section to manage your service center.</p>

        <div className="quick-actions">
          <Link to="/services" className="quick-action">
            <span>🔧</span>
            <strong>Manage Services</strong>
            <small>View and manage service prices</small>
          </Link>

          <Link to="/vehicles" className="quick-action">
            <span>🚗</span>
            <strong>Manage Vehicles</strong>
            <small>Register and manage vehicles</small>
          </Link>

          <Link to="/appointments" className="quick-action">
            <span>📅</span>
            <strong>Appointments</strong>
            <small>Manage service bookings</small>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
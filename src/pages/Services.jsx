import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/services`;

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    price: "",
    estimatedDuration: "",
  });

  async function loadServices() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      setServices(await response.json());
    } catch {
      setError("Could not connect to the backend. Check Spring Boot.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          estimatedDuration: Number(form.estimatedDuration),
        }),
      });

      if (!response.ok) {
        throw new Error(`Could not save service: ${response.status}`);
      }

      setForm({
        serviceName: "",
        description: "",
        price: "",
        estimatedDuration: "",
      });

      setShowForm(false);
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteService(id) {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Could not delete service: ${response.status}`);
      }

      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <p className="eyebrow">SERVICE CATALOG</p>
          <h1>Vehicle Services</h1>
          <p>View and manage the services offered by your service center.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Service"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <h3>Add a New Service</h3>

          <label>
            Service Name
            <input
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              placeholder="e.g. Oil Change"
              required
            />
          </label>

          <label>
            Description
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Duration (minutes)
              <input
                name="estimatedDuration"
                type="number"
                min="1"
                value={form.estimatedDuration}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            Save Service
          </button>
        </form>
      )}

      <section className="services-section">
        <div className="section-heading">
          <div>
            <h2>Available Services</h2>
            <p className="section-description">
              Total services: {services.length}
            </p>
          </div>

          <button className="refresh-button" onClick={loadServices}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔧</div>
            <h3>No services found</h3>
            <p>Add your first vehicle service to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>SERVICE</th>
                  <th>DESCRIPTION</th>
                  <th>PRICE</th>
                  <th>DURATION</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.serviceName}</strong>
                    </td>
                    <td>{service.description}</td>
                    <td className="price">
                      ₹{Number(service.price).toLocaleString("en-IN")}
                    </td>
                    <td>{service.estimatedDuration} min</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteService(service.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Services;
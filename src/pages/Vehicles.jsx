import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/vehicles";

const initialForm = {
  vehicleNumber: "",
  brand: "",
  model: "",
  ownerName: "",
  phone: "",
};

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  async function loadVehicles() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setVehicles(data);
    } catch {
      setError(
        "Could not load vehicles. Check that Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
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

  const isEditing = editingId !== null;

  try {
    const response = await fetch(
      isEditing ? `${API_URL}/${editingId}` : API_URL,
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Could not ${isEditing ? "update" : "save"} vehicle: ${response.status}`
      );
    }

    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);

    await loadVehicles();
  } catch (err) {
    setError(err.message);
  }
}
function editVehicle(vehicle) {
  setForm({
    vehicleNumber: vehicle.vehicleNumber ?? "",
    brand: vehicle.brand ?? "",
    model: vehicle.model ?? "",
    ownerName: vehicle.ownerName ?? "",
    phone: vehicle.phone ?? "",
  });

  setEditingId(vehicle.id);
  setShowForm(true);
  setError("");
}
  async function deleteVehicle(id) {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Could not delete vehicle: ${response.status}`);
      }

      await loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <p className="eyebrow">VEHICLE MANAGEMENT</p>
          <h1>Vehicles</h1>
          <p>Register and manage customer vehicles.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Vehicle"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <h3>{editingId !== null ? "Edit Vehicle" : "Register a Vehicle"}</h3>

          <label>
            Vehicle Number
            <input
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="e.g. TS09AB1234"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Brand
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Toyota"
                required
              />
            </label>

            <label>
              Model
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Innova"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Owner Name
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Customer name"
                required
              />
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
  {editingId !== null ? "Update Vehicle" : "Save Vehicle"}
</button>

{editingId !== null && (
  <button
    className="refresh-button"
    type="button"
    onClick={() => {
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
    }}
  >
    Cancel
  </button>
)}
        </form>
      )}

      <section className="services-section">
        <div className="section-heading">
          <div>
            <h2>Registered Vehicles</h2>
            <p className="section-description">
              Total vehicles: {vehicles.length}
            </p>
          </div>

          <button className="refresh-button" onClick={loadVehicles}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <h3>No vehicles found</h3>
            <p>Register your first vehicle to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>VEHICLE NUMBER</th>
                  <th>BRAND</th>
                  <th>MODEL</th>
                  <th>OWNER</th>
                  <th>PHONE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td><strong>{vehicle.vehicleNumber}</strong></td>
                    <td>{vehicle.brand}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.ownerName}</td>
                    <td>{vehicle.phone}</td>
                    <td>
  <button
    className="refresh-button"
    onClick={() => editVehicle(vehicle)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => deleteVehicle(vehicle.id)}
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

export default Vehicles;
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/appointments";

const initialForm = {
  customerName: "",
  vehicleNumber: "",
  serviceName: "",
  appointmentDate: "",
  appointmentTime: "",
};

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
    } catch {
      setError(
        "Could not load appointments. Check that Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
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
          body: JSON.stringify({
            ...form,
            status: isEditing
              ? appointments.find((a) => a.id === editingId)?.status
              : "Pending",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not ${isEditing ? "update" : "save"} appointment: ${response.status}`
        );
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  function editAppointment(appointment) {
    setForm({
      customerName: appointment.customerName ?? "",
      vehicleNumber: appointment.vehicleNumber ?? "",
      serviceName: appointment.serviceName ?? "",
      appointmentDate: appointment.appointmentDate ?? "",
      appointmentTime: appointment.appointmentTime ?? "",
    });

    setEditingId(appointment.id);
    setShowForm(true);
    setError("");
  }

  async function updateStatus(appointment, status) {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointment,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Could not update status: ${response.status}`);
      }

      await loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Could not delete appointment: ${response.status}`);
      }

      await loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <p className="eyebrow">BOOKING MANAGEMENT</p>
          <h1>Appointments</h1>
          <p>Schedule and manage vehicle service appointments.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditingId(null);
              setForm(initialForm);
            } else {
              setEditingId(null);
              setForm(initialForm);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Close Form" : "+ New Appointment"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="service-form" onSubmit={handleSubmit}>
          <h3>
            {editingId !== null ? "Edit Appointment" : "Book an Appointment"}
          </h3>

          <label>
            Customer Name
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </label>

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

          <div className="form-row">
            <label>
              Appointment Date
              <input
                name="appointmentDate"
                type="date"
                value={form.appointmentDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Appointment Time
              <input
                name="appointmentTime"
                type="time"
                value={form.appointmentTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button className="primary-button" type="submit">
            {editingId !== null ? "Update Appointment" : "Book Appointment"}
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
            <h2>Appointment Records</h2>
            <p className="section-description">
              Total appointments: {appointments.length}
            </p>
          </div>

          <button className="refresh-button" onClick={loadAppointments}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No appointments yet</h3>
            <p>Create an appointment to get started.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>VEHICLE</th>
                  <th>SERVICE</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.customerName}</td>
                    <td>{appointment.vehicleNumber}</td>
                    <td>{appointment.serviceName}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      <select
                        value={appointment.status || "Pending"}
                        onChange={(event) =>
                          updateStatus(appointment, event.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="refresh-button"
                        onClick={() => editAppointment(appointment)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteAppointment(appointment.id)}
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

export default Appointments;
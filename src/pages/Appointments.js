// src/pages/Appointments.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  listAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import "./Appointments.css";

export default function Appointments() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialFromUrl = useMemo(
    () => new URLSearchParams(location.search).get("date"),
    [location.search]
  );

  const [date, setDate] = useState(() => initialFromUrl || new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep ?date in URL synced for refresh/back
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    if (sp.get("date") !== date) {
      sp.set("date", date);
      window.history.replaceState(null, "", `${location.pathname}?${sp.toString()}`);
    }
  }, [date, location.pathname, location.search]);

  async function load() {
    setLoading(true);
    try {
      const data = await listAppointments({ date });
      setItems(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [date]); // Fixed: proper dependency array

  async function setStatus(id, status) {
    try {
      await updateAppointment(id, { status });
      load();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      load();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }

  function getStatusClass(status) {
    const statusMap = {
      pending: "statusColors-pending",
      confirmed: "statusColors-confirmed",
      completed: "statusColors-completed",
      cancelled: "statusColors-cancelled",
    };
    return statusMap[status] || "statusColors-pending";
  }

  return (
    <div className="page">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate("/")} className="back-btn-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header Section */}
      <header className="header">
        <h2 className="title">Appointments</h2>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
          <button
            className="primaryBtn"
            onClick={() => navigate(`/appointments/new?date=${date}`)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Appointment
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <section className="card">
        <div>
          {loading ? "Loading..." : `${items.length} appointments`}
        </div>

        {/* Desktop Table View */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="th">Time</th>
                <th className="th">Patient</th>
                <th className="th">Contact</th>
                <th className="th">Reason</th>
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan="6" className="td">
                    No appointments for this date —
                    <button
                      onClick={() => navigate(`/appointments/new?date=${date}`)}
                      className="pillBtn"
                      style={{ marginLeft: "0.75rem" }}
                    >
                      Create one
                    </button>
                  </td>
                </tr>
              )}
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      {a.time || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {a.patientName || a.patientId || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {a.phone && <span>{a.phone}</span>}
                        {a.email && <span style={{ fontSize: "0.8rem", color: "var(--medical-text-muted)" }}>{a.email}</span>}
                        {!a.phone && !a.email && "-"}
                      </div>
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {a.reason || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="td">
                    <span className={`statusPill ${getStatusClass(a.status || "pending")}`}>
                      {a.status || "pending"}
                    </span>
                  </td>
                  <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => setStatus(a.id, "confirmed")} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Confirm
                    </button>
                    <button onClick={() => setStatus(a.id, "completed")} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      Complete
                    </button>
                    <button onClick={() => setStatus(a.id, "cancelled")} className="pillBtnDanger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Cancel
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="pillBtnDanger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/payments/new?patientName=${encodeURIComponent(a.patientName || "")}&appointmentId=${encodeURIComponent(a.id)}`
                        )
                      }
                      className="pillBtn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

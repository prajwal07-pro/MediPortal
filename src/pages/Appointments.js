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

  const [date, setDate] = useState(() =>
    initialFromUrl || new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep ?date in URL synced for refresh/back
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    if (sp.get("date") !== date) {
      sp.set("date", date);
      window.history.replaceState(
        null,
        "",
        `${location.pathname}?${sp.toString()}`
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

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
      <div className="back-navigation">
        <button
          className="back-btn-dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="header">
        <h1 className="title">Appointments</h1>
        <div>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            className="primaryBtn"
            onClick={() =>
              navigate(
                `/appointments/new${date ? `?date=${encodeURIComponent(date)}` : ""}`
              )
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <div className="card">
        <div>{items.length} appointments</div>

        {/* Mobile View */}
        <div className="mobile-view">
          {loading ? (
            <div className="empty-state">Loading appointments...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div>No appointments for this date</div>
              <button
                className="create-btn"
                onClick={() =>
                  navigate(
                    `/appointments/new${
                      date ? `?date=${encodeURIComponent(date)}` : ""
                    }`
                  )
                }
              >
                Create First Appointment
              </button>
            </div>
          ) : (
            items.map((a) => (
              <div key={a.id} className="mobile-card">
                <div className="card-header">
                  <div className="time-patient">
                    <div className="time">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      {a.time || "No time set"}
                    </div>
                    <div className="patient-name">
                      {a.patientName || a.patientId || "Unknown Patient"}
                    </div>
                  </div>
                  <div className={`statusPill ${getStatusClass(a.status)}`}>
                    {a.status || "pending"}
                  </div>
                </div>

                <div className="contact-info">
                  {a.phone && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {a.phone}
                    </div>
                  )}
                  {a.email && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {a.email}
                    </div>
                  )}
                </div>

                {a.reason && (
                  <div className="reason">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    {a.reason}
                  </div>
                )}

                <div className="card-actions">
                  {a.status === "pending" && (
                    <button
                      className="action-btn confirm"
                      onClick={() => setStatus(a.id, "confirmed")}
                    >
                      Confirm
                    </button>
                  )}
                  {(a.status === "confirmed" || a.status === "pending") && (
                    <button
                      className="action-btn complete"
                      onClick={() => setStatus(a.id, "completed")}
                    >
                      Complete
                    </button>
                  )}
                  {a.status !== "cancelled" && a.status !== "completed" && (
                    <button
                      className="action-btn cancel"
                      onClick={() => setStatus(a.id, "cancelled")}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="action-btn payment"
                    onClick={() =>
                      navigate(
                        `/payments/new?patientId=${encodeURIComponent(
                          a.patientId || ""
                        )}`
                      )
                    }
                  >
                    Payment
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
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
              {loading ? (
                <tr>
                  <td className="td" colSpan="6">
                    Loading appointments...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="td" colSpan="6">
                    No appointments for this date —
                    <button
                      className="create-btn"
                      onClick={() =>
                        navigate(
                          `/appointments/new${
                            date ? `?date=${encodeURIComponent(date)}` : ""
                          }`
                        )
                      }
                      style={{ marginLeft: "1rem" }}
                    >
                      Create First Appointment
                    </button>
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id}>
                    <td className="td">{a.time || "-"}</td>
                    <td className="td">
                      {a.patientName || a.patientId || "-"}
                    </td>
                    <td className="td">
                      {a.phone && <div>{a.phone}</div>}
                      {a.email && <div>{a.email}</div>}
                      {!a.phone && !a.email && "-"}
                    </td>
                    <td className="td">{a.reason || "-"}</td>
                    <td className="td">
                      <span className={`statusPill ${getStatusClass(a.status)}`}>
                        {a.status || "pending"}
                      </span>
                    </td>
                    <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      {a.status === "pending" && (
                        <button
                          className="pillBtn"
                          onClick={() => setStatus(a.id, "confirmed")}
                        >
                          Confirm
                        </button>
                      )}
                      {(a.status === "confirmed" || a.status === "pending") && (
                        <button
                          className="pillBtn"
                          onClick={() => setStatus(a.id, "completed")}
                        >
                          Complete
                        </button>
                      )}
                      {a.status !== "cancelled" && a.status !== "completed" && (
                        <button
                          className="pillBtn"
                          onClick={() => setStatus(a.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="pillBtn"
                        onClick={() =>
                          navigate(
                            `/payments/new?patientId=${encodeURIComponent(
                              a.patientId || ""
                            )}`
                          )
                        }
                        style={{ marginLeft: "0.75rem" }}
                      >
                        Payment
                      </button>
                      <button
                        className="pillBtnDanger"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// src/pages/Patients.js
import React, { useEffect, useState } from "react";
import { listPatients, deletePatient } from "../services/patientService";
import { Link, useNavigate } from "react-router-dom";
import "./Patients.css";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await listPatients({ search });
      setPatients(data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      load();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
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
        <h1 className="title">Patients</h1>
        <div>
          <input
            type="text"
            className="input"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/patients/new" className="primaryBtn">
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
            New Patient
          </Link>
        </div>
      </div>

      <div className="card">
        <div>{patients.length} patients</div>

        {/* Mobile View */}
        <div className="mobile-view">
          {loading ? (
            <div className="empty-state">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div>
                No patients found{" "}
                {!search && (
                  <Link to="/patients/new" className="create-btn">
                    Create First Patient
                  </Link>
                )}
              </div>
            </div>
          ) : (
            patients.map((p) => (
              <div key={p.id} className="mobile-card">
                <div className="card-header">
                  <div className="patient-info">
                    <div className="patient-name">
                      <Link
                        to={`/patients/${p.id}`}
                        className="patient-name-link"
                      >
                        {p.name || "Unknown Patient"}
                      </Link>
                    </div>
                    <div className="patient-details">
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Age: {p.age ?? "Not specified"}
                      </div>
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 1v6m0 6v6"/>
                        </svg>
                        Gender: {p.gender || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contact-info">
                  {p.phone && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {p.phone}
                    </div>
                  )}
                  {p.email && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {p.email}
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <Link
                    to={`/patients/${p.id}`}
                    className="action-btn view"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/patients/${p.id}/edit`}
                    className="action-btn edit"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/payments?patientId=${encodeURIComponent(p.id)}`}
                    className="action-btn payment"
                  >
                    Payments
                  </Link>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(p.id)}
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
                <th className="th">Name</th>
                <th className="th">Age</th>
                <th className="th">Gender</th>
                <th className="th">Phone</th>
                <th className="th">Email</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="td" colSpan="6">
                    Loading patients...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td className="td" colSpan="6">
                    No patients found{" "}
                    {!search && (
                      <Link
                        to="/patients/new"
                        className="create-btn"
                        style={{ marginLeft: "1rem" }}
                      >
                        Create First Patient
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td className="td">
                      <Link
                        to={`/patients/${p.id}`}
                        style={{
                          color: "var(--medical-primary)",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        {p.name || "-"}
                      </Link>
                    </td>
                    <td className="td">{p.age ?? "-"}</td>
                    <td className="td">{p.gender || "-"}</td>
                    <td className="td">{p.phone || "-"}</td>
                    <td className="td">{p.email || "-"}</td>
                    <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <Link to={`/patients/${p.id}`} className="pillBtn">
                        View
                      </Link>
                      <Link to={`/patients/${p.id}/edit`} className="pillBtn">
                        Edit
                      </Link>
                      <Link
                        to={`/payments?patientId=${encodeURIComponent(p.id)}`}
                        className="pillBtn"
                        style={{ marginLeft: "0.75rem" }}
                      >
                        Payments
                      </Link>
                      <button
                        className="pillBtnDanger"
                        onClick={() => handleDelete(p.id)}
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

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
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const load = () => {
    // Move your load function code here
  };
  load();
}, []);


  async function handleDelete(id) {
    if (!window.confirm("Delete this patient?")) return;
    await deletePatient(id);
    load();
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
        <h2 className="title">Patients</h2>
        <div>
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <button
            className="primaryBtn"
            onClick={() => navigate("/patients/new")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Patient
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <section className="card">
        <div>
          {loading ? "Loading..." : `${patients.length} patients`}
        </div>
        
        {/* Mobile Card View */}
        <div className="mobile-view">
          {!loading && patients.length === 0 && (
            <div className="empty-state">
              <p>No patients found</p>
              {!search && (
                <button
                  onClick={() => navigate("/patients/new")}
                  className="pillBtn create-btn"
                >
                  Create one
                </button>
              )}
            </div>
          )}
          {patients.map((p) => (
            <div key={p.id} className="mobile-card">
              <div className="card-header">
                <div className="patient-info">
                  <Link to={`/patients/${p.id}`} className="patient-name-link">
                    <span className="patient-name">{p.name || "-"}</span>
                  </Link>
                  <div className="patient-details">
                    <span className="detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Age: {p.age ?? "-"}
                    </span>
                    <span className="detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {p.gender || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
              
              {(p.phone || p.email) && (
                <div className="contact-info">
                  {p.phone && (
                    <span className="contact-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {p.phone}
                    </span>
                  )}
                  {p.email && (
                    <span className="contact-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {p.email}
                    </span>
                  )}
                </div>
              )}
              
              <div className="card-actions">
                <Link to={`/patients/${p.id}`} className="action-btn view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View
                </Link>
                <Link to={`/patients/${p.id}/edit`} className="action-btn edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() =>
                    navigate(
                      `/payments/new?patientId=${encodeURIComponent(p.id)}&patientName=${encodeURIComponent(p.name || "")}`
                    )
                  }
                  className="action-btn payment"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Payment
                </button>
                <button onClick={() => handleDelete(p.id)} className="action-btn delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
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
              {!loading && patients.length === 0 && (
                <tr>
                  <td colSpan="6" className="td">
                    No patients found
                    {!search && (
                      <button
                        onClick={() => navigate("/patients/new")}
                        className="pillBtn"
                        style={{ marginLeft: "0.75rem" }}
                      >
                        Create one
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <Link to={`/patients/${p.id}`} className="patient-name-link">
                        {p.name || "-"}
                      </Link>
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {p.age ?? "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {p.gender || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {p.phone || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.email || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                    <Link to={`/patients/${p.id}`} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </Link>
                    <Link to={`/patients/${p.id}/edit`} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        navigate(
                          `/payments/new?patientId=${encodeURIComponent(p.id)}&patientName=${encodeURIComponent(p.name || "")}`
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
                    <button onClick={() => handleDelete(p.id)} className="pillBtnDanger">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                      Delete
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

// src/pages/Payments.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listPayments, deletePayment } from "../services/paymentService";
import "./Payments.css";

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const patientIdFromUrl = useMemo(
    () => new URLSearchParams(location.search).get("patientId"),
    [location.search]
  );

  const [items, setItems] = useState([]);
  const [patientId, setPatientId] = useState(patientIdFromUrl || "");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listPayments({ patientId: patientId || undefined });
      setItems(data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [patientId]); // Fixed: proper dependency array

  function goNew() {
    const qs = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
    navigate(`/payments/new${qs}`);
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await deletePayment(id);
      load();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  }

  function getStatusClass(status) {
    const statusMap = {
      received: "statusColors-received",
      pending: "statusColors-pending",
      refunded: "statusColors-refunded",
    };
    return statusMap[status] || "statusColors-received";
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
        <h2 className="title">Payments</h2>
        <div>
          <input
            placeholder="Filter by Patient ID (optional)"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="input"
          />
          <button className="primaryBtn" onClick={goNew}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Payment
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <section className="card">
        <div>
          {loading ? "Loading..." : `${items.length} payments`}
        </div>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="th">Date</th>
                <th className="th">Patient</th>
                <th className="th">Amount</th>
                <th className="th">Method</th>
                <th className="th">Status</th>
                <th className="th">Notes</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan="7" className="td">
                    No payments found
                    <button onClick={goNew} className="pillBtn" style={{ marginLeft: "0.75rem" }}>
                      Record one
                    </button>
                  </td>
                </tr>
              )}
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                        <span>{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : "-"}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--medical-text-muted)" }}>
                          {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleTimeString() : ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {p.patientName || p.patientId || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "700" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      ₹ {Number(p.amount || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      {p.method?.toUpperCase() || "-"}
                    </div>
                  </td>
                  <td className="td">
                    <span className={`statusPill ${getStatusClass(p.status || "received")}`}>
                      {p.status || "received"}
                    </span>
                  </td>
                  <td className="td">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      <span style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.notes || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button onClick={() => navigate(`/payments/${p.id}`)} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                    <button onClick={() => navigate(`/payments/${p.id}/edit`)} className="pillBtn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => onDelete(p.id)} className="pillBtnDanger">
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

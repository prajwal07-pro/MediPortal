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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  function goNew() {
    const qs = patientId
      ? `?patientId=${encodeURIComponent(patientId)}`
      : "";
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
        <h1 className="title">Payments</h1>
        <div>
          <input
            type="text"
            className="input"
            placeholder="Filter by Patient ID (optional)"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <button className="primaryBtn" onClick={goNew}>
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
            New Payment
          </button>
        </div>
      </div>

      <div className="card">
        <div>{items.length} payments</div>

        {/* Mobile View */}
        <div className="mobile-view">
          {loading ? (
            <div className="empty-state">Loading payments...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div>No payments found</div>
              <button className="create-btn" onClick={goNew}>
                Create First Payment
              </button>
            </div>
          ) : (
            items.map((p) => (
              <div key={p.id} className="mobile-card">
                <div className="card-header">
                  <div className="payment-info">
                    <div className="amount">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      ₹{Number(p.amount || 0).toFixed(2)}
                    </div>
                    <div className={`statusPill ${getStatusClass(p.status)}`}>
                      {p.status || "received"}
                    </div>
                  </div>
                </div>

                <div className="payment-details">
                  <div className="detail-row">
                    <div className="label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Date
                    </div>
                    <div className="value">
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleDateString()
                        : "Not available"}
                      <br />
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleTimeString()
                        : ""}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Patient
                    </div>
                    <div className="value">
                      {p.patientName || p.patientId || "Unknown"}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Method
                    </div>
                    <div className="value">
                      {p.method?.toUpperCase() || "CASH"}
                    </div>
                  </div>

                  {p.notes && (
                    <div className="detail-row">
                      <div className="label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                        Notes
                      </div>
                      <div className="value">{p.notes}</div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="action-btn view"
                    onClick={() => navigate(`/payments/${p.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => navigate(`/payments/${p.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(p.id)}
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
              {loading ? (
                <tr>
                  <td className="td" colSpan="7">
                    Loading payments...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="td" colSpan="7">
                    No payments found
                    <button
                      className="create-btn"
                      onClick={goNew}
                      style={{ marginLeft: "1rem" }}
                    >
                      Create First Payment
                    </button>
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id}>
                    <td className="td">
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleDateString()
                        : "-"}
                      <br />
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleTimeString()
                        : ""}
                    </td>
                    <td className="td">
                      {p.patientName || p.patientId || "-"}
                    </td>
                    <td className="td">₹ {Number(p.amount || 0).toFixed(2)}</td>
                    <td className="td">{p.method?.toUpperCase() || "-"}</td>
                    <td className="td">
                      <span className={`statusPill ${getStatusClass(p.status)}`}>
                        {p.status || "received"}
                      </span>
                    </td>
                    <td className="td">{p.notes || "-"}</td>
                    <td className="td" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        className="pillBtn"
                        onClick={() => navigate(`/payments/${p.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="pillBtn"
                        onClick={() => navigate(`/payments/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="pillBtnDanger"
                        onClick={() => onDelete(p.id)}
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

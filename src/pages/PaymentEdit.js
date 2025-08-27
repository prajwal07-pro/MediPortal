// src/pages/PaymentEdit.js
import React, { useEffect, useState } from "react";
import { getPaymentById, updatePayment } from "../services/paymentService";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentEdit.css";

const METHODS = ["cash", "card", "upi", "online", "insurance"];
const STATUSES = ["received", "pending", "refunded"];

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPaymentById(id);
        setForm(
          data || {
            patientId: "",
            patientName: "",
            appointmentId: "",
            amount: "",
            method: "cash",
            status: "received",
            notes: "",
          }
        );
      } catch (error) {
        console.error("Error loading payment:", error);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validation
      if (!form.patientId && !form.patientName) {
        setError("Patient ID or Patient Name is required.");
        setSaving(false);
        return;
      }
      if (!form.appointmentId.trim()) {
        setError("Appointment ID is required.");
        setSaving(false);
        return;
      }
      if (!form.amount || Number(form.amount) <= 0) {
        setError("Amount is required and must be greater than 0.");
        setSaving(false);
        return;
      }
      if (!form.method) {
        setError("Payment method is required.");
        setSaving(false);
        return;
      }
      if (!form.status) {
        setError("Payment status is required.");
        setSaving(false);
        return;
      }

      await updatePayment(id, form);
      navigate(`/payments/${id}`);
    } catch (err) {
      console.error(err);
      setError("Could not update payment. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="payment-edit-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <svg className="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
          </div>
          <p>Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="payment-edit-container">
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Payment Not Found</h2>
          <p>The payment you're trying to edit doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/payments")} className="back-btn">
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-edit-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate(`/payments/${id}`)} className="back-btn-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          <span>Back to Payment</span>
        </button>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h1 className="page-title">Edit Payment</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="payment-edit-main">
        <form onSubmit={handleSubmit} className="payment-form">
          {error && (
            <div className="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                Patient ID *
              </label>
              <input
                type="text"
                name="patientId"
                value={form.patientId}
                onChange={onChange}
                className="form-input"
                placeholder="Enter patient ID"
                required={!form.patientName}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Patient Name *
              </label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={onChange}
                className="form-input"
                placeholder="Enter patient name"
                required={!form.patientId}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Appointment ID *
              </label>
              <input
                type="text"
                name="appointmentId"
                value={form.appointmentId}
                onChange={onChange}
                className="form-input"
                placeholder="Enter appointment ID"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={onChange}
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Payment Method *
              </label>
              <select
                name="method"
                value={form.method}
                onChange={onChange}
                className="form-input"
                required
              >
                {METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
                Status *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="form-input"
                required
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                className="form-textarea"
                rows={4}
                placeholder="Enter any additional notes or comments"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/payments/${id}`)}
              className="cancel-btn"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  Update Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

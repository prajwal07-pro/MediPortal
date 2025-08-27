// src/pages/PaymentDetails.js
import React, { useEffect, useState } from "react";
import { getPaymentById } from "../services/paymentService";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PaymentDetails.css";

export default function PaymentDetails() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const p = await getPaymentById(id);
        setPayment(p);
      } catch (error) {
        console.error("Error loading payment:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function getStatusClass(status) {
    const statusMap = {
      received: "status-received",
      pending: "status-pending",
      refunded: "status-refunded",
    };
    return statusMap[status] || "status-received";
  }

  function formatDate(timestamp) {
    if (!timestamp || !timestamp.toDate) return "-";
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (loading) {
    return (
      <div className="payment-details-container">
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
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="payment-details-container">
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Payment Not Found</h2>
          <p>The payment record you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/payments")} className="back-btn">
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-details-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate("/payments")} className="back-btn-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          <span>Back to Payments</span>
        </button>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="payment-header-info">
            <div className="payment-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div className="payment-title">
              <h1 className="page-title">Payment Details</h1>
              <div className="payment-meta">
                <span className="payment-id">ID: {id}</span>
                <span className={`payment-status ${getStatusClass(payment.status)}`}>
                  {payment.status || "received"}
                </span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Link to={`/payments/${id}/edit`} className="edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Payment
            </Link>
            <Link to={`/payments/${id}/receipt`} className="receipt-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              View Receipt
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="payment-details-main">
        <div className="details-grid">
          {/* Payment Summary Card */}
          <div className="details-card highlight-card">
            <div className="card-header">
              <h3>Payment Summary</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="amount-display">
                <span className="currency">₹</span>
                <span className="amount">{Number(payment.amount || 0).toFixed(2)}</span>
              </div>
              <div className="payment-method">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Paid via {payment.method?.toUpperCase() || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="details-card">
            <div className="card-header">
              <h3>Payment Information</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Patient Name</span>
                  <span className="info-value">{payment.patientName || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Patient ID</span>
                  <span className="info-value">{payment.patientId || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Appointment ID</span>
                  <span className="info-value">{payment.appointmentId || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Date</span>
                  <span className="info-value">{formatDate(payment.createdAt)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{payment.method?.toUpperCase() || "-"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge ${getStatusClass(payment.status)}`}>
                    {payment.status || "received"}
                  </span>
                </div>
                {payment.notes && (
                  <div className="info-item full-width">
                    <span className="info-label">Notes</span>
                    <span className="info-value">{payment.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="details-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,11 12,14 22,4"/>
                <path d="M21,12v7a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2V5A2,2,0,0,1,5,3H16"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="actions-grid">
                <Link to={`/payments/${id}/receipt`} className="action-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Generate Receipt
                </Link>
                {payment.patientId && (
                  <Link to={`/patients/${payment.patientId}`} className="action-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    View Patient
                  </Link>
                )}
                <Link to={`/payments/new?patientId=${payment.patientId}&patientName=${encodeURIComponent(payment.patientName || '')}`} className="action-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Payment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

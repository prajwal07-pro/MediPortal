// src/pages/PaymentReceipt.js
import React, { useEffect, useState } from "react";
import { getPaymentById } from "../services/paymentService";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentReceipt.css";

export default function PaymentReceipt() {
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

  function formatDate(timestamp) {
    if (!timestamp || !timestamp.toDate) return "-";
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(timestamp) {
    if (!timestamp || !timestamp.toDate) return "-";
    return timestamp.toDate().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="receipt-container">
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
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="receipt-container">
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Payment Not Found</h2>
          <p>The payment receipt you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/payments")} className="back-btn">
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      {/* Print Controls - Hidden in print */}
      <div className="receipt-controls no-print">
        <button onClick={() => navigate(`/payments/${id}`)} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          Back to Payment
        </button>
        <button onClick={handlePrint} className="print-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 6,2 18,2 18,9"/>
            <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print Receipt
        </button>
      </div>

      {/* Receipt Content */}
      <div className="receipt-content">
        {/* Clinic Header */}
        <div className="clinic-header">
          <div className="clinic-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div className="clinic-info">
            <h1>Dr. Bharat Chougule</h1>
            <p>Hindalaga Clinic</p>
            <p>Phone: +91 99026 86173</p>
          </div>
        </div>

        {/* Receipt Title */}
        <div className="receipt-title">
          <h2>Payment Receipt</h2>
          <div className="receipt-number">
            Receipt #{id.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* Payment Details */}
        <div className="receipt-details">
          <div className="detail-section">
            <h3>Payment Information</h3>
            <div className="detail-grid">
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{formatDate(payment.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time:</span>
                <span className="value">{formatTime(payment.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Payment ID:</span>
                <span className="value">{id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Method:</span>
                <span className="value">{payment.method?.toUpperCase() || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`value status-${payment.status || 'received'}`}>
                  {payment.status?.toUpperCase() || "RECEIVED"}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Patient Information</h3>
            <div className="detail-grid">
              <div className="detail-row">
                <span className="label">Patient Name:</span>
                <span className="value">{payment.patientName || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Patient ID:</span>
                <span className="value">{payment.patientId || "-"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Appointment ID:</span>
                <span className="value">{payment.appointmentId || "-"}</span>
              </div>
            </div>
          </div>

          {payment.notes && (
            <div className="detail-section">
              <h3>Notes</h3>
              <div className="notes-content">
                {payment.notes}
              </div>
            </div>
          )}
        </div>

        {/* Amount Summary */}
        <div className="amount-summary">
          <div className="amount-row subtotal">
            <span className="label">Subtotal:</span>
            <span className="value">₹ {Number(payment.amount || 0).toFixed(2)}</span>
          </div>
          <div className="amount-row total">
            <span className="label">Total Paid:</span>
            <span className="value">₹ {Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="receipt-footer">
          <div className="thank-you">
            <h4>Thank you for your payment!</h4>
            <p>This is a computer-generated receipt and does not require a signature.</p>
          </div>
          <div className="footer-info">
            <p>Generated on {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

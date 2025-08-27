// src/pages/PatientDetails.js
import React, { useEffect, useState } from "react";
import { getPatientById } from "../services/patientService";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PatientDetails.css";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const p = await getPatientById(id);
        setPatient(p);
      } catch (error) {
        console.error("Error loading patient:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="patient-details-container">
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
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-details-container">
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Patient Not Found</h2>
          <p>The patient you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/patients")} className="back-btn">
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-details-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate("/patients")} className="back-btn-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          <span>Back to Patients</span>
        </button>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="patient-header-info">
            <div className="patient-avatar">
              {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="patient-title">
              <h1 className="page-title">{patient.name || 'Unknown Patient'}</h1>
              <div className="patient-meta">
                <span className="patient-id">ID: {id}</span>
                {patient.age && <span className="patient-age">Age: {patient.age}</span>}
                {patient.gender && <span className="patient-gender">{patient.gender}</span>}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Link to={`/patients/${id}/edit`} className="edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Patient
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="patient-details-main">
        <div className="details-grid">
          {/* Patient Information Card */}
          <div className="details-card">
            <div className="card-header">
              <h3>Patient Information</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{patient.name || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{patient.age || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{patient.gender || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{patient.phone || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{patient.email || '-'}</span>
                </div>
                {patient.address && (
                  <div className="info-item full-width">
                    <span className="info-label">Address</span>
                    <span className="info-value">{patient.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          {(patient.allergies || patient.medicalHistory) && (
            <div className="details-card">
              <div className="card-header">
                <h3>Medical Information</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="card-content">
                {patient.allergies && (
                  <div className="medical-item">
                    <h4>Allergies</h4>
                    <p>{patient.allergies}</p>
                  </div>
                )}
                {patient.medicalHistory && (
                  <div className="medical-item">
                    <h4>Medical History</h4>
                    <p>{patient.medicalHistory}</p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                <Link to={`/appointments/new?patientName=${encodeURIComponent(patient.name || '')}&phone=${encodeURIComponent(patient.phone || '')}`} className="action-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Book Appointment
                </Link>
                <Link to={`/payments/new?patientId=${id}&patientName=${encodeURIComponent(patient.name || '')}`} className="action-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Record Payment
                </Link>
                <Link to={`/payments?patientId=${id}`} className="action-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  View Payments
                </Link>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="details-card full-width">
            <div className="card-header">
              <h3>Patient Timeline</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div className="card-content">
              <div className="timeline-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <h4>Timeline Coming Soon</h4>
                <p>Patient visits, prescriptions, and payment history will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

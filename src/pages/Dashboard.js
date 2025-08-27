// src/pages/Dashboard.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  function getInitials(email) {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="doctor-photo">
              <img src="/1517622887538.jpg" alt="Dr. Bharat Chougule" />
            </div>
            <div className="doctor-details">
              <h1 className="doctor-name">Dr. Bharat Chougule</h1>
              <div className="clinic-info">
                <span className="clinic-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Hindalaga Clinic
                </span>
                <span className="doctor-contact">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 99026 86173
                </span>
              </div>
            </div>
          </div>

          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {getInitials(currentUser?.email)}
              </div>
              <div className="user-details">
                <div className="user-email">{currentUser?.email}</div>
                <div className="user-role">Healthcare Professional</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        

        {/* Navigation Section */}
        <section className="nav-section">
          <h2 className="section-title">Practice Management</h2>
          <div className="nav-grid">
            <Link to="/patients" className="nav-card patients-nav">
              <div className="nav-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="nav-content">
                <h3>Patient Management</h3>
                <p>Manage patient records, medical history, and profiles</p>
              </div>
              <div className="nav-arrow">→</div>
            </Link>

            <Link to="/appointments" className="nav-card appointments-nav">
              <div className="nav-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="nav-content">
                <h3>Appointments</h3>
                <p>Schedule, view, and manage patient appointments</p>
              </div>
              <div className="nav-arrow">→</div>
            </Link>

            <Link to="/payments" className="nav-card payments-nav">
              <div className="nav-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div className="nav-content">
                <h3>Payments</h3>
                <p>Track payments, billing, and financial records</p>
              </div>
              <div className="nav-arrow">→</div>
            </Link>

            <Link to="/reports" className="nav-card reports-nav">
              <div className="nav-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div className="nav-content">
                <h3>Reports & Analytics</h3>
                <p>Generate reports and view practice analytics</p>
              </div>
              <div className="nav-arrow">→</div>
            </Link>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome to Your Medical Dashboard</h2>
            <p>
              Streamline your healthcare practice with our comprehensive management system. 
              Access patient records, manage appointments, track payments, and generate 
              insightful reports all from one centralized platform designed specifically 
              for healthcare professionals.
            </p>
            <div className="welcome-features">
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Patient Management
              </div>
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Appointment Scheduling
              </div>
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Payment Tracking
              </div>
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Report Generation
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

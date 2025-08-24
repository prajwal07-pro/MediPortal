// src/pages/Dashboard.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
              </svg>
            </div>
            <h1 className="brand-title">MediPortal</h1>
          </div>
          
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-email">{currentUser?.email}</span>
                <span className="user-role">Healthcare Professional</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Navigation Cards */}
        <section className="nav-section">
          <h2 className="section-title">Management Portal</h2>
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

            {/* <Link to="/reports" className="nav-card reports-nav">
              <div className="nav-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="nav-content">
                <h3>Reports & Analytics</h3>
                <p>Generate reports and view practice analytics</p>
              </div>
              <div className="nav-arrow">→</div>
            </Link> */}
          </div>
        </section>

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome to Your Medical Dashboard</h2>
            <p>Streamline your healthcare practice with our comprehensive management system. 
               Access patient records, manage appointments, track payments, and generate insightful reports 
               all from one centralized platform designed specifically for healthcare professionals.</p>
            <div className="welcome-features">
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                <span>HIPAA Compliant</span>
              </div>
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                <span>Real-time Updates</span>
              </div>
              <div className="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                <span>Secure Data Storage</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

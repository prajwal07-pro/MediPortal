// src/pages/Reports.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPayments } from '../services/paymentService';
import { listAppointments } from '../services/appointmentService';
import { listPatients } from '../services/patientService';
import './Reports.css';

export default function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  async function loadReportsData() {
    setLoading(true);
    try {
      const [patients, appointments, payments] = await Promise.all([
        listPatients({}),
        listAppointments({ dateRange: dateRange.start + '|' + dateRange.end }),
        listPayments({ dateRange: dateRange.start + '|' + dateRange.end })
      ]);

      const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
      const completedAppointments = appointments.filter(a => a.status === 'completed').length;

      setStats({
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalRevenue,
        monthlyRevenue: totalRevenue,
        pendingAppointments,
        completedAppointments
      });
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reports-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate('/')} className="back-btn-dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <polyline points="12,19 5,12 12,5"/>
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="page-title-section">
            <div className="page-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h1 className="page-title">Reports & Analytics</h1>
          </div>
          <div className="date-range-controls">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reports-main">
        {loading ? (
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
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div className="stats-grid">
            {/* Revenue Card */}
            <div className="stat-card revenue-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3>Total Revenue</h3>
              </div>
              <div className="stat-value">₹ {stats.totalRevenue.toFixed(2)}</div>
              <div className="stat-subtitle">For selected period</div>
            </div>

            {/* Patients Card */}
            <div className="stat-card patients-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h3>Total Patients</h3>
              </div>
              <div className="stat-value">{stats.totalPatients}</div>
              <div className="stat-subtitle">Registered patients</div>
            </div>

            {/* Appointments Card */}
            <div className="stat-card appointments-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <h3>Appointments</h3>
              </div>
              <div className="stat-value">{stats.totalAppointments}</div>
              <div className="stat-breakdown">
                <span className="pending">Pending: {stats.pendingAppointments}</span>
                <span className="completed">Completed: {stats.completedAppointments}</span>
              </div>
            </div>

            {/* Quick Actions
            <div className="stat-card actions-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <h3>Export Reports</h3>
              </div>
              <div className="export-buttons">
                <button className="export-btn" onClick={() => console.log('Export PDF')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                  Export PDF
                </button>
                <button className="export-btn" onClick={() => console.log('Export CSV')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                  Export CSV
                </button>
              </div>
            </div> */}
          </div>
        )}

        {/* Charts Placeholder
        <div className="charts-section">
          <div className="chart-card">
            <h3>Revenue Trend</h3>
            <div className="chart-placeholder">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

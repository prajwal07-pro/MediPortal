// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Move ALL imports here at the top
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext"; // <-- keep at top with others
import PrivateRoute from "./components/PrivateRoute";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ResetPassword from "./features/auth/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientNew from "./pages/PatientNew";
import PatientDetails from "./pages/PatientDetails";
import Appointments from "./pages/Appointments";

import BookAppointment from "./pages/BookAppointment";
import "./index.css";
import AppointmentNew from "./pages/AppointmentNew";
import PatientEdit from "./pages/PatientEdit";

// Payments pages
import Payments from "./pages/Payments";
import PaymentNew from "./pages/PaymentNew";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentEdit from "./pages/PaymentEdit";
import PaymentReceipt from "./pages/PaymentReceipt";

// Helper to send authenticated users to dashboard, others to login
function HomeRedirect() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/book" element={<BookAppointment />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
<Route
path="/payments/:id/receipt"
element={
<PrivateRoute>
<PaymentReceipt />
</PrivateRoute>
}
/>


<Route
  path="/payments"
  element={
    <PrivateRoute>
      <Payments />
    </PrivateRoute>
  }
/>
<Route
  path="/payments/new"
  element={
    <PrivateRoute>
      <PaymentNew />
    </PrivateRoute>
  }
/>
<Route
  path="/payments/:id"
  element={
    <PrivateRoute>
      <PaymentDetails />
    </PrivateRoute>
  }
/>
<Route
  path="/payments/:id/edit"
  element={
    <PrivateRoute>
      <PaymentEdit />
    </PrivateRoute>
  }
/>

          <Route
            path="/patients"
            element={
              <PrivateRoute>
                <Patients />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/new"
            element={
              <PrivateRoute>
                <PatientNew />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PrivateRoute>
                <PatientDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
            <PrivateRoute>
              <PatientEdit />
            </PrivateRoute>
            }
          />

          <Route
            path="/appointments/new"
            element={
              <PrivateRoute>
                <AppointmentNew />
              </PrivateRoute>
            }
          />
          {/* Root redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

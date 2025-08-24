// src/pages/PatientDetails.js
import React, { useEffect, useState } from "react";
import { getPatientById } from "../services/patientService";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const p = await getPatientById(id);
      setPatient(p);
    })();
  }, [id]);

  if (!patient) {
    return (
      <div style={{ padding: 24 }}>
        <p>Loading...</p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const scheduleHref = `/appointments/new?date=${encodeURIComponent(today)}&patientName=${encodeURIComponent(patient.name || "")}&phone=${encodeURIComponent(patient.phone || "")}&email=${encodeURIComponent(patient.email || "")}`;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{patient.name}</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to={scheduleHref} style={{ ...secondaryBtn, textDecoration: "none" }}>
            Schedule Appointment
          </Link>
          <button onClick={() => navigate(`/patients/${id}/edit`)} style={secondaryBtn}>Edit</button>
          <Link to="/patients" style={{ ...secondaryBtn, textDecoration: "none", display: "inline-block", lineHeight: "32px" }}>
            Back
          </Link>

<Link
  to={`/payments/new?patientId=${encodeURIComponent(id)}&patientName=${encodeURIComponent(patient.name || "")}`}
  style={{ ...secondaryBtn, textDecoration: "none" }}
>
  Record Payment
</Link>


        </div>
      </div>

      <section style={card}>
        <h3 style={h3}>Basic Info</h3>
        <InfoRow label="Age" value={patient.age} />
        <InfoRow label="Gender" value={patient.gender} />
        <InfoRow label="Phone" value={patient.phone} />
        <InfoRow label="Email" value={patient.email} />
        <InfoRow label="Address" value={patient.address} />
        <InfoRow label="Allergies" value={patient.allergies} />
        <InfoRow label="Medical History" value={patient.medicalHistory} />
      </section>

      <section style={card}>
        <h3 style={h3}>Timeline</h3>
        <p style={{ color: "#777" }}>Visits, prescriptions, payments will appear here.</p>
      </section>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "10px 0", borderBottom: "1px dashed #eee" }}>
      <div style={{ color: "#666", fontWeight: 600 }}>{label}</div>
      <div style={{ color: "#333" }}>{value || "-"}</div>
    </div>
  );
}

const card = { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: 16 };
const h3 = { margin: "0 0 10px 0", color: "#444" };
const secondaryBtn = {
  background: "#eef1f7",
  color: "#333",
  border: "1px solid #d6d9e0",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function BookAppointment() {
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const ref = await addDoc(collection(db, "appointments"), {
        ...form,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccessId(ref.id);
    } catch (err) {
      setError("Could not submit booking. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (successId) {
    return (
      <div style={page}>
        <div style={card}>
          <h2>Appointment Requested</h2>
          <p>Reference ID: {successId}</p>
          <p>We will confirm your appointment via phone or email shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <form onSubmit={handleSubmit} style={card}>
        <h2>Book Appointment</h2>
        {error && <p style={errorMsg}>{error}</p>}
        <div style={grid}>
          <Field label="Full Name" name="patientName" value={form.patientName} onChange={onChange} required />
          <Field label="Phone" name="phone" value={form.phone} onChange={onChange} required />
          <Field label="Email" type="email" name="email" value={form.email} onChange={onChange} />
          <Field label="Date" type="date" name="date" value={form.date} onChange={onChange} required />
          <Field label="Time" type="time" name="time" value={form.time} onChange={onChange} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={label}>Reason</label>
          <textarea name="reason" value={form.reason} onChange={onChange} rows={4} style={input} />
        </div>
        <button disabled={saving} type="submit" style={primaryBtn}>
          {saving ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input name={name} value={value} onChange={onChange} type={type} style={input} {...rest} />
    </div>
  );
}

const page = { padding: 24, display: "flex", justifyContent: "center" };
const card = { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", maxWidth: 700, width: "100%" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 };
const labelStyle = { fontWeight: 600, color: "#555" };
const label = labelStyle;
const input = { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 };
const primaryBtn = { background: "#774bc2", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 700, marginTop: 16 };
const errorMsg = { color: "#b00020", background: "#fce4e4", padding: "8px 10px", borderRadius: 8, border: "1px solid #b00020" };

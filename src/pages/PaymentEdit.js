// src/pages/PaymentEdit.js
import React, { useEffect, useState } from "react";
import { getPaymentById, updatePayment } from "../services/paymentService";
import { useNavigate, useParams } from "react-router-dom";

const METHODS = ["cash", "card", "upi", "online", "insurance"];
const STATUSES = ["received", "pending", "refunded"];

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
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
      await updatePayment(id, form);
      navigate(`/payments/${id}`);
    } catch (err) {
      console.error(err);
      setError("Could not update payment.");
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Edit Payment</h2>
      <form onSubmit={handleSubmit} style={card}>
        {error && <p style={errorMsg}>{error}</p>}
        <div style={grid}>
          <Field label="Patient ID" name="patientId" value={form.patientId} onChange={onChange} />
          <Field label="Patient Name" name="patientName" value={form.patientName} onChange={onChange} />
          <Field label="Appointment ID" name="appointmentId" value={form.appointmentId} onChange={onChange} />
          <Field label="Amount" name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={onChange} />
          <Select label="Method" name="method" value={form.method} onChange={onChange} options={METHODS} />
          <Select label="Status" name="status" value={form.status} onChange={onChange} options={STATUSES} />
        </div>
        <div style={{ marginTop: 12 }}>
          <Label text="Notes" />
          <textarea name="notes" value={form.notes} onChange={onChange} rows={3} style={input} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button disabled={saving} type="submit" style={primaryBtn}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate(-1)} style={secondaryBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label text={label} />
      <input name={name} value={value} onChange={onChange} type={type} style={input} {...rest} />
    </div>
  );
}
function Select({ label, name, value, onChange, options = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label text={label} />
      <select name={name} value={value} onChange={onChange} style={input}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Label({ text }) { return <label style={labelStyle}>{text}</label>; }

const card = { background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 };
const labelStyle = { fontWeight: 600, color: "#555" };
const input = { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 };
const primaryBtn = { background: "#774bc2", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 700 };
const secondaryBtn = { background: "#eef1f7", color: "#333", border: "1px solid #d6d9e0", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600 };
const errorMsg = { color: "#b00020", background: "#fce4e4", padding: "8px 10px", borderRadius: 8, border: "1px solid #b00020", marginBottom: 10 };

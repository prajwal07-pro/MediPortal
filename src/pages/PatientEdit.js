import React, { useEffect, useState } from "react";
import { getPatientById, updatePatient } from "../services/patientService";
import { useParams, useNavigate } from "react-router-dom";

export default function PatientEdit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const p = await getPatientById(id);
      setForm(
        p || {
          name: "",
          age: "",
          gender: "",
          phone: "",
          email: "",
          address: "",
          allergies: "",
          medicalHistory: "",
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
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      await updatePatient(id, payload);
      navigate(`/patients/${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Edit Patient</h2>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
        <div style={grid}>
          <Field label="Name" name="name" value={form.name} onChange={onChange} required />
          <Field label="Age" name="age" type="number" min="0" value={form.age ?? ""} onChange={onChange} />
          <Select label="Gender" name="gender" value={form.gender || ""} onChange={onChange} options={["Male", "Female", "Other"]} />
          <Field label="Phone" name="phone" value={form.phone || ""} onChange={onChange} />
          <Field label="Email" name="email" type="email" value={form.email || ""} onChange={onChange} />
          <Field label="Address" name="address" value={form.address || ""} onChange={onChange} />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextArea label="Allergies" name="allergies" value={form.allergies || ""} onChange={onChange} />
        </div>
        <div style={{ marginTop: 16 }}>
          <TextArea label="Medical History" name="medicalHistory" value={form.medicalHistory || ""} onChange={onChange} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
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
      <label style={{ fontWeight: 600, color: "#555" }}>{label}</label>
      <input name={name} value={value} onChange={onChange} type={type} style={input} {...rest} />
    </div>
  );
}
function Select({ label, name, value, onChange, options = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600, color: "#555" }}>{label}</label>
      <select name={name} value={value} onChange={onChange} style={input}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function TextArea({ label, name, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600, color: "#555" }}>{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={4} style={{ ...input, resize: "vertical" }} />
    </div>
  );
}

const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 };
const input = { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8 };
const primaryBtn = { background: "#774bc2", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 700 };
const secondaryBtn = { background: "#eef1f7", color: "#333", border: "1px solid #d6d9e0", padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600 };

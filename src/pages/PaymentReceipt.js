import React, { useEffect, useState } from "react";
import { getPaymentById } from "../services/paymentService";
import { useParams } from "react-router-dom";

export default function PaymentReceipt() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    (async () => setP(await getPaymentById(id)))();
  }, [id]);

  if (!p) return <div style={{ padding: 24 }}>Loading...</div>;

  const created = p.createdAt?.toDate ? p.createdAt.toDate() : null;

  return (
    <div style={{ maxWidth: 620, margin: "20px auto", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
      <h2 style={{ marginTop: 0, textAlign: "center" }}>Payment Receipt</h2>
      <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10 }}>
        <Row label="Receipt #" value={id} />
        <Row label="Date" value={created ? created.toLocaleString() : "-"} />
        <Row label="Patient" value={p.patientName || p.patientId || "-"} />
        <Row label="Appointment" value={p.appointmentId || "-"} />
        <Row label="Amount" value={`₹ ${Number(p.amount || 0).toFixed(2)}`} />
        <Row label="Method" value={p.method} />
        <Row label="Status" value={p.status} />
        <Row label="Notes" value={p.notes || "-"} />
      </div>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={() => window.print()} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #d6d9e0", background: "#eef1f7", cursor: "pointer", fontWeight: 600 }}>
          Print
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", padding: "8px 0", borderBottom: "1px dashed #eee" }}>
      <div style={{ color: "#666", fontWeight: 600 }}>{label}</div>
      <div style={{ color: "#333" }}>{value}</div>
    </div>
  );
}

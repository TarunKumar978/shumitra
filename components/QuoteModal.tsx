"use client";
import { useState } from "react";
import { X, CheckCircle, Loader } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: string;
}

export default function QuoteModal({ isOpen, onClose, preselectedProduct }: QuoteModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    product: preselectedProduct || "",
    quantity: "", unit: "MT",
    name: "", company: "", email: "", phone: "", country: "", message: ""
  });

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    border: "1px solid rgba(13,27,42,0.15)", borderRadius: "10px",
    background: "#F5F0E8", fontSize: "13px", color: "#0D1B2A",
    outline: "none", boxSizing: "border-box" as const, fontFamily: "DM Sans, sans-serif"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try WhatsApp or email us directly.");
      }
    } catch {
      setError("Something went wrong. Please try WhatsApp or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(13,27,42,0.75)", backdropFilter:"blur(6px)" }} />

      {/* Modal */}
      <div style={{ position:"relative", background:"white", borderRadius:"24px", width:"100%", maxWidth:"500px", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(13,27,42,0.35)", zIndex:1 }}>

        {/* Header */}
        <div style={{ background:"#0D1B2A", borderRadius:"24px 24px 0 0", padding:"22px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 4px" }}>Shumitra Exports</p>
            <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", color:"white", fontSize:"20px", margin:0, fontWeight:400 }}>Request a Quote</h3>
          </div>
          <button onClick={onClose} style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,255,255,0.08)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:"28px" }}>
          {submitted ? (
            <div style={{ textAlign:"center", padding:"16px 0" }}>
              <div style={{ width:"64px", height:"64px", background:"rgba(34,197,94,0.1)", borderRadius:"20px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <CheckCircle size={32} color="#22c55e" />
              </div>
              <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:"#0D1B2A", marginBottom:"10px", fontWeight:400 }}>Inquiry Received!</h4>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"14px", lineHeight:1.7, marginBottom:"24px" }}>
                Thank you, <strong>{form.name}</strong>! Your inquiry has been sent directly to our team at <strong>info@silasya.com</strong>. We'll respond within 24 hours.
              </p>
              <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
                <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#22c55e", color:"white", fontWeight:700, padding:"12px 20px", borderRadius:"12px", textDecoration:"none", fontSize:"13px" }}>
                  💬 WhatsApp for faster response
                </a>
                <button onClick={onClose} style={{ padding:"12px 20px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", background:"white", color:"#0D1B2A", cursor:"pointer", fontSize:"13px", fontWeight:600 }}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* Product + Quantity */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Product Name *</label>
                  <input type="text" placeholder="e.g. Turmeric, Red Chilli, Basmati Rice..."
                    value={form.product}
                    onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Quantity</label>
                  <input type="text" placeholder="e.g. 5"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    style={{ ...inputStyle, cursor:"pointer" }}>
                    <option>MT</option>
                    <option>KG</option>
                    <option>Container</option>
                    <option>Tons</option>
                  </select>
                </div>
              </div>

              {/* Contact fields */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Full Name *</label>
                  <input type="text" placeholder="John Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Company</label>
                  <input type="text" placeholder="Acme Trading Co."
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Email *</label>
                  <input type="email" placeholder="john@company.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Phone / WhatsApp</label>
                  <input type="tel" placeholder="+971 50 123 4567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    style={inputStyle} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Country</label>
                  <input type="text" placeholder="UAE, USA, UK..."
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    style={inputStyle} />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom:"20px" }}>
                <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Additional Notes</label>
                <textarea placeholder="Specific grade, packaging, port of delivery, incoterms..."
                  rows={3} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize:"none" }} />
              </div>

              {/* Error */}
              {error && (
                <div style={{ background:"rgba(220,38,38,0.06)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:"10px", padding:"12px 14px", marginBottom:"16px" }}>
                  <p style={{ margin:0, fontSize:"12px", color:"#dc2626" }}>⚠️ {error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit"
                disabled={!form.product || !form.name || !form.email || loading}
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                  background: (form.product && form.name && form.email && !loading) ? "linear-gradient(135deg,#C4930A,#E8A020)" : "rgba(13,27,42,0.1)",
                  color: (form.product && form.name && form.email && !loading) ? "white" : "rgba(13,27,42,0.3)",
                  fontWeight:700, padding:"14px", borderRadius:"12px", border:"none",
                  cursor: (form.product && form.name && form.email && !loading) ? "pointer" : "not-allowed",
                  fontSize:"15px", transition:"all 0.2s",
                  boxShadow: (form.product && form.name && form.email && !loading) ? "0 6px 20px rgba(196,147,10,0.35)" : "none"
                }}>
                {loading ? (
                  <><Loader size={16} style={{ animation:"spin 1s linear infinite" }} /> Sending...</>
                ) : (
                  <>Send Inquiry ✉️</>
                )}
              </button>
              <p style={{ textAlign:"center", color:"rgba(13,27,42,0.3)", fontSize:"11px", marginTop:"10px" }}>
                🔒 Private & secure · We respond within 24 hours
              </p>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { products } from "@/lib/data";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ContactPage() {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ product:"", variety:"", quantity:"", unit:"MT", name:"", company:"", email:"", phone:"", country:"", message:"" });

  const selectedProduct = products.find(p => p.id === form.product);
  const selectedVariety = selectedProduct?.varieties.find((v: any) => v.id === form.variety);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Inquiry: ${selectedProduct?.name || "Product"} - ${form.quantity} ${form.unit} - ${form.country}`;
    const body = `New Export Inquiry

Product: ${selectedProduct?.name || "-"}
Variety: ${selectedVariety?.name || "Any"}
Quantity: ${form.quantity} ${form.unit}

Name: ${form.name}
Company: ${form.company || "-"}
Email: ${form.email}
Phone: ${form.phone || "-"}
Country: ${form.country || "-"}

Notes: ${form.message || "None"}`;
    window.location.href = `mailto:info@silasya.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  const inputStyle = { width:"100%", padding:"12px 16px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", background:"white", fontSize:"14px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const };

  if (submitted) return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 20px" }}>
      <div style={{ textAlign:"center", maxWidth:"440px" }}>
        <div style={{ width:"80px", height:"80px", background:"rgba(34,197,94,0.1)", borderRadius:"24px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}><CheckCircle size={40} color="#22c55e" /></div>
        <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"36px", color:"#0D1B2A", marginBottom:"16px", fontWeight:400 }}>Inquiry Sent!</h2>
        <p style={{ color:"rgba(13,27,42,0.6)", lineHeight:1.75, marginBottom:"32px" }}>Thank you, <strong>{form.name}</strong>. Your email client should have opened with your inquiry pre-filled. We'll respond within 24 hours.</p>
        <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"white", fontWeight:700, padding:"14px 28px", borderRadius:"12px", textDecoration:"none", fontSize:"15px" }}>💬 WhatsApp for faster response</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8" }}>

      <div style={{ background:"#0D1B2A", paddingTop: isMobile ? "90px" : "120px", paddingBottom: isMobile ? "40px" : "64px", position:"relative", overflow:"hidden" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px", position:"relative", zIndex:1 }}>
          <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"14px" }}>Get a Quote</p>
          <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(32px,5vw,64px)", color:"white", margin:"0 0 14px", lineHeight:1.1, fontWeight:400 }}>Start Your Inquiry</h1>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize: isMobile ? "14px" : "17px", maxWidth:"480px", lineHeight:1.75, margin:0 }}>Tell us what you need. We respond within 24 hours with pricing, samples, and full specifications.</p>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "32px 16px" : "56px 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: isMobile ? "32px" : "48px", alignItems:"start" }}>

          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"32px" }}>
              {["Product","Details","Send"].map((label, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, background: step > i+1 ? "#22c55e" : step === i+1 ? "#0D1B2A" : "rgba(13,27,42,0.08)", color: step >= i+1 ? "white" : "rgba(13,27,42,0.3)", transition:"all 0.3s", flexShrink:0 }}>{step > i+1 ? "✓" : i+1}</div>
                  <span style={{ fontSize: isMobile ? "12px" : "13px", fontWeight:600, color: step === i+1 ? "#0D1B2A" : "rgba(13,27,42,0.35)" }}>{label}</span>
                  {i < 2 && <div style={{ width: isMobile ? "16px" : "28px", height:"1px", background:"rgba(13,27,42,0.12)", margin:"0 2px" }} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "22px" : "28px", color:"#0D1B2A", marginBottom:"20px", fontWeight:400 }}>Which product are you looking for?</h3>
                  <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap:"10px", marginBottom:"20px" }}>
                    {products.map(p => (
                      <button type="button" key={p.id} onClick={() => setForm(f => ({ ...f, product:p.id, variety:"" }))}
                        style={{ padding: isMobile ? "12px" : "16px", borderRadius:"14px", border: form.product===p.id ? "2px solid #0D1B2A" : "1px solid rgba(13,27,42,0.1)", background: form.product===p.id ? "#0D1B2A" : "white", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                        <span style={{ fontSize: isMobile ? "22px" : "28px", display:"block", marginBottom:"6px" }}>{p.emoji}</span>
                        <span style={{ fontWeight:600, fontSize: isMobile ? "11px" : "13px", color: form.product===p.id ? "white" : "#0D1B2A" }}>{p.name}</span>
                      </button>
                    ))}
                  </div>
                  {selectedProduct && (
                    <div style={{ marginBottom:"20px" }}>
                      <label style={{ fontSize:"13px", fontWeight:600, color:"rgba(13,27,42,0.6)", display:"block", marginBottom:"10px" }}>Select Variety (optional)</label>
                      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"8px" }}>
                        {selectedProduct.varieties.map((v: any) => (
                          <button type="button" key={v.id} onClick={() => setForm(f => ({ ...f, variety:v.id }))}
                            style={{ padding:"12px 14px", borderRadius:"12px", border: form.variety===v.id ? "2px solid #C4930A" : "1px solid rgba(13,27,42,0.1)", background: form.variety===v.id ? "rgba(196,147,10,0.08)" : "white", cursor:"pointer", textAlign:"left" }}>
                            <span style={{ fontWeight:600, fontSize:"13px", color:"#0D1B2A", display:"block" }}>{v.name}</span>
                            <span style={{ fontSize:"11px", color:"rgba(13,27,42,0.45)" }}>{v.origin}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:"12px", alignItems:"flex-end", marginBottom:"24px" }}>
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:"13px", fontWeight:600, color:"rgba(13,27,42,0.6)", display:"block", marginBottom:"8px" }}>Quantity Required</label>
                      <input type="number" placeholder="e.g. 5" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity:e.target.value }))} style={inputStyle} />
                    </div>
                    <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit:e.target.value }))} style={{ padding:"12px 16px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", background:"white", fontSize:"14px", color:"#0D1B2A", outline:"none" }}>
                      <option>MT</option><option>KG</option><option>Container</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => setStep(2)} disabled={!form.product}
                    style={{ display:"inline-flex", alignItems:"center", gap:"8px", background: form.product ? "linear-gradient(135deg,#C4930A,#E8A020)" : "rgba(13,27,42,0.15)", color: form.product ? "white" : "rgba(13,27,42,0.3)", fontWeight:700, padding:"14px 28px", borderRadius:"12px", border:"none", cursor: form.product ? "pointer" : "not-allowed", fontSize:"15px" }}>
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "22px" : "28px", color:"#0D1B2A", marginBottom:"20px", fontWeight:400 }}>Your contact details</h3>
                  <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"14px", marginBottom:"20px" }}>
                    {[{ label:"Full Name *", key:"name", type:"text", placeholder:"John Smith" },{ label:"Company", key:"company", type:"text", placeholder:"Acme Trading Co." },{ label:"Email Address *", key:"email", type:"email", placeholder:"john@company.com" },{ label:"Phone / WhatsApp", key:"phone", type:"tel", placeholder:"+971 50 123 4567" },{ label:"Country", key:"country", type:"text", placeholder:"UAE" }].map(field => (
                      <div key={field.key}>
                        <label style={{ fontSize:"13px", fontWeight:600, color:"rgba(13,27,42,0.6)", display:"block", marginBottom:"8px" }}>{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder} value={form[field.key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field.key]:e.target.value }))} style={inputStyle} />
                      </div>
                    ))}
                    <div style={{ gridColumn: isMobile ? "auto" : "1/-1" }}>
                      <label style={{ fontSize:"13px", fontWeight:600, color:"rgba(13,27,42,0.6)", display:"block", marginBottom:"8px" }}>Additional Notes</label>
                      <textarea placeholder="Specific grade, packing, port of delivery..." rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} style={{ ...inputStyle, resize:"none" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                    <button type="button" onClick={() => setStep(1)} style={{ padding:"12px 20px", border:"1px solid rgba(13,27,42,0.2)", borderRadius:"12px", background:"white", color:"rgba(13,27,42,0.6)", cursor:"pointer", fontSize:"14px" }}>Back</button>
                    <button type="button" onClick={() => setStep(3)} disabled={!form.name || !form.email}
                      style={{ display:"inline-flex", alignItems:"center", gap:"8px", background: (form.name && form.email) ? "linear-gradient(135deg,#C4930A,#E8A020)" : "rgba(13,27,42,0.15)", color: (form.name && form.email) ? "white" : "rgba(13,27,42,0.3)", fontWeight:700, padding:"14px 28px", borderRadius:"12px", border:"none", cursor:(form.name && form.email) ? "pointer" : "not-allowed", fontSize:"15px" }}>
                      Review Inquiry <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "22px" : "28px", color:"#0D1B2A", marginBottom:"20px", fontWeight:400 }}>Review your inquiry</h3>
                  <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.08)", padding: isMobile ? "20px" : "28px", marginBottom:"20px" }}>
                    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr", gap:"16px" }}>
                      {[{ label:"Product", value:selectedProduct?.name||"-" },{ label:"Variety", value:selectedVariety?.name||"Any" },{ label:"Quantity", value:`${form.quantity||"-"} ${form.unit}` },{ label:"Country", value:form.country||"-" },{ label:"Name", value:form.name },{ label:"Email", value:form.email },{ label:"Phone", value:form.phone||"-" },{ label:"Company", value:form.company||"-" }].map(item => (
                        <div key={item.label}>
                          <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{item.label}</span>
                          <p style={{ fontWeight:600, color:"#0D1B2A", margin:"3px 0 0", fontSize: isMobile ? "13px" : "14px", wordBreak:"break-word" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:"rgba(196,147,10,0.06)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"18px", display:"flex", alignItems:"flex-start", gap:"10px" }}>
                    <span style={{ fontSize:"16px", flexShrink:0 }}>✉️</span>
                    <p style={{ margin:0, fontSize:"12px", color:"rgba(13,27,42,0.65)" }}>Clicking <strong>Send Inquiry</strong> will open your email app with this inquiry pre-filled and addressed to <strong>info@silasya.com</strong>.</p>
                  </div>
                  <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px" }}>
                    <button type="button" onClick={() => setStep(2)} style={{ padding:"12px 20px", border:"1px solid rgba(13,27,42,0.2)", borderRadius:"12px", background:"white", color:"rgba(13,27,42,0.6)", cursor:"pointer", fontSize:"14px" }}>Edit</button>
                    <button type="submit" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, padding:"14px 28px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"15px", boxShadow:"0 6px 20px rgba(196,147,10,0.35)" }}>Send Inquiry ✉️</button>
                  </div>
                  <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"12px" }}>Your information is private and secure. We respond within 24 hours.</p>
                </div>
              )}
            </form>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ background:"#0D1B2A", borderRadius:"20px", padding: isMobile ? "20px" : "28px" }}>
              <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:"white", marginBottom:"18px", fontWeight:400 }}>Other ways to reach us</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"12px", color:"rgba(255,255,255,0.7)", textDecoration:"none", fontSize:"14px" }}>
                  <span style={{ width:"38px", height:"38px", background:"rgba(34,197,94,0.15)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>💬</span>WhatsApp — fastest response
                </a>
                <a href="mailto:info@silasya.com" style={{ display:"flex", alignItems:"center", gap:"12px", color:"rgba(255,255,255,0.7)", textDecoration:"none", fontSize:"14px" }}>
                  <span style={{ width:"38px", height:"38px", background:"rgba(196,147,10,0.15)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>✉️</span>info@silasya.com
                </a>
              </div>
            </div>
            <div style={{ background:"rgba(196,147,10,0.06)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"20px", padding: isMobile ? "20px" : "28px" }}>
              <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:"#0D1B2A", marginBottom:"14px", fontWeight:400 }}>What happens next?</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {["We review your inquiry within 24 hours","You receive a detailed quote with specs","Free sample dispatched on approval","Production begins after PO confirmation"].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                    <span style={{ width:"22px", height:"22px", background:"linear-gradient(135deg,#C4930A,#E8A020)", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"10px", fontWeight:700, flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:"13px", color:"rgba(13,27,42,0.65)", lineHeight:1.6 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

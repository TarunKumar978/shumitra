"use client";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import QuoteModal from "@/components/QuoteModal";

export default function QualityPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);

  const productSpecs = [
    {
      name: "Turmeric", emoji: "🟡", origin: "Erode & Salem, TN",
      params: [
        { label: "Curcumin Content", value: "3–5%", good: true },
        { label: "Moisture", value: "< 10%", good: true },
        { label: "Total Ash", value: "< 7%", good: true },
        { label: "ASTA Colour", value: "25–35 units", good: true },
        { label: "Foreign Matter", value: "< 0.5%", good: true },
        { label: "Aflatoxin", value: "< 10 ppb", good: true },
      ]
    },
    {
      name: "Red Chilli", emoji: "🌶️", origin: "Guntur & Byadagi, AP",
      params: [
        { label: "ASTA Colour Value", value: "60–200+ units", good: true },
        { label: "Moisture", value: "< 11%", good: true },
        { label: "Capsaicin", value: "As per grade", good: true },
        { label: "Foreign Matter", value: "< 1%", good: true },
        { label: "Aflatoxin B1", value: "< 5 ppb", good: true },
        { label: "Pesticide Residue", value: "EU MRL compliant", good: true },
      ]
    },
    {
      name: "Black Pepper", emoji: "⚫", origin: "Malabar & Tellicherry, KL",
      params: [
        { label: "Bulk Density", value: "550–600 g/l", good: true },
        { label: "Moisture", value: "< 12%", good: true },
        { label: "Piperine", value: "4–6%", good: true },
        { label: "Bold Size", value: "5–12mm", good: true },
        { label: "ETO Treatment", value: "ETO-free", good: true },
        { label: "Volatile Oil", value: "2–4 ml/100g", good: true },
      ]
    },
    {
      name: "Cumin", emoji: "🟤", origin: "Unjha, Gujarat",
      params: [
        { label: "Purity", value: "> 99%", good: true },
        { label: "Moisture", value: "< 9%", good: true },
        { label: "Volatile Oil", value: "> 2.5%", good: true },
        { label: "Foreign Matter", value: "< 0.5%", good: true },
        { label: "Grade", value: "Singapore / European", good: true },
        { label: "Aflatoxin", value: "< 10 ppb", good: true },
      ]
    },
    {
      name: "Cardamom", emoji: "💚", origin: "Idukki, Kerala",
      params: [
        { label: "Bold Size", value: "7–8mm (AGEB)", good: true },
        { label: "Moisture", value: "< 10%", good: true },
        { label: "Volatile Oil", value: "> 4%", good: true },
        { label: "Green Colour", value: "Natural preserved", good: true },
        { label: "Foreign Matter", value: "< 0.5%", good: true },
        { label: "Purity", value: "> 98%", good: true },
      ]
    },
    {
      name: "Basmati Rice", emoji: "🌾", origin: "Punjab & Haryana",
      params: [
        { label: "Grain Length", value: "8mm+ (cooked)", good: true },
        { label: "Moisture", value: "< 12.5%", good: true },
        { label: "Ageing", value: "18 months minimum", good: true },
        { label: "Broken Grains", value: "< 1%", good: true },
        { label: "Foreign Matter", value: "< 0.1%", good: true },
        { label: "Aroma", value: "Natural basmati", good: true },
      ]
    },
  ];

  const active = productSpecs[activeProduct];

  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", paddingTop:"80px" }}>

      {/* PAGE HEADER */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"56px 48px 0" }}>
        <div style={{ paddingBottom:"40px", borderBottom:"1px solid rgba(13,27,42,0.1)" }}>
          <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>Quality Assurance</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"end" }}>
            <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(32px,4vw,52px)", color:"#0D1B2A", margin:0, lineHeight:1.1, fontWeight:400 }}>Quality is not an option.<br /><em style={{ color:"#C4930A" }}>It's our standard.</em></h1>
            <div>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"15px", lineHeight:1.8, margin:"0 0 28px" }}>We don't just claim quality — we document it. Every lot is tested, every parameter recorded, every shipment comes with a full Certificate of Analysis.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                {[
                  { icon:"🧪", label:"Lab-tested Every Lot", sub:"COA provided on request" },
                  { icon:"📄", label:"Zero Documentation Gap", sub:"Phyto · Fumigation · COA" },
                  { icon:"🌍", label:"Global Market Ready", sub:"EU · USA · Gulf · Asia compliant" },
                  { icon:"✅", label:"Govt. Registered Exporter", sub:"FSSAI · APEDA · Spices Board" },
                ].map((item, i) => (
                  <div key={i} style={{ background:"white", borderRadius:"14px", padding:"16px", border:"1px solid rgba(13,27,42,0.07)", display:"flex", gap:"12px", alignItems:"center" }}>
                    <span style={{ fontSize:"22px" }}>{item.icon}</span>
                    <div>
                      <p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"13px", margin:"0 0 2px" }}>{item.label}</p>
                      <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:0 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"64px 48px" }}>

        {/* QUALITY JOURNEY — visual timeline */}
        <div style={{ marginBottom:"80px" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>From Farm to Your Port</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Our 6-stage quality journey</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:"0", position:"relative" }}>
            {/* connecting line */}
            <div style={{ position:"absolute", top:"36px", left:"8%", right:"8%", height:"2px", background:"linear-gradient(90deg,#C4930A,#E8A020)", zIndex:0 }} />
            {[
              { n:"01", icon:"🌾", title:"Farm Selection", desc:"Vetted farms & FPOs across 29 states" },
              { n:"02", icon:"🔍", title:"Raw Inspection", desc:"Visual & physical check at source" },
              { n:"03", icon:"⚙️", title:"Processing", desc:"Cleaning, grading, sorting by spec" },
              { n:"04", icon:"🧪", title:"Lab Testing", desc:"COA, aflatoxin, moisture, colour" },
              { n:"05", icon:"📦", title:"Packaging", desc:"Fumigation, sealing, labelling" },
              { n:"06", icon:"🚢", title:"Export Dispatch", desc:"Full docs, port clearance, delivery" },
            ].map((s, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", position:"relative", zIndex:1 }}>
                <div style={{ width:"72px", height:"72px", borderRadius:"50%", background: i < 3 ? "#0D1B2A" : "linear-gradient(135deg,#C4930A,#E8A020)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", marginBottom:"14px", boxShadow:"0 4px 16px rgba(13,27,42,0.2)", border:"3px solid #F5F0E8" }}>{s.icon}</div>
                <span style={{ fontSize:"9px", color:"#C4930A", fontWeight:700, letterSpacing:"0.15em", display:"block", marginBottom:"4px" }}>{s.n}</span>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"13px", color:"#0D1B2A", margin:"0 0 4px", fontWeight:400 }}>{s.title}</p>
                <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"10px", lineHeight:1.5, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT-SPECIFIC SPECS — interactive */}
        <div style={{ marginBottom:"80px" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Product Quality Parameters</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>What we test, per product</h2>
          </div>

          {/* Product tabs */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"28px", justifyContent:"center" }}>
            {productSpecs.map((p, i) => (
              <button key={i} onClick={() => setActiveProduct(i)}
                style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"10px 18px", borderRadius:"50px", border: activeProduct === i ? "2px solid #0D1B2A" : "1px solid rgba(13,27,42,0.12)", background: activeProduct === i ? "#0D1B2A" : "white", color: activeProduct === i ? "white" : "rgba(13,27,42,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>
                <span>{p.emoji}</span> {p.name}
              </button>
            ))}
          </div>

          {/* Spec card */}
          <div style={{ background:"white", borderRadius:"24px", border:"1px solid rgba(13,27,42,0.08)", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ background:"#0D1B2A", padding:"24px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <span style={{ fontSize:"36px" }}>{active.emoji}</span>
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", color:"white", fontSize:"22px", margin:0, fontWeight:400 }}>{active.name}</h3>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", margin:0 }}>📍 {active.origin}</p>
                </div>
              </div>
              <span style={{ background:"rgba(196,147,10,0.15)", border:"1px solid rgba(196,147,10,0.3)", color:"#E8A020", fontSize:"11px", fontWeight:700, padding:"6px 14px", borderRadius:"8px", textTransform:"uppercase", letterSpacing:"0.1em" }}>COA Provided</span>
            </div>
            <div style={{ padding:"32px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
              {active.params.map((p, i) => (
                <div key={i} style={{ background:"#F5F0E8", borderRadius:"14px", padding:"18px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
                  <div>
                    <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 4px" }}>{p.label}</p>
                    <p style={{ color:"#0D1B2A", fontSize:"15px", fontWeight:700, margin:0, fontFamily:"monospace" }}>{p.value}</p>
                  </div>
                  <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:"14px" }}>✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT BUYERS GET — documents */}
        <div style={{ marginBottom:"80px" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Every Shipment Includes</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>The paperwork buyers actually need</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
            {[
              { icon:"📄", title:"Certificate of Analysis", desc:"Lab-certified COA for every lot — moisture, colour, purity, contaminants.", color:"#1E3A5F" },
              { icon:"🌿", title:"Phytosanitary Certificate", desc:"Issued by NPPO India. Required for plant-based products in all export markets.", color:"#1A6B3A" },
              { icon:"🔥", title:"Fumigation Certificate", desc:"Methyl bromide or heat treatment as per destination country requirements.", color:"#C0392B" },
              { icon:"📋", title:"APEDA / Spices Board Cert", desc:"Mandatory RCMC and registration docs for all regulated export categories.", color:"#C4930A" },
              { icon:"🚢", title:"Bill of Lading", desc:"Issued post-loading. Covers FOB, CIF, DAP as per buyer's incoterm.", color:"#7B3F00" },
              { icon:"🏭", title:"Packing List & Invoice", desc:"Detailed commercial invoice and packing list for customs clearance.", color:"#2C5F8A" },
              { icon:"🛡️", title:"FSSAI Certificate", desc:"Central FSSAI export license — mandatory for all food product exports.", color:"#5B2D8E" },
              { icon:"📊", title:"Weight & Quality Report", desc:"Third-party inspection report on request — SGS, Bureau Veritas, Intertek.", color:"#1A6B3A" },
            ].map((doc, i) => (
              <div key={i} style={{ background:"white", borderRadius:"18px", padding:"24px 20px", border:"1px solid rgba(13,27,42,0.07)" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:doc.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", marginBottom:"14px", boxShadow:`0 4px 12px ${doc.color}40` }}>{doc.icon}</div>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"15px", color:"#0D1B2A", margin:"0 0 8px", fontWeight:400 }}>{doc.title}</h3>
                <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"12px", lineHeight:1.65, margin:0 }}>{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TESTING PARAMETERS — the existing one, restyled */}
        <div style={{ background:"#0D1B2A", borderRadius:"24px", padding:"48px", marginBottom:"80px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Universal Parameters</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3vw,36px)", color:"white", margin:0, fontWeight:400 }}>What we test on every single lot</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
            {[
              { param:"Moisture Content", spec:"As per buyer spec / FSSAI limits", icon:"💧" },
              { param:"Foreign Matter", spec:"< 0.5% (cleaned & graded)", icon:"🔍" },
              { param:"Colour & Appearance", spec:"Visual grading per export standard", icon:"🎨" },
              { param:"Volatile Oil", spec:"Tested per spice type", icon:"🧪" },
              { param:"Curcumin / ASTA Value", spec:"Lab certified per batch", icon:"📊" },
              { param:"Aflatoxin", spec:"< 10 ppb (EU compliant)", icon:"⚗️" },
              { param:"Microbial Count", spec:"Within safe export limits", icon:"🦠" },
              { param:"Pesticide Residue", spec:"MRL compliant per destination", icon:"🌿" },
              { param:"Packing Integrity", spec:"Fumigated, sealed, labelled", icon:"📦" },
            ].map(item => (
              <div key={item.param} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"16px 18px", background:"rgba(255,255,255,0.04)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize:"20px", flexShrink:0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight:600, color:"white", fontSize:"13px", margin:"0 0 3px" }}>{item.param}</p>
                  <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:0 }}>{item.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATIONS — compact */}
        <div style={{ marginBottom:"0" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Our Credentials</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3vw,36px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Verified & government-registered</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
            {[
              { code:"FSSAI", number:"11226998000230", icon:"🛡️", color:"#1E3A5F" },
              { code:"APEDA", number:"RCMC/28873/2026-27", icon:"🌿", color:"#1A6B3A" },
              { code:"Spices Board", number:"CRES/SBCB/28045", icon:"🌶️", color:"#C0392B" },
              { code:"ISO 9001:2015", number:"SCC/2505SU/2790", icon:"✅", color:"#C4930A" },
              { code:"IEC", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" },
            ].map(cert => (
              <div key={cert.code} style={{ background:"white", borderRadius:"16px", padding:"20px 16px", textAlign:"center", border:"1px solid rgba(13,27,42,0.07)" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:cert.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", margin:"0 auto 10px", boxShadow:`0 4px 12px ${cert.color}40` }}>{cert.icon}</div>
                <p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"13px", margin:"0 0 4px" }}>{cert.code}</p>
                <p style={{ color:"#C4930A", fontSize:"9px", fontFamily:"monospace", fontWeight:700, margin:"0 0 6px" }}>{cert.number}</p>
                <div style={{ background:"rgba(26,107,58,0.08)", borderRadius:"6px", padding:"3px 0" }}>
                  <span style={{ color:"#1A6B3A", fontSize:"9px", fontWeight:700 }}>VERIFIED ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:"linear-gradient(135deg,#92400e,#C4930A,#E8A020)", padding:"72px 48px" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr auto", gap:"40px", alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,3.5vw,40px)", color:"white", margin:"0 0 10px", fontWeight:400, lineHeight:1.2 }}>Ready to work with a certified exporter?</h2>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", margin:0 }}>Send your requirements — we respond within 24 hours with pricing and full specs.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", flexShrink:0 }}>
            <button onClick={() => setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"white", color:"#0D1B2A", fontWeight:700, padding:"14px 28px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", whiteSpace:"nowrap", boxShadow:"0 6px 20px rgba(0,0,0,0.15)" }}>
              Request a Quote <ArrowRight size={15} />
            </button>
            <a href="https://wa.me/919164626957" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"rgba(255,255,255,0.15)", color:"white", fontWeight:600, padding:"14px 28px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

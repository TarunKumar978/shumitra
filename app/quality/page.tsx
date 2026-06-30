"use client";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import QuoteModal from "@/components/QuoteModal";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function QualityPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const isMobile = useIsMobile();

  const productSpecs = [
    { name:"Turmeric", emoji:"🟡", origin:"Erode & Salem, TN", params:[{ label:"Curcumin Content", value:"3-5%" },{ label:"Moisture", value:"< 10%" },{ label:"Total Ash", value:"< 7%" },{ label:"ASTA Colour", value:"25-35 units" },{ label:"Foreign Matter", value:"< 0.5%" },{ label:"Aflatoxin", value:"< 10 ppb" }] },
    { name:"Red Chilli", emoji:"🌶️", origin:"Guntur & Byadagi, AP", params:[{ label:"ASTA Colour Value", value:"60-200+ units" },{ label:"Moisture", value:"< 11%" },{ label:"Capsaicin", value:"As per grade" },{ label:"Foreign Matter", value:"< 1%" },{ label:"Aflatoxin B1", value:"< 5 ppb" },{ label:"Pesticide Residue", value:"EU MRL compliant" }] },
    { name:"Black Pepper", emoji:"⚫", origin:"Malabar & Tellicherry, KL", params:[{ label:"Bulk Density", value:"550-600 g/l" },{ label:"Moisture", value:"< 12%" },{ label:"Piperine", value:"4-6%" },{ label:"Bold Size", value:"5-12mm" },{ label:"ETO Treatment", value:"ETO-free" },{ label:"Volatile Oil", value:"2-4 ml/100g" }] },
    { name:"Cumin", emoji:"🟤", origin:"Unjha, Gujarat", params:[{ label:"Purity", value:"> 99%" },{ label:"Moisture", value:"< 9%" },{ label:"Volatile Oil", value:"> 2.5%" },{ label:"Foreign Matter", value:"< 0.5%" },{ label:"Grade", value:"Singapore / European" },{ label:"Aflatoxin", value:"< 10 ppb" }] },
    { name:"Cardamom", emoji:"💚", origin:"Idukki, Kerala", params:[{ label:"Bold Size", value:"7-8mm (AGEB)" },{ label:"Moisture", value:"< 10%" },{ label:"Volatile Oil", value:"> 4%" },{ label:"Green Colour", value:"Natural preserved" },{ label:"Foreign Matter", value:"< 0.5%" },{ label:"Purity", value:"> 98%" }] },
    { name:"Basmati Rice", emoji:"🌾", origin:"Punjab & Haryana", params:[{ label:"Grain Length", value:"8mm+ (cooked)" },{ label:"Moisture", value:"< 12.5%" },{ label:"Ageing", value:"18 months minimum" },{ label:"Broken Grains", value:"< 1%" },{ label:"Foreign Matter", value:"< 0.1%" },{ label:"Aroma", value:"Natural basmati" }] },
  ];

  const active = productSpecs[activeProduct];

  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", paddingTop:"80px" }}>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "32px 16px 0" : "56px 48px 0" }}>
        <div style={{ paddingBottom:"32px", borderBottom:"1px solid rgba(13,27,42,0.1)" }}>
          <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>Quality Assurance</p>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "48px", alignItems:"end" }}>
            <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(28px,4vw,52px)", color:"#0D1B2A", margin:0, lineHeight:1.1, fontWeight:400 }}>Quality is not an option.<br /><em style={{ color:"#C4930A" }}>It's our standard.</em></h1>
            <div>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize: isMobile ? "13px" : "15px", lineHeight:1.8, margin:"0 0 20px" }}>We don't just claim quality — we document it. Every lot is tested, every parameter recorded, every shipment comes with a full Certificate of Analysis.</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {[{ icon:"🧪", label:"Lab-tested Every Lot", sub:"COA provided on request" },{ icon:"📄", label:"Zero Documentation Gap", sub:"Phyto · Fumigation · COA" },{ icon:"🌍", label:"Global Market Ready", sub:"EU · USA · Gulf · Asia compliant" },{ icon:"✅", label:"Govt. Registered Exporter", sub:"FSSAI · APEDA · Spices Board" }].map((item, i) => (
                  <div key={i} style={{ background:"white", borderRadius:"12px", padding: isMobile ? "12px" : "16px", border:"1px solid rgba(13,27,42,0.07)", display:"flex", gap:"10px", alignItems:"center" }}>
                    <span style={{ fontSize:"18px" }}>{item.icon}</span>
                    <div>
                      <p style={{ fontWeight:700, color:"#0D1B2A", fontSize: isMobile ? "11px" : "13px", margin:"0 0 2px" }}>{item.label}</p>
                      <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"10px", margin:0 }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "32px 16px" : "64px 48px" }}>

        <div style={{ marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ textAlign:"center", marginBottom: isMobile ? "28px" : "48px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>From Farm to Your Port</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Our 6-stage quality journey</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: isMobile ? "16px" : "0", position:"relative" }}>
            {!isMobile && <div style={{ position:"absolute", top:"36px", left:"8%", right:"8%", height:"2px", background:"linear-gradient(90deg,#C4930A,#E8A020)", zIndex:0 }} />}
            {[{ n:"01", icon:"🌾", title:"Farm Selection", desc:"Vetted farms across 29 states" },{ n:"02", icon:"🔍", title:"Raw Inspection", desc:"Visual & physical check at source" },{ n:"03", icon:"⚙️", title:"Processing", desc:"Cleaning, grading, sorting" },{ n:"04", icon:"🧪", title:"Lab Testing", desc:"COA, aflatoxin, moisture" },{ n:"05", icon:"📦", title:"Packaging", desc:"Fumigation, sealing, labelling" },{ n:"06", icon:"🚢", title:"Export Dispatch", desc:"Full docs, port clearance" }].map((s, i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", position:"relative", zIndex:1 }}>
                <div style={{ width: isMobile ? "52px" : "72px", height: isMobile ? "52px" : "72px", borderRadius:"50%", background: i < 3 ? "#0D1B2A" : "linear-gradient(135deg,#C4930A,#E8A020)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile ? "18px" : "24px", marginBottom:"10px", boxShadow:"0 4px 16px rgba(13,27,42,0.2)", border:"3px solid #F5F0E8" }}>{s.icon}</div>
                <span style={{ fontSize:"9px", color:"#C4930A", fontWeight:700, letterSpacing:"0.15em", display:"block", marginBottom:"3px" }}>{s.n}</span>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "11px" : "13px", color:"#0D1B2A", margin:"0 0 3px" }}>{s.title}</p>
                {!isMobile && <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"10px", lineHeight:1.5, margin:0 }}>{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Product Quality Parameters</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>What we test, per product</h2>
          </div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"24px", justifyContent:"center" }}>
            {productSpecs.map((p, i) => (
              <button key={i} onClick={() => setActiveProduct(i)} style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding: isMobile ? "8px 12px" : "10px 18px", borderRadius:"50px", border: activeProduct===i ? "2px solid #0D1B2A" : "1px solid rgba(13,27,42,0.12)", background: activeProduct===i ? "#0D1B2A" : "white", color: activeProduct===i ? "white" : "rgba(13,27,42,0.6)", fontSize: isMobile ? "12px" : "13px", fontWeight:600, cursor:"pointer" }}>
                <span>{p.emoji}</span>{p.name}
              </button>
            ))}
          </div>
          <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.08)", overflow:"hidden" }}>
            <div style={{ background:"#0D1B2A", padding: isMobile ? "16px 20px" : "24px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize: isMobile ? "28px" : "36px" }}>{active.emoji}</span>
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", color:"white", fontSize: isMobile ? "18px" : "22px", margin:0, fontWeight:400 }}>{active.name}</h3>
                  <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", margin:0 }}>📍 {active.origin}</p>
                </div>
              </div>
              <span style={{ background:"rgba(196,147,10,0.15)", border:"1px solid rgba(196,147,10,0.3)", color:"#E8A020", fontSize:"11px", fontWeight:700, padding:"6px 14px", borderRadius:"8px", textTransform:"uppercase" }}>COA Provided</span>
            </div>
            <div style={{ padding: isMobile ? "16px" : "32px", display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap:"12px" }}>
              {active.params.map((p, i) => (
                <div key={i} style={{ background:"#F5F0E8", borderRadius:"12px", padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"10px" }}>
                  <div>
                    <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"10px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 3px" }}>{p.label}</p>
                    <p style={{ color:"#0D1B2A", fontSize: isMobile ? "13px" : "15px", fontWeight:700, margin:0, fontFamily:"monospace" }}>{p.value}</p>
                  </div>
                  <div style={{ width:"24px", height:"24px", borderRadius:"7px", background:"rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✓</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Every Shipment Includes</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>The paperwork buyers actually need</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: isMobile ? "10px" : "16px" }}>
            {[{ icon:"📄", title:"Certificate of Analysis", desc:"Lab-certified COA for every lot — moisture, colour, purity, contaminants.", color:"#1E3A5F" },{ icon:"🌿", title:"Phytosanitary Certificate", desc:"Issued by NPPO India. Required for plant-based products in all export markets.", color:"#1A6B3A" },{ icon:"🔥", title:"Fumigation Certificate", desc:"Methyl bromide or heat treatment as per destination country requirements.", color:"#C0392B" },{ icon:"📋", title:"APEDA / Spices Board Cert", desc:"Mandatory RCMC and registration docs for all regulated export categories.", color:"#C4930A" },{ icon:"🚢", title:"Bill of Lading", desc:"Issued post-loading. Covers FOB, CIF, DAP as per buyer incoterm.", color:"#7B3F00" },{ icon:"🏭", title:"Packing List & Invoice", desc:"Detailed commercial invoice and packing list for customs clearance.", color:"#2C5F8A" },{ icon:"🛡️", title:"FSSAI Certificate", desc:"Central FSSAI export license — mandatory for all food product exports.", color:"#5B2D8E" },{ icon:"📊", title:"Weight & Quality Report", desc:"Third-party inspection report on request — SGS, Bureau Veritas, Intertek.", color:"#1A6B3A" }].map((doc, i) => (
              <div key={i} style={{ background:"white", borderRadius:"16px", padding: isMobile ? "14px" : "24px 20px", border:"1px solid rgba(13,27,42,0.07)" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:doc.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", marginBottom:"12px" }}>{doc.icon}</div>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "13px" : "15px", color:"#0D1B2A", margin:"0 0 6px", fontWeight:400 }}>{doc.title}</h3>
                {!isMobile && <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"12px", lineHeight:1.65, margin:0 }}>{doc.desc}</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:"#0D1B2A", borderRadius:"20px", padding: isMobile ? "24px 20px" : "48px", marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Universal Parameters</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(20px,3vw,36px)", color:"white", margin:0, fontWeight:400 }}>What we test on every single lot</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:"10px" }}>
            {[{ param:"Moisture Content", spec:"As per buyer spec / FSSAI limits", icon:"💧" },{ param:"Foreign Matter", spec:"< 0.5% (cleaned & graded)", icon:"🔍" },{ param:"Colour & Appearance", spec:"Visual grading per export standard", icon:"🎨" },{ param:"Volatile Oil", spec:"Tested per spice type", icon:"🧪" },{ param:"Curcumin / ASTA Value", spec:"Lab certified per batch", icon:"📊" },{ param:"Aflatoxin", spec:"< 10 ppb (EU compliant)", icon:"⚗️" },{ param:"Microbial Count", spec:"Within safe export limits", icon:"🦠" },{ param:"Pesticide Residue", spec:"MRL compliant per destination", icon:"🌿" },{ param:"Packing Integrity", spec:"Fumigated, sealed, labelled", icon:"📦" }].map(item => (
              <div key={item.param} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"14px 16px", background:"rgba(255,255,255,0.04)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize:"18px", flexShrink:0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight:600, color:"white", fontSize: isMobile ? "12px" : "13px", margin:"0 0 2px" }}>{item.param}</p>
                  <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:0 }}>{item.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Our Credentials</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(20px,3vw,36px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Verified & government-registered</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(auto-fit, minmax(140px, 1fr))", gap: isMobile ? "10px" : "12px" }}>
            {[{ code:"FSSAI", number:"11226998000230", icon:"🛡️", color:"#1E3A5F" },{ code:"APEDA", number:"RCMC/28873/2026-27", icon:"🌿", color:"#1A6B3A" },{ code:"Spices Board", number:"CRES/SBCB/28045", icon:"🌶️", color:"#C0392B" },{ code:"ISO 9001:2015", number:"SCC/2505SU/2790", icon:"✅", color:"#C4930A" },{ code:"IEC", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" }].map(cert => (
              <div key={cert.code} style={{ background:"white", borderRadius:"14px", padding: isMobile ? "14px 10px" : "20px 16px", textAlign:"center", border:"1px solid rgba(13,27,42,0.07)" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:cert.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", margin:"0 auto 8px" }}>{cert.icon}</div>
                <p style={{ fontWeight:700, color:"#0D1B2A", fontSize: isMobile ? "11px" : "13px", margin:"0 0 3px" }}>{cert.code}</p>
                <p style={{ color:"#C4930A", fontSize:"9px", fontFamily:"monospace", fontWeight:700, margin:"0 0 6px" }}>{cert.number}</p>
                <div style={{ background:"rgba(26,107,58,0.08)", borderRadius:"6px", padding:"2px 0" }}><span style={{ color:"#1A6B3A", fontSize:"9px", fontWeight:700 }}>VERIFIED</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#92400e,#C4930A,#E8A020)", padding: isMobile ? "40px 20px" : "72px 48px" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: isMobile ? "24px" : "40px", alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3.5vw,40px)", color:"white", margin:"0 0 10px", fontWeight:400, lineHeight:1.2 }}>Ready to work with a certified exporter?</h2>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", margin:0 }}>Send your requirements — we respond within 24 hours.</p>
          </div>
          <div style={{ display:"flex", flexDirection: isMobile ? "row" : "column", gap:"10px" }}>
            <button onClick={() => setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"white", color:"#0D1B2A", fontWeight:700, padding:"14px 24px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", whiteSpace:"nowrap", boxShadow:"0 6px 20px rgba(0,0,0,0.15)", flex: isMobile ? 1 : "none" }}>Request a Quote <ArrowRight size={15} /></button>
            <a href="https://wa.me/919164626957" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"rgba(255,255,255,0.15)", color:"white", fontWeight:600, padding:"14px 24px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap", flex: isMobile ? 1 : "none" }}>💬 WhatsApp</a>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

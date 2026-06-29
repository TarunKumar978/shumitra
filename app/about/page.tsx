"use client";
import { ArrowRight } from "lucide-react";
import { certifications } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AboutPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", paddingTop:"80px" }}>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "32px 16px 0" : "56px 48px 0" }}>
        <div style={{ paddingBottom:"40px", borderBottom:"1px solid rgba(13,27,42,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
            <span style={{ width:"32px", height:"1px", background:"#C4930A", display:"inline-block" }} />
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Silasya Fusion Private Limited</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "28px" : "48px", alignItems:"end" }}>
            <div>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(32px,4.5vw,58px)", color:"#0D1B2A", margin:"0 0 16px", lineHeight:1.1, fontWeight:400 }}>India's spice trade,<br /><em style={{ color:"#C4930A" }}>done right.</em></h1>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize: isMobile ? "14px" : "16px", lineHeight:1.8, margin:"0 0 20px" }}>From farms across 29 Indian states to ports in Chennai, Mumbai & Mundra — we've spent 7 years building the sourcing network that serious buyers trust.</p>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {["FSSAI Licensed","APEDA Registered","Spices Board Certified","ISO 9001:2015"].map(tag => (
                  <span key={tag} style={{ fontSize:"11px", background:"rgba(196,147,10,0.08)", border:"1px solid rgba(196,147,10,0.2)", color:"#C4930A", borderRadius:"8px", padding:"4px 12px", fontWeight:600 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              {[{ n:"7+", l:"Years of Experience", icon:"📅" },{ n:"50+", l:"Countries Served", icon:"🌍" },{ n:"100+", l:"Product Varieties", icon:"🌿" },{ n:"5000+", l:"MT Exported", icon:"🚢" }].map(s => (
                <div key={s.l} style={{ background:"white", borderRadius:"16px", padding: isMobile ? "14px" : "20px", border:"1px solid rgba(13,27,42,0.07)", textAlign:"center" }}>
                  <div style={{ fontSize:"20px", marginBottom:"6px" }}>{s.icon}</div>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "24px" : "30px", color:"#C4930A", margin:"0 0 4px", fontWeight:400 }}>{s.n}</p>
                  <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:0, lineHeight:1.4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "40px 16px" : "64px 48px" }}>

        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "72px", alignItems:"center", marginBottom: isMobile ? "48px" : "80px" }}>
          <div>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"14px" }}>Our Story</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,3vw,40px)", color:"#0D1B2A", lineHeight:1.2, marginBottom:"20px", fontWeight:400 }}>Rooted in India,<br />reaching the world</h2>
            <div style={{ color:"rgba(13,27,42,0.65)", lineHeight:1.9, fontSize: isMobile ? "14px" : "15px" }}>
              <p style={{ marginBottom:"14px" }}>We started small — a single warehouse, a handful of supplier relationships, and an obsession with quality that made every shipment personal. Seven years later, Shumitra products move through ports in Chennai, Mumbai, and Mundra to buyers in over 50 countries.</p>
              <p style={{ marginBottom:"14px" }}>What hasn't changed is our approach: source from the people who know the soil, test what we ship, and stay accountable to every buyer we work with. No shortcuts. No substitutions.</p>
              <p style={{ margin:0 }}>We specialize in two categories — Indian spices and agricultural commodities — and we go deep in both.</p>
            </div>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ borderRadius:"24px", overflow:"hidden", height: isMobile ? "260px" : "440px" }}>
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80" alt="Indian spices" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(13,27,42,0.5) 0%, transparent 50%)" }} />
              <span style={{ position:"absolute", bottom:"20px", left:"24px", color:"white", fontSize:"13px", fontWeight:600 }}>Farm-fresh Indian Spices</span>
            </div>
            {!isMobile && (
              <div style={{ position:"absolute", top:"-18px", right:"-18px", background:"linear-gradient(135deg,#C4930A,#E8A020)", borderRadius:"20px", padding:"20px 24px", textAlign:"center", boxShadow:"0 12px 32px rgba(196,147,10,0.45)" }}>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"44px", color:"white", fontWeight:700, margin:0, lineHeight:1 }}>7+</p>
                <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"10px", margin:"4px 0 0", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>Years of<br/>Experience</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 8px" }}>Why Shumitra</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3vw,38px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Not just another exporter</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"14px" }}>
            {[
              { icon:"🌱", title:"Farm-to-Port Traceability", desc:"Every batch traceable to its farm and district. You know exactly where your product comes from.", tag:"Origin Verified" },
              { icon:"🔬", title:"Lab-Tested Every Lot", desc:"No shipment leaves without a COA. Moisture, ASTA values, curcumin, aflatoxin — all tested.", tag:"COA Provided" },
              { icon:"📋", title:"Zero Documentation Hassle", desc:"Phytosanitary, fumigation, FSSAI, APEDA, Spices Board — we handle every certificate end-to-end.", tag:"Full Paperwork" },
              { icon:"🤝", title:"Real Human Accountability", desc:"You deal with us directly. One point of contact who knows your order.", tag:"Direct Access" },
              { icon:"📦", title:"Any Pack, Any Label", desc:"PP bags, jute, vacuum packs, retail sachets. Custom packaging and private label.", tag:"Custom Packaging" },
              { icon:"⚡", title:"24-Hour Response Promise", desc:"Every inquiry gets a response within 24 hours. If we can't help, we tell you immediately.", tag:"Fast Response" },
            ].map((item, i) => (
              <div key={i} style={{ background:"white", borderRadius:"20px", padding: isMobile ? "18px" : "24px 28px", border:"1px solid rgba(13,27,42,0.07)", display:"flex", gap:"16px", alignItems:"flex-start" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"#F5F0E8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px", flexWrap:"wrap" }}>
                    <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "14px" : "16px", color:"#0D1B2A", margin:0, fontWeight:400 }}>{item.title}</h3>
                    <span style={{ fontSize:"9px", background:"rgba(196,147,10,0.1)", border:"1px solid rgba(196,147,10,0.2)", color:"#C4930A", borderRadius:"6px", padding:"2px 7px", fontWeight:700, textTransform:"uppercase" }}>{item.tag}</span>
                  </div>
                  <p style={{ color:"rgba(13,27,42,0.55)", fontSize: isMobile ? "12px" : "13px", lineHeight:1.7, margin:0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#92400e,#C4930A,#E8A020)", borderRadius:"28px", padding: isMobile ? "28px 20px" : "48px", position:"relative", overflow:"hidden", marginBottom: isMobile ? "48px" : "80px" }}>
          <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "28px" : "48px", alignItems:"center" }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"14px" }}>From the Founder</p>
              <blockquote style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(18px,2.5vw,28px)", color:"white", margin:"0 0 20px", lineHeight:1.5, fontWeight:400, fontStyle:"italic" }}>"We treat every shipment like it has our name on it. Because it does."</blockquote>
              <p style={{ color:"rgba(255,255,255,0.85)", fontSize: isMobile ? "13px" : "14px", lineHeight:1.8, marginBottom:"24px" }}>Every container that leaves India with our documentation reflects our relationships — with our farmers, our team, and you.</p>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", border:"1px solid rgba(255,255,255,0.3)", flexShrink:0 }}>👩</div>
                <div>
                  <p style={{ color:"white", fontWeight:700, fontSize:"14px", margin:0 }}>Richa Kumari</p>
                  <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"12px", margin:0 }}>Founder, Shumitra Exports · Silasya Fusion Pvt Ltd</p>
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {[{ n:"7+", l:"Years of supplier relationships" },{ n:"50+", l:"Countries receiving shipments" },{ n:"100%", l:"Documentation compliance" },{ n:"29", l:"Indian states sourced from" }].map((s, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:"14px", padding: isMobile ? "14px" : "20px" }}>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "22px" : "28px", color:"white", margin:"0 0 4px" }}>{s.n}</p>
                  <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"11px", margin:0, lineHeight:1.5 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:"0 0 8px" }}>Certifications</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,36px)", color:"#0D1B2A", margin:0, fontWeight:400 }}>Compliance you can count on</h2>
          </div>
          <div style={{ position:"relative", overflow:"hidden" }}>
            <div style={{ display:"flex", gap:"20px", animation:"certScroll 20s linear infinite", width:"max-content" }}>
              {[{ code:"FSSAI", label:"Food Safety & Standards Authority of India", number:"Lic: 11226998000230", icon:"🛡️", color:"#1E3A5F" },{ code:"APEDA", label:"Agricultural & Processed Food Products Export Development Authority", number:"RCMC/APEDA/28873/2026-27", icon:"🌿", color:"#1A6B3A" },{ code:"Spices Board", label:"Certificate of Registration as Exporter of Spices", number:"CRES/SBCB/28045/2026-27", icon:"🌶️", color:"#C0392B" },{ code:"ISO 9001:2015", label:"Quality Management System", number:"Cert: SCC/2505SU/2790", icon:"✅", color:"#C4930A" },{ code:"IEC", label:"Importer Exporter Code - DGFT", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" },{ code:"FSSAI", label:"Food Safety & Standards Authority of India", number:"Lic: 11226998000230", icon:"🛡️", color:"#1E3A5F" },{ code:"APEDA", label:"Agricultural & Processed Food Products Export Development Authority", number:"RCMC/APEDA/28873/2026-27", icon:"🌿", color:"#1A6B3A" },{ code:"Spices Board", label:"Certificate of Registration as Exporter of Spices", number:"CRES/SBCB/28045/2026-27", icon:"🌶️", color:"#C0392B" },{ code:"ISO 9001:2015", label:"Quality Management System", number:"Cert: SCC/2505SU/2790", icon:"✅", color:"#C4930A" },{ code:"IEC", label:"Importer Exporter Code - DGFT", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" }].map((cert, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px", background:"white", border:"1px solid rgba(13,27,42,0.07)", borderRadius:"18px", padding:"20px 24px", flexShrink:0, minWidth:"280px" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:cert.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", flexShrink:0 }}>{cert.icon}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}><p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"13px", margin:0 }}>{cert.code}</p><span style={{ fontSize:"9px", background:"rgba(26,107,58,0.1)", color:"#1A6B3A", borderRadius:"6px", padding:"2px 6px", fontWeight:700 }}>VERIFIED</span></div>
                    <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:"0 0 3px", lineHeight:1.4 }}>{cert.label}</p>
                    <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, fontFamily:"monospace", margin:0 }}>{cert.number}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"60px", background:"linear-gradient(to right, #F5F0E8, transparent)", zIndex:2, pointerEvents:"none" }} />
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"60px", background:"linear-gradient(to left, #F5F0E8, transparent)", zIndex:2, pointerEvents:"none" }} />
          </div>
          <style>{`@keyframes certScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#92400e,#C4930A,#E8A020)", padding: isMobile ? "40px 20px" : "72px 48px" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: isMobile ? "24px" : "40px", alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3.5vw,42px)", color:"white", margin:"0 0 10px", fontWeight:400, lineHeight:1.2 }}>Ready to source from India's best?</h2>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"15px", margin:0 }}>Fill the form — we respond within 24 hours.</p>
          </div>
          <div style={{ display:"flex", flexDirection: isMobile ? "row" : "column", gap:"10px" }}>
            <button onClick={() => setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"white", color:"#0D1B2A", fontWeight:700, padding:"14px 24px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", whiteSpace:"nowrap", boxShadow:"0 6px 20px rgba(0,0,0,0.15)", flex: isMobile ? 1 : "none" }}>Request a Quote <ArrowRight size={15} /></button>
            <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"rgba(255,255,255,0.15)", color:"white", fontWeight:600, padding:"14px 24px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap", flex: isMobile ? 1 : "none" }}>💬 WhatsApp</a>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

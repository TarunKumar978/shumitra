"use client";
import Link from "next/link";
import { products } from "@/lib/data";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Footer() {
  const isMobile = useIsMobile();
  const spices = products.filter(p => p.category === "spices");
  const commodities = products.filter(p => p.category === "commodities");

  return (
    <footer style={{ background:"#080F1A", color:"white", position:"relative", overflow:"hidden" }}>
      <div style={{ height:"2px", background:"linear-gradient(90deg,transparent,#C4930A,#E8A020,#C4930A,transparent)" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(196,147,10,0.03) 1px, transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding: isMobile ? "40px 20px 32px" : "72px 48px 48px", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1.6fr 1fr 1fr 1.2fr", gap: isMobile ? "28px 16px" : "56px", marginBottom: isMobile ? "28px" : "56px" }}>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px" }}>
              <img src="/logo.jpeg" alt="Shumitra" style={{ width:"44px", height:"44px", borderRadius:"12px", objectFit:"contain", background:"rgba(255,255,255,0.04)", padding:"4px", border:"1px solid rgba(255,255,255,0.08)" }} />
              <div>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", fontWeight:700, margin:0 }}>SHUMITRA</p>
                <p style={{ fontSize:"8px", color:"#C4930A", letterSpacing:"0.18em", textTransform:"uppercase", margin:"3px 0 0", fontWeight:600 }}>Silasya Fusion Private Limited</p>
              </div>
            </div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", lineHeight:1.8, marginBottom:"16px", fontStyle:"italic", borderLeft:"2px solid rgba(196,147,10,0.4)", paddingLeft:"14px" }}>"Rooted in India. Made for the World." — Pan-India sourcing, export-grade quality, and personal accountability on every order.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"16px" }}>
              {["FSSAI","APEDA","Spices Board","ISO 9001:2015","IEC"].map(c => (<span key={c} style={{ fontSize:"10px", color:"#C4930A", background:"rgba(196,147,10,0.08)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"6px", padding:"3px 10px", fontWeight:600 }}>{c}</span>))}
            </div>
            <a href="/Shumitra_Export_Catalogue.pdf" download="Shumitra_Export_Catalogue.pdf" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,rgba(196,147,10,0.15),rgba(232,160,32,0.1))", border:"1px solid rgba(196,147,10,0.3)", color:"#E8A020", fontSize:"12px", fontWeight:700, padding:"10px 18px", borderRadius:"10px", textDecoration:"none" }}>⬇ Download Export Catalogue</a>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}><span style={{ width:"16px", height:"1px", background:"#C4930A", display:"inline-block" }} /><p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Spices</p></div>
            {spices.map(p => (<Link key={p.id} href={`/products/${p.id}`} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.45)", fontSize: isMobile ? "12px" : "13px", textDecoration:"none", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }} onMouseEnter={e => e.currentTarget.style.color="#E8A020"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}><span style={{ fontSize:"13px" }}>{p.emoji}</span>{p.name}</Link>))}
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}><span style={{ width:"16px", height:"1px", background:"#C4930A", display:"inline-block" }} /><p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Commodities</p></div>
            {commodities.map(p => (<Link key={p.id} href={`/products/${p.id}`} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.45)", fontSize: isMobile ? "12px" : "13px", textDecoration:"none", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }} onMouseEnter={e => e.currentTarget.style.color="#E8A020"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}><span style={{ fontSize:"13px" }}>{p.emoji}</span>{p.name}</Link>))}
          </div>
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}><span style={{ width:"16px", height:"1px", background:"#C4930A", display:"inline-block" }} /><p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Get In Touch</p></div>
            <div style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined, flexDirection: isMobile ? undefined : "column" as const, gap:"10px", marginBottom:"16px" }}>
              {[{ icon:"✉️", text:"info@silasya.com", href:"mailto:info@silasya.com" },{ icon:"✉️", text:"tarun.k@silasya.com", href:"mailto:tarun.k@silasya.com" },{ icon:"📞", text:"+91 72598 29005", href:"tel:+917259829005" },{ icon:"📞", text:"+91 81230 62978", href:"tel:+918123062978" },{ icon:"💬", text:"WhatsApp Us", href:"https://wa.me/919164626957" }].map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.45)", fontSize:"12px", textDecoration:"none" }} onMouseEnter={e => e.currentTarget.style.color="#E8A020"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}><span style={{ fontSize:"13px", width:"18px", textAlign:"center", flexShrink:0 }}>{item.icon}</span>{item.text}</a>
              ))}
            </div>
            <div style={{ display: isMobile ? "grid" : "block", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined, gap:"10px" }}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"12px 14px", marginBottom: isMobile ? "0" : "10px" }}>
                <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"10px", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Office</p>
                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", lineHeight:1.6, margin:0 }}>89, Royal Placid Layout,<br />HSR Layout, Bengaluru - 560102</p>
              </div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"12px 14px" }}>
                <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"10px", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Warehouse</p>
                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", lineHeight:1.6, margin:0 }}>27, Parvathi Nagar, Peenya,<br />Bengaluru - 560058</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop:"20px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection: isMobile ? "column" : "row", alignItems:"center", justifyContent: isMobile ? "center" : "space-between", gap:"12px", textAlign: isMobile ? "center" : "left" }}>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px", margin:0 }}>© 2025 Silasya Fusion Private Limited. All rights reserved. | Made in India 🇮🇳</p>
          <div style={{ display:"flex", gap:"20px", flexWrap:"wrap", justifyContent:"center" }}>
            {[["About","/about"],["Products","/products"],["Quality","/quality"],["Contact","/contact"]].map(([l,h]) => (<Link key={h} href={h} style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", textDecoration:"none" }} onMouseEnter={e => e.currentTarget.style.color="#C4930A"} onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}>{l}</Link>))}
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px", margin:0 }}>IEC: ABPCS7831N · GST Registered</p>
        </div>
      </div>
    </footer>
  );
}

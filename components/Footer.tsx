"use client";
import Link from "next/link";
import { products } from "@/lib/data";

export default function Footer() {
  const spices = products.filter(p => p.category === "spices");
  const commodities = products.filter(p => p.category === "commodities");

  return (
    <footer style={{ background:"#080F1A", color:"white", position:"relative", overflow:"hidden" }}>

      {/* Top gold line */}
      <div style={{ height:"2px", background:"linear-gradient(90deg,transparent,#C4930A,#E8A020,#C4930A,transparent)" }} />

      {/* Background texture */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(196,147,10,0.03) 1px, transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"-120px", right:"-80px", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(196,147,10,0.05),transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-80px", left:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"radial-gradient(circle,rgba(196,147,10,0.04),transparent 65%)", pointerEvents:"none" }} />

      {/* Main footer content */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"72px 48px 48px", position:"relative", zIndex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1.2fr", gap:"56px", marginBottom:"56px" }}>

          {/* Brand column */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"24px" }}>
              <img src="/logo.jpeg" alt="Shumitra" style={{ width:"56px", height:"56px", borderRadius:"14px", objectFit:"contain", background:"rgba(255,255,255,0.04)", padding:"4px", border:"1px solid rgba(255,255,255,0.08)" }} />
              <div>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", fontWeight:700, margin:0, letterSpacing:"0.04em" }}>SHUMITRA</p>
                <p style={{ fontSize:"8px", color:"#C4930A", letterSpacing:"0.22em", textTransform:"uppercase", margin:"3px 0 0", fontWeight:600 }}>Silasya Fusion Private Limited</p>
              </div>
            </div>

            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", lineHeight:1.8, marginBottom:"24px", fontStyle:"italic", borderLeft:"2px solid rgba(196,147,10,0.4)", paddingLeft:"14px" }}>
              "Rooted in India. Made for the World." — Pan-India sourcing, export-grade quality, and personal accountability on every order.
            </p>

            {/* Cert badges */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"24px" }}>
              {["FSSAI","APEDA","Spices Board","ISO 9001:2015","IEC"].map(c => (
                <span key={c} style={{ fontSize:"10px", color:"#C4930A", background:"rgba(196,147,10,0.08)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"6px", padding:"3px 10px", fontWeight:600 }}>{c}</span>
              ))}
            </div>

            <a href="/Shumitra_Export_Catalogue.pdf" download="Shumitra_Export_Catalogue.pdf"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,rgba(196,147,10,0.15),rgba(232,160,32,0.1))", border:"1px solid rgba(196,147,10,0.3)", color:"#E8A020", fontSize:"12px", fontWeight:700, padding:"10px 18px", borderRadius:"10px", textDecoration:"none", letterSpacing:"0.04em" }}>
              ⬇ Download Export Catalogue
            </a>
          </div>

          {/* Spices */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
              <span style={{ width:"20px", height:"1px", background:"#C4930A", display:"inline-block" }} />
              <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Spices</p>
            </div>
            {spices.map(p => (
              <Link key={p.id} href={`/products/${p.id}`}
                style={{ display:"flex", alignItems:"center", gap:"10px", color:"rgba(255,255,255,0.45)", fontSize:"13px", textDecoration:"none", padding:"5px 0", transition:"all 0.2s", borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color="#E8A020"; e.currentTarget.style.paddingLeft="6px"; }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.45)"; e.currentTarget.style.paddingLeft="0"; }}>
                <span style={{ fontSize:"14px" }}>{p.emoji}</span>{p.name}
              </Link>
            ))}
          </div>

          {/* Commodities */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
              <span style={{ width:"20px", height:"1px", background:"#C4930A", display:"inline-block" }} />
              <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Commodities</p>
            </div>
            {commodities.map(p => (
              <Link key={p.id} href={`/products/${p.id}`}
                style={{ display:"flex", alignItems:"center", gap:"10px", color:"rgba(255,255,255,0.45)", fontSize:"13px", textDecoration:"none", padding:"5px 0", transition:"all 0.2s", borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color="#E8A020"; e.currentTarget.style.paddingLeft="6px"; }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.45)"; e.currentTarget.style.paddingLeft="0"; }}>
                <span style={{ fontSize:"14px" }}>{p.emoji}</span>{p.name}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
              <span style={{ width:"20px", height:"1px", background:"#C4930A", display:"inline-block" }} />
              <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Get In Touch</p>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
              {[
                { icon:"✉️", text:"info@silasya.com", href:"mailto:info@silasya.com" },
                { icon:"✉️", text:"tarun.k@silasya.com", href:"mailto:tarun.k@silasya.com" },
                { icon:"📞", text:"+91 72598 29005", href:"tel:+917259829005" },
                { icon:"📞", text:"+91 81230 62978", href:"tel:+918123062978" },
                { icon:"💬", text:"WhatsApp Us", href:"https://wa.me/919164626957" },
              ].map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:"10px", color:"rgba(255,255,255,0.45)", fontSize:"13px", textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color="#E8A020"}
                  onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
                  <span style={{ fontSize:"14px", width:"20px", textAlign:"center" }}>{item.icon}</span>
                  {item.text}
                </a>
              ))}
            </div>

            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px 16px" }}>
              <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Office</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", lineHeight:1.7, margin:0 }}>89, Royal Placid Layout,<br />HSR Layout, Bengaluru – 560102</p>
            </div>

            <div style={{ marginTop:"12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px 16px" }}>
              <p style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.1em" }}>Warehouse</p>
              <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", lineHeight:1.7, margin:0 }}>27, Parvathi Nagar, Peenya,<br />Bengaluru – 560058</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop:"24px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", margin:0 }}>© 2025 Silasya Fusion Private Limited. All rights reserved. | Made in India 🇮🇳</p>
          <div style={{ display:"flex", gap:"24px" }}>
            {[["About","/about"],["Products","/products"],["Quality","/quality"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={h} href={h} style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color="#C4930A"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}>
                {l}
              </Link>
            ))}
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:"12px", margin:0 }}>IEC: ABPCS7831N · GST Registered</p>
        </div>
      </div>
    </footer>
  );
}

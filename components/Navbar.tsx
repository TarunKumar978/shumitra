"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { products } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const openMenu = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMegaOpen(true); };
  const closeMenu = () => { timeoutRef.current = setTimeout(() => setMegaOpen(false), 150); };
  const spices = products.filter(p => p.category === "spices");
  const commodities = products.filter(p => p.category === "commodities");

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height: scrolled ? "60px" : "64px", background:"rgba(245,240,232,0.97)", backdropFilter:"blur(12px)", boxShadow: scrolled ? "0 2px 20px rgba(13,27,42,0.1)" : "0 1px 0 rgba(13,27,42,0.08)", transition:"all 0.3s ease" }}>

        <Link href="/" onClick={() => setMenuOpen(false)} style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none", flexShrink:0 }}>
          <img src="/logo.jpeg" alt="Shumitra" style={{ width:"36px", height:"36px", borderRadius:"10px", objectFit:"contain", background:"rgba(13,27,42,0.05)", padding:"2px" }} />
          <div style={{ lineHeight:1.2 }}>
            <span style={{ display:"block", fontFamily:"DM Serif Display,Georgia,serif", fontSize:"16px", color:"#0D1B2A", fontWeight:700, letterSpacing:"0.04em" }}>SHUMITRA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-desktop" style={{ alignItems:"center", gap:"6px" }}>
          {[["Home","/"],["About","/about"],["Quality","/quality"]].map(([l,h]) => (
            <Link key={h} href={h} style={{ color:"#0D1B2A", fontSize:"13px", fontWeight:500, textDecoration:"none", padding:"8px 14px", borderRadius:"8px", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color="#C4930A"; e.currentTarget.style.background="rgba(196,147,10,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#0D1B2A"; e.currentTarget.style.background="transparent"; }}>{l}</Link>
          ))}
          <div style={{ position:"relative" }} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <button style={{ color:"#0D1B2A", fontSize:"13px", fontWeight:500, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"4px", padding:"8px 14px", borderRadius:"8px" }}
              onMouseEnter={e => { e.currentTarget.style.color="#C4930A"; e.currentTarget.style.background="rgba(196,147,10,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#0D1B2A"; e.currentTarget.style.background="transparent"; }}>
              Products <span style={{ fontSize:"10px", opacity:0.5 }}>▾</span>
            </button>
            {megaOpen && <div style={{ position:"absolute", top:"100%", left:"-20px", right:"-20px", height:"16px", zIndex:99 }} />}
            {megaOpen && (
              <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{ position:"absolute", top:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", width:"440px", background:"white", border:"1px solid rgba(13,27,42,0.1)", borderRadius:"18px", boxShadow:"0 20px 60px rgba(13,27,42,0.15)", padding:"20px", zIndex:100 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                  <div>
                    <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>Spices</p>
                    {spices.map(p => (<Link key={p.id} href={`/products/${p.id}`} onClick={() => setMegaOpen(false)} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"6px 0", textDecoration:"none" }} onMouseEnter={e => (e.currentTarget.style.color="#C4930A")} onMouseLeave={e => (e.currentTarget.style.color="rgba(13,27,42,0.65)")}><span style={{ fontSize:"15px" }}>{p.emoji}</span>{p.name}</Link>))}
                  </div>
                  <div>
                    <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>Commodities</p>
                    {commodities.map(p => (<Link key={p.id} href={`/products/${p.id}`} onClick={() => setMegaOpen(false)} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"6px 0", textDecoration:"none" }} onMouseEnter={e => (e.currentTarget.style.color="#C4930A")} onMouseLeave={e => (e.currentTarget.style.color="rgba(13,27,42,0.65)")}><span style={{ fontSize:"15px" }}>{p.emoji}</span>{p.name}</Link>))}
                  </div>
                </div>
                <div style={{ marginTop:"14px", paddingTop:"12px", borderTop:"1px solid rgba(13,27,42,0.08)" }}>
                  <Link href="/products" onClick={() => setMegaOpen(false)} style={{ color:"#C4930A", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>View full catalogue →</Link>
                </div>
              </div>
            )}
          </div>
          <a href="/Shumitra_Export_Catalogue.pdf" download="Shumitra_Export_Catalogue.pdf" style={{ marginLeft:"4px", display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(196,147,10,0.08)", border:"1px solid rgba(196,147,10,0.25)", color:"#C4930A", fontWeight:600, fontSize:"12px", padding:"8px 16px", borderRadius:"10px", textDecoration:"none", whiteSpace:"nowrap" }}>⬇ Catalogue</a>
          <button onClick={() => setQuoteOpen(true)} style={{ marginLeft:"8px", background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"white", fontWeight:700, fontSize:"13px", padding:"9px 20px", borderRadius:"10px", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(196,147,10,0.35)", whiteSpace:"nowrap" }}>Get a Quote</button>
        </div>

        {/* Mobile Nav */}
        <div className="nav-mobile" style={{ alignItems:"center", gap:"8px" }}>
          <button onClick={() => setQuoteOpen(true)} style={{ background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"white", fontWeight:700, fontSize:"12px", padding:"8px 14px", borderRadius:"10px", border:"none", cursor:"pointer", whiteSpace:"nowrap" }}>Quote</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color:"#0D1B2A", background:"none", border:"none", cursor:"pointer", padding:"6px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div style={{ position:"fixed", inset:0, zIndex:40, background:"#F5F0E8", paddingTop:"64px", overflowY:"auto", display: menuOpen ? "block" : "none" }}>
        <div style={{ padding:"24px 24px 48px" }}>
          {[["Home","/"],["Products","/products"],["About","/about"],["Quality","/quality"]].map(([l,h]) => (
            <Link key={h} href={h} onClick={() => setMenuOpen(false)} style={{ display:"block", color:"#0D1B2A", fontSize:"28px", fontFamily:"DM Serif Display,Georgia,serif", padding:"14px 0", borderBottom:"1px solid rgba(13,27,42,0.08)", textDecoration:"none", fontWeight:400 }}>{l}</Link>
          ))}
          <div style={{ marginTop:"28px", marginBottom:"8px" }}>
            <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>Spices</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {spices.map(p => (<Link key={p.id} href={`/products/${p.id}`} onClick={() => setMenuOpen(false)} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"8px 12px", textDecoration:"none", background:"white", borderRadius:"10px", border:"1px solid rgba(13,27,42,0.07)" }}><span>{p.emoji}</span>{p.name}</Link>))}
            </div>
          </div>
          <div style={{ marginTop:"20px", marginBottom:"28px" }}>
            <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>Commodities</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {commodities.map(p => (<Link key={p.id} href={`/products/${p.id}`} onClick={() => setMenuOpen(false)} style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"8px 12px", textDecoration:"none", background:"white", borderRadius:"10px", border:"1px solid rgba(13,27,42,0.07)" }}><span>{p.emoji}</span>{p.name}</Link>))}
            </div>
          </div>
          <button onClick={() => { setMenuOpen(false); setQuoteOpen(true); }} style={{ display:"block", width:"100%", background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"white", fontWeight:700, textAlign:"center", padding:"16px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"16px", marginBottom:"12px" }}>Get a Quote</button>
          <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", width:"100%", background:"rgba(37,211,102,0.1)", border:"1px solid rgba(37,211,102,0.3)", color:"#16a34a", fontWeight:600, textAlign:"center", padding:"14px", borderRadius:"12px", textDecoration:"none", fontSize:"15px", boxSizing:"border-box" }}>💬 WhatsApp Us</a>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}

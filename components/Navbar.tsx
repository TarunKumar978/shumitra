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

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const spices = products.filter(p => p.category === "spices");
  const commodities = products.filter(p => p.category === "commodities");

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", height: scrolled ? "64px" : "72px", background:"rgba(245,240,232,0.97)", backdropFilter:"blur(12px)", boxShadow: scrolled ? "0 2px 20px rgba(13,27,42,0.1)" : "0 1px 0 rgba(13,27,42,0.08)", transition:"all 0.3s ease" }}>

        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:"12px", textDecoration:"none", flexShrink:0 }}>
          <img src="/logo.jpeg" alt="Shumitra" style={{ width:"44px", height:"44px", borderRadius:"10px", objectFit:"contain", background:"rgba(13,27,42,0.05)", padding:"2px" }} />
          <div style={{ lineHeight:1.2 }}>
            <span style={{ display:"block", fontFamily:"DM Serif Display,Georgia,serif", fontSize:"19px", color:"#0D1B2A", fontWeight:700, letterSpacing:"0.04em" }}>SHUMITRA</span>
            <span style={{ display:"block", fontSize:"8px", color:"#C4930A", fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase" }}>Rooted in India. Made for the World.</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          {[["Home","/"],["About","/about"],["Quality","/quality"]].map(([l,h]) => (
            <Link key={h} href={h} style={{ color:"#0D1B2A", fontSize:"13px", fontWeight:500, textDecoration:"none", padding:"8px 14px", borderRadius:"8px", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color="#C4930A"; e.currentTarget.style.background="rgba(196,147,10,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#0D1B2A"; e.currentTarget.style.background="transparent"; }}>
              {l}
            </Link>
          ))}

          {/* Products dropdown */}
          <div style={{ position:"relative" }} onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <button style={{ color:"#0D1B2A", fontSize:"13px", fontWeight:500, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"4px", padding:"8px 14px", borderRadius:"8px" }}
              onMouseEnter={e => { e.currentTarget.style.color="#C4930A"; e.currentTarget.style.background="rgba(196,147,10,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#0D1B2A"; e.currentTarget.style.background="transparent"; }}>
              Products <span style={{ fontSize:"10px", opacity:0.5 }}>▾</span>
            </button>

            {megaOpen && <div style={{ position:"absolute", top:"100%", left:"-20px", right:"-20px", height:"16px", zIndex:99 }} />}

            {megaOpen && (
              <div onMouseEnter={openMenu} onMouseLeave={closeMenu}
                style={{ position:"absolute", top:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", width:"440px", background:"white", border:"1px solid rgba(13,27,42,0.1)", borderRadius:"18px", boxShadow:"0 20px 60px rgba(13,27,42,0.15)", padding:"20px", zIndex:100 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                  <div>
                    <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>Spices</p>
                    {spices.map(p => (
                      <Link key={p.id} href={`/products/${p.id}`} onClick={() => setMegaOpen(false)}
                        style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"6px 0", textDecoration:"none" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#C4930A")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(13,27,42,0.65)")}>
                        <span style={{ fontSize:"15px" }}>{p.emoji}</span>{p.name}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>Commodities</p>
                    {commodities.map(p => (
                      <Link key={p.id} href={`/products/${p.id}`} onClick={() => setMegaOpen(false)}
                        style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(13,27,42,0.65)", fontSize:"13px", padding:"6px 0", textDecoration:"none" }}
                        onMouseEnter={e => (e.currentTarget.style.color="#C4930A")}
                        onMouseLeave={e => (e.currentTarget.style.color="rgba(13,27,42,0.65)")}>
                        <span style={{ fontSize:"15px" }}>{p.emoji}</span>{p.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:"14px", paddingTop:"12px", borderTop:"1px solid rgba(13,27,42,0.08)" }}>
                  <Link href="/products" onClick={() => setMegaOpen(false)} style={{ color:"#C4930A", fontSize:"13px", fontWeight:500, textDecoration:"none" }}>
                    View full catalogue →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Download Catalogue */}
          <a href="/Shumitra_Export_Catalogue.pdf" download="Shumitra_Export_Catalogue.pdf"
            style={{ marginLeft:"4px", display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(196,147,10,0.08)", border:"1px solid rgba(196,147,10,0.25)", color:"#C4930A", fontWeight:600, fontSize:"12px", padding:"8px 16px", borderRadius:"10px", textDecoration:"none", whiteSpace:"nowrap" }}>
            ⬇ Catalogue
          </a>

          {/* Get a Quote — opens modal */}
          <button onClick={() => setQuoteOpen(true)}
            style={{ marginLeft:"8px", background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"white", fontWeight:700, fontSize:"13px", padding:"9px 20px", borderRadius:"10px", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(196,147,10,0.35)", whiteSpace:"nowrap" }}>
            Get a Quote
          </button>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display:"none", color:"#0D1B2A", background:"none", border:"none", cursor:"pointer", padding:"8px" }}>
          {menuOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:40, background:"#F5F0E8", paddingTop:"80px", paddingLeft:"32px", paddingRight:"32px" }}>
          {[["Home","/"],["Products","/products"],["About","/about"],["Quality","/quality"]].map(([l,h]) => (
            <Link key={h} href={h} onClick={() => setMenuOpen(false)} style={{ display:"block", color:"#0D1B2A", fontSize:"28px", fontFamily:"DM Serif Display,Georgia,serif", padding:"16px 0", borderBottom:"1px solid rgba(13,27,42,0.1)", textDecoration:"none" }}>{l}</Link>
          ))}
          <button onClick={() => { setMenuOpen(false); setQuoteOpen(true); }}
            style={{ display:"block", width:"100%", marginTop:"32px", background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"white", fontWeight:700, textAlign:"center", padding:"16px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"18px" }}>
            Get a Quote
          </button>
        </div>
      )}

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}

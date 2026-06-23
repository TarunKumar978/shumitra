"use client";
import React, { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { products } from "@/lib/data";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const product = products.find(p => p.id === id);
  if (!product) notFound();

  const [activeVariety, setActiveVariety] = useState(0);
  const variety = product.varieties[activeVariety];

  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", paddingTop:"80px" }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"20px 48px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", color:"rgba(13,27,42,0.45)" }}>
          <Link href="/" style={{ color:"rgba(13,27,42,0.45)", textDecoration:"none" }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color:"rgba(13,27,42,0.45)", textDecoration:"none" }}>Products</Link>
          <span>/</span>
          <span style={{ color:"#0D1B2A", fontWeight:600 }}>{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 48px 48px" }}>
        <div style={{ background:"#0D1B2A", borderRadius:"24px", overflow:"hidden", padding:"48px", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 70% 50%, ${product.heroColor}30, transparent 60%)`, pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"center" }}>
            <div>
              <span style={{ display:"inline-block", fontSize:"11px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"#C4930A", background:"rgba(196,147,10,0.12)", border:"1px solid rgba(196,147,10,0.25)", borderRadius:"50px", padding:"5px 16px", marginBottom:"20px" }}>
                {product.category}
              </span>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(36px,4vw,56px)", color:"white", margin:"0 0 16px", lineHeight:1.1, fontWeight:400 }}>{product.name}</h1>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"16px", lineHeight:1.8, marginBottom:"24px" }}>{product.description}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"32px" }}>
                {product.certifications.map(c => (
                  <span key={c} style={{ fontSize:"11px", fontWeight:700, color:"#C4930A", border:"1px solid rgba(196,147,10,0.35)", borderRadius:"10px", padding:"4px 12px" }}>{c}</span>
                ))}
              </div>
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                <Link href="mailto:info@silasya.com" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, padding:"14px 28px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", boxShadow:"0 6px 20px rgba(196,147,10,0.4)" }}>
                  Request Quote <ArrowRight size={15} />
                </Link>
                <a href="mailto:info@silasya.com" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.08)", color:"white", fontWeight:600, padding:"14px 28px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(255,255,255,0.15)" }}>
                  💬 WhatsApp
                </a>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"100%", maxWidth:"360px", aspectRatio:"16/9", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px", cursor:"pointer" }}>
                <div style={{ width:"60px", height:"60px", background:"rgba(196,147,10,0.2)", border:"1px solid rgba(196,147,10,0.3)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Play size={22} color="#C4930A" style={{ marginLeft:"3px" }} />
                </div>
                <span style={{ fontSize:"40px" }}>{product.emoji}</span>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", margin:0 }}>Product video — upload via admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Varieties + Detail */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 48px 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"32px" }}>

          {/* Variety selector */}
          <div>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"22px", color:"#0D1B2A", marginBottom:"20px", fontWeight:400 }}>
              {product.varieties.length} Varieties Available
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {product.varieties.map((v, i) => (
                <button key={v.id} onClick={() => setActiveVariety(i)} style={{ width:"100%", textAlign:"left", padding:"16px", borderRadius:"16px", border: i === activeVariety ? "1px solid #0D1B2A" : "1px solid rgba(13,27,42,0.1)", background: i === activeVariety ? "#0D1B2A" : "white", cursor:"pointer", transition:"all 0.2s" }}>
                  <p style={{ fontWeight:600, fontSize:"14px", color: i === activeVariety ? "white" : "#0D1B2A", margin:"0 0 2px" }}>{v.name}</p>
                  <p style={{ fontSize:"12px", color: i === activeVariety ? "rgba(255,255,255,0.5)" : "rgba(13,27,42,0.45)", margin:"0 0 8px" }}>{v.origin}</p>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"11px", padding:"2px 10px", borderRadius:"8px", background: i === activeVariety ? "rgba(255,255,255,0.1)" : "#F5F0E8", color: i === activeVariety ? "#C4930A" : "rgba(13,27,42,0.55)" }}>{v.grade}</span>
                    <span style={{ fontSize:"11px", padding:"2px 10px", borderRadius:"8px", background: i === activeVariety ? "rgba(255,255,255,0.1)" : "#F5F0E8", color: i === activeVariety ? "rgba(255,255,255,0.6)" : "rgba(13,27,42,0.55)" }}>MOQ: {v.minOrder}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Variety detail */}
          <div style={{ background:"white", borderRadius:"24px", border:"1px solid rgba(13,27,42,0.08)", overflow:"hidden", boxShadow:"0 2px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ padding:"32px", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px", marginBottom:"12px" }}>
                <div>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"26px", color:"#0D1B2A", margin:"0 0 4px", fontWeight:400 }}>{variety.name}</h3>
                  <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"13px", margin:0 }}>📍 {variety.origin}</p>
                </div>
                <span style={{ background:"rgba(196,147,10,0.1)", color:"#C4930A", fontSize:"11px", fontWeight:700, padding:"6px 14px", borderRadius:"10px", border:"1px solid rgba(196,147,10,0.2)", whiteSpace:"nowrap" }}>{variety.grade}</span>
              </div>
              <p style={{ color:"rgba(13,27,42,0.6)", fontSize:"14px", lineHeight:1.75, margin:0 }}>{variety.description}</p>
            </div>

            <div style={{ padding:"32px" }}>
              <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:"#0D1B2A", marginBottom:"16px", fontWeight:400 }}>Technical Specifications</h4>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"28px" }}>
                {variety.specs.map(spec => (
                  <div key={spec.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#F5F0E8", borderRadius:"12px" }}>
                    <span style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px" }}>{spec.label}</span>
                    <span style={{ fontFamily:"monospace", color:"#0D1B2A", fontWeight:600, fontSize:"13px" }}>{spec.value}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#F5F0E8", borderRadius:"12px" }}>
                  <span style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px" }}>Moisture</span>
                  <span style={{ fontFamily:"monospace", color:"#0D1B2A", fontWeight:600, fontSize:"13px" }}>{variety.moisture}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#F5F0E8", borderRadius:"12px" }}>
                  <span style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px" }}>Colour</span>
                  <span style={{ fontFamily:"monospace", color:"#0D1B2A", fontWeight:600, fontSize:"13px" }}>{variety.color}</span>
                </div>
              </div>

              <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:"#0D1B2A", marginBottom:"12px", fontWeight:400 }}>Packing Options</h4>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"28px" }}>
                {variety.packing.map(p => (
                  <span key={p} style={{ background:"rgba(13,27,42,0.05)", color:"#0D1B2A", fontSize:"13px", border:"1px solid rgba(13,27,42,0.1)", borderRadius:"10px", padding:"8px 16px" }}>📦 {p}</span>
                ))}
              </div>

              <div style={{ background:"rgba(196,147,10,0.06)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"16px", padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
                <div>
                  <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600, margin:"0 0 4px" }}>Minimum Order Quantity</p>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"26px", color:"#0D1B2A", margin:0, fontWeight:400 }}>{variety.minOrder}</p>
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <Link href="mailto:info@silasya.com" style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontSize:"14px" }}>
                    Get Quote <ArrowRight size={14} />
                  </Link>
                  <a href="mailto:info@silasya.com" style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#0D1B2A", color:"white", fontWeight:600, padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontSize:"14px" }}>
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div style={{ background:"#0D1B2A", padding:"64px 48px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"26px", color:"white", marginBottom:"28px", fontWeight:400 }}>Other Products</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
            {products.filter(p => p.id !== product.id).slice(0,4).map(p => (
              <Link key={p.id} href={`/products/${p.id}`} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", padding:"20px", textDecoration:"none", display:"block" }}>
                <span style={{ fontSize:"32px", display:"block", marginBottom:"12px" }}>{p.emoji}</span>
                <p style={{ color:"white", fontWeight:600, fontSize:"14px", margin:"0 0 4px" }}>{p.name}</p>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", margin:0 }}>{p.varieties.length} varieties</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";

const ink = "#0D1B2A";
const gold = "#C4930A";
const goldLight = "#E8A020";
const cream = "#F5F0E8";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeVariety, setActiveVariety] = useState(0);
  const [activeImg, setActiveImg] = useState<number>(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const staticP = staticProducts.find(p => p.id === id);
    if (staticP) { setProduct(staticP); return; }
    fetch("/api/products")
      .then(r => r.json())
      .then(d => {
        const dbP = (d.data || []).find((p: any) => p.id === id);
        if (dbP) {
          setProduct({
            id: dbP.id, name: dbP.name, emoji: dbP.emoji || "🌿",
            category: dbP.category, tagline: dbP.tagline || "",
            description: dbP.description || "", heroColor: dbP.hero_color || gold,
            hero_image: dbP.hero_image || "", certifications: [],
            varieties: (dbP.varieties || []).map((v: any) => ({ ...v, minOrder: v.min_order })),
          });
        } else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px" }}>
      <p style={{ fontSize:"64px" }}>🔍</p>
      <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink }}>Product Not Found</h1>
      <Link href="/products" style={{ color:gold, textDecoration:"none", fontWeight:600 }}>← Back to Products</Link>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"15px" }}>Loading product...</p>
    </div>
  );

  const variety = product.varieties?.[activeVariety];
  const imgs = variety ? [
    ...(variety.image ? [variety.image] : []),
    ...(variety.images ? (typeof variety.images === "string" ? JSON.parse(variety.images || "[]") : variety.images) : [])
  ].filter(Boolean) : [];

  const specs = variety ? [
    { label:"Origin", value: variety.origin, icon:"📍" },
    { label:"Grade", value: variety.grade, icon:"🏅" },
    { label:"Min. Order", value: variety.minOrder || variety.min_order, icon:"📦" },
    { label:"Moisture", value: variety.moisture, icon:"💧" },
    { label:"Packing", value: variety.packing, icon:"🗃️" },
  ].filter(s => s.value) : [];

  return (
    <div style={{ minHeight:"100vh", background:cream, paddingTop:"70px" }}>

      {/* Breadcrumb */}
      <div style={{ background:"white", borderBottom:"1px solid rgba(13,27,42,0.06)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"14px 48px", display:"flex", alignItems:"center", gap:"8px", fontSize:"13px" }}>
          <Link href="/" style={{ color:"rgba(13,27,42,0.4)", textDecoration:"none" }}>Home</Link>
          <span style={{ color:"rgba(13,27,42,0.25)" }}>/</span>
          <Link href="/products" style={{ color:"rgba(13,27,42,0.4)", textDecoration:"none" }}>Products</Link>
          <span style={{ color:"rgba(13,27,42,0.25)" }}>/</span>
          <span style={{ color:ink, fontWeight:600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"32px 48px 80px" }}>

        {/* Product Header */}
        <div style={{ background:"white", borderRadius:"24px", padding:"40px", border:"1px solid rgba(13,27,42,0.07)", marginBottom:"24px", display:"grid", gridTemplateColumns:"1fr auto", gap:"40px", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px", flexWrap:"wrap" as const }}>
              <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:gold, background:"rgba(196,147,10,0.1)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"50px", padding:"4px 14px" }}>
                {product.category}
              </span>
              {product.certifications?.map((c: string) => (
                <span key={c} style={{ fontSize:"11px", fontWeight:600, color:"rgba(13,27,42,0.5)", background:"rgba(13,27,42,0.05)", borderRadius:"50px", padding:"4px 12px" }}>{c}</span>
              ))}
            </div>
            <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(30px,4vw,50px)", color:ink, margin:"0 0 12px", lineHeight:1.1, fontWeight:400 }}>
              {product.emoji} {product.name}
            </h1>
            <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"16px", lineHeight:1.8, margin:"0 0 28px", maxWidth:"520px" }}>
              {product.description || product.tagline}
            </p>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" as const }}>
              <button onClick={() => setQuoteOpen(true)}
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"13px 26px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", boxShadow:"0 6px 20px rgba(196,147,10,0.3)" }}>
                Get Quote <ArrowRight size={15} />
              </button>
              <Link href="/products"
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:ink, fontWeight:600, padding:"13px 22px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(13,27,42,0.15)" }}>
                <ArrowLeft size={15} /> All Products
              </Link>
            </div>
          </div>
          {product.hero_image ? (
            <div style={{ width:"200px", height:"200px", borderRadius:"20px", overflow:"hidden", flexShrink:0, border:"1px solid rgba(13,27,42,0.08)" }}>
              <img src={product.hero_image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
          ) : (
            <div style={{ width:"160px", height:"160px", borderRadius:"20px", background:cream, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"72px" }}>
              {product.emoji}
            </div>
          )}
        </div>

        {/* Varieties */}
        {product.varieties?.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:"20px", alignItems:"start" }}>

            {/* Sidebar */}
            <div style={{ background:"white", borderRadius:"20px", padding:"18px", border:"1px solid rgba(13,27,42,0.07)", position:"sticky", top:"90px" }}>
              <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 10px" }}>
                {product.varieties.length} {product.varieties.length === 1 ? "Variety" : "Varieties"}
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                {product.varieties.map((v: any, i: number) => (
                  <button key={v.id} onClick={() => { setActiveVariety(i); setActiveImg(0); }}
                    style={{ textAlign:"left", padding:"10px 12px", borderRadius:"10px", border:"none", background: activeVariety === i ? "rgba(196,147,10,0.08)" : "transparent", color: activeVariety === i ? gold : "rgba(13,27,42,0.6)", fontWeight: activeVariety === i ? 700 : 500, fontSize:"13px", cursor:"pointer", transition:"all 0.15s", borderLeft: activeVariety === i ? `3px solid ${gold}` : "3px solid transparent", paddingLeft: activeVariety === i ? "12px" : "12px" }}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            {variety && (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

                {/* Image gallery */}
                {imgs.length > 0 && (
                  <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", overflow:"hidden" }}>
                    <div style={{ background:"#fafaf8", display:"flex", alignItems:"center", justifyContent:"center", padding:"28px", minHeight:"320px" }}>
                      <img src={imgs[activeImg] || imgs[0]} alt={variety.name}
                        style={{ maxWidth:"100%", maxHeight:"420px", width:"auto", height:"auto", objectFit:"contain", display:"block", borderRadius:"6px" }} />
                    </div>
                    {imgs.length > 1 && (
                      <div style={{ display:"flex", gap:"8px", padding:"14px 20px", borderTop:"1px solid rgba(13,27,42,0.06)", overflowX:"auto" as const }}>
                        {imgs.map((img: string, i: number) => (
                          <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                            style={{ width:"58px", height:"58px", objectFit:"cover", borderRadius:"8px", cursor:"pointer", flexShrink:0, border: activeImg === i ? `2px solid ${gold}` : "2px solid rgba(13,27,42,0.08)", opacity: activeImg === i ? 1 : 0.5, transition:"all 0.15s" }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Specs */}
                <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", padding:"28px" }}>
                  <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"26px", color:ink, margin:"0 0 20px", fontWeight:400 }}>{variety.name}</h2>
                  {specs.length > 0 && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:"10px", marginBottom:"22px" }}>
                      {specs.map(s => (
                        <div key={s.label} style={{ background:cream, borderRadius:"12px", padding:"13px 15px", border:"1px solid rgba(13,27,42,0.05)" }}>
                          <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 4px" }}>{s.icon} {s.label}</p>
                          <p style={{ fontSize:"14px", fontWeight:600, color:ink, margin:0, lineHeight:1.4 }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {variety.description && (
                    <p style={{ color:"rgba(13,27,42,0.55)", lineHeight:1.9, fontSize:"15px", marginBottom:"22px", paddingBottom:"22px", borderBottom:"1px solid rgba(13,27,42,0.06)" }}>
                      {variety.description}
                    </p>
                  )}
                  <button onClick={() => setQuoteOpen(true)}
                    style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"13px 26px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", boxShadow:"0 4px 16px rgba(196,147,10,0.25)" }}>
                    Request Quote for {variety.name} <ArrowRight size={15} />
                  </button>
                </div>

                {/* Video */}
                {variety.video && (
                  <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", padding:"24px" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 14px" }}>Product Video</p>
                    <div style={{ borderRadius:"12px", overflow:"hidden", background:"#111", maxWidth:"540px" }}>
                      <video controls style={{ width:"100%", maxHeight:"305px", display:"block" }}>
                        <source src={variety.video} />
                      </video>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(!product.varieties || product.varieties.length === 0) && (
          <div style={{ background:"white", borderRadius:"20px", padding:"56px 48px", textAlign:"center", border:"1px solid rgba(13,27,42,0.07)" }}>
            <p style={{ fontSize:"48px", marginBottom:"16px" }}>📦</p>
            <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:ink, margin:"0 0 8px", fontWeight:400 }}>Variety details coming soon</h3>
            <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"15px", marginBottom:"24px" }}>Contact us for specifications and pricing.</p>
            <button onClick={() => setQuoteOpen(true)}
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:ink, color:"white", fontWeight:600, padding:"13px 26px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px" }}>
              Get in Touch <ArrowRight size={14} />
            </button>
          </div>
        )}

        <div style={{ marginTop:"28px" }}>
          <Link href="/products" style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"rgba(13,27,42,0.45)", textDecoration:"none", fontWeight:600, fontSize:"13px" }}>
            <ArrowLeft size={14} /> Back to All Products
          </Link>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} preselectedProduct={product.name} />
    </div>
  );
}

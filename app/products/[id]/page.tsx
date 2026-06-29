"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";
import { useIsMobile } from "@/hooks/useIsMobile";

const ink = "#0D1B2A";
const gold = "#C4930A";
const goldLight = "#E8A020";
const cream = "#F5F0E8";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const isMobile = useIsMobile();
  const [product, setProduct] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeVariety, setActiveVariety] = useState(0);
  const [activeImg, setActiveImg] = useState<number>(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const staticP = staticProducts.find(p => p.id === id);
    fetch("/api/products").then(r=>r.json()).then(d=>{
      const dbP = (d.data||[]).find((p:any)=>p.id===id);
      if (dbP) {
        // Merge: use DB varieties (which have latest images/videos) over static
        const dbVarieties = (dbP.varieties||[]).map((v:any)=>({...v, minOrder:v.min_order}));
        if (staticP) {
          // Merge DB variety data (images/videos) into static varieties
          const mergedVarieties = staticP.varieties.map((sv:any) => {
            const dbV = dbVarieties.find((dv:any) => dv.id === sv.id);
            return dbV ? { ...sv, ...dbV } : sv;
          });
          // Add any new varieties from DB not in static
          const newVarieties = dbVarieties.filter((dv:any) => !staticP.varieties.find((sv:any) => sv.id === dv.id));
          setProduct({ ...staticP, varieties: [...mergedVarieties, ...newVarieties] });
        } else {
          setProduct({ id:dbP.id, name:dbP.name, emoji:dbP.emoji||"🌿", category:dbP.category, tagline:dbP.tagline||"", description:dbP.description||"", heroColor:dbP.hero_color||gold, hero_image:dbP.hero_image||"", certifications:[], varieties:dbVarieties });
        }
      } else if (staticP) {
        setProduct(staticP);
      } else {
        setNotFound(true);
      }
    }).catch(()=>{
      if (staticP) setProduct(staticP);
      else setNotFound(true);
    });
  }, [id]);

  if (notFound) return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px", padding:"20px" }}>
      <p style={{ fontSize:"64px" }}>🔍</p>
      <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink }}>Product Not Found</h1>
      <Link href="/products" style={{ color:gold, textDecoration:"none", fontWeight:600 }}>Back to Products</Link>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"15px" }}>Loading product...</p>
    </div>
  );

  const variety = product.varieties?.[activeVariety];
  const imgs = variety ? [...(variety.image?[variety.image]:[]),...(variety.images?(typeof variety.images==="string"?JSON.parse(variety.images||"[]"):variety.images):[])].filter(Boolean) : [];
  const specs = variety ? [{ label:"Origin", value:variety.origin, icon:"📍" },{ label:"Grade", value:variety.grade, icon:"🏅" },{ label:"Min. Order", value:variety.minOrder||variety.min_order, icon:"📦" },{ label:"Moisture", value:variety.moisture, icon:"💧" },{ label:"Packing", value:variety.packing, icon:"🗃️" }].filter(s=>s.value) : [];

  return (
    <div style={{ minHeight:"100vh", background:cream, paddingTop:"70px" }}>

      <div style={{ background:"white", borderBottom:"1px solid rgba(13,27,42,0.06)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "12px 16px" : "14px 48px", display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", overflowX:"auto", whiteSpace:"nowrap" }}>
          <Link href="/" style={{ color:"rgba(13,27,42,0.4)", textDecoration:"none" }}>Home</Link>
          <span style={{ color:"rgba(13,27,42,0.25)" }}>/</span>
          <Link href="/products" style={{ color:"rgba(13,27,42,0.4)", textDecoration:"none" }}>Products</Link>
          <span style={{ color:"rgba(13,27,42,0.25)" }}>/</span>
          <span style={{ color:ink, fontWeight:600 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "16px 16px 60px" : "32px 48px 80px" }}>

        <div style={{ background:"white", borderRadius:"20px", padding: isMobile ? "20px" : "40px", border:"1px solid rgba(13,27,42,0.07)", marginBottom:"20px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: isMobile ? "20px" : "40px", alignItems:"center" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:gold, background:"rgba(196,147,10,0.1)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"50px", padding:"4px 14px" }}>{product.category}</span>
              </div>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,4vw,50px)", color:ink, margin:"0 0 10px", lineHeight:1.1, fontWeight:400 }}>
                {product.emoji} {product.name}
              </h1>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize: isMobile ? "14px" : "16px", lineHeight:1.8, margin:"0 0 20px" }}>{product.description||product.tagline}</p>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                <button onClick={()=>setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"12px 22px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", boxShadow:"0 6px 20px rgba(196,147,10,0.3)" }}>Get Quote <ArrowRight size={15} /></button>
                <Link href="/products" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:ink, fontWeight:600, padding:"12px 18px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(13,27,42,0.15)" }}><ArrowLeft size={15} /> All Products</Link>
              </div>
            </div>
            {product.hero_image ? (
              <div style={{ width: isMobile ? "100%" : "180px", height: isMobile ? "200px" : "180px", borderRadius:"16px", overflow:"hidden", border:"1px solid rgba(13,27,42,0.08)", flexShrink:0 }}>
                <img src={product.hero_image} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            ) : (
              <div style={{ width: isMobile ? "80px" : "140px", height: isMobile ? "80px" : "140px", borderRadius:"16px", background:cream, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize: isMobile ? "48px" : "64px" }}>{product.emoji}</div>
            )}
          </div>
        </div>

        {product.varieties?.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap:"16px", alignItems:"start" }}>

            <div style={{ background:"white", borderRadius:"18px", padding:"16px", border:"1px solid rgba(13,27,42,0.07)" }}>
              <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 10px" }}>
                {product.varieties.length} {product.varieties.length===1?"Variety":"Varieties"}
              </p>
              <div style={{ display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined, flexDirection: isMobile ? undefined : "column" as const, gap:"4px" }}>
                {product.varieties.map((v:any,i:number)=>(
                  <button key={v.id} onClick={()=>{ setActiveVariety(i); setActiveImg(0); }}
                    style={{ textAlign:"left", padding:"9px 12px", borderRadius:"10px", border:"none", background: activeVariety===i ? "rgba(196,147,10,0.08)" : "transparent", color: activeVariety===i ? gold : "rgba(13,27,42,0.6)", fontWeight: activeVariety===i ? 700 : 500, fontSize: isMobile ? "12px" : "13px", cursor:"pointer", borderLeft: isMobile ? "none" : activeVariety===i ? `3px solid ${gold}` : "3px solid transparent" }}>
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {variety && (
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {imgs.length > 0 && (
                  <div style={{ background:"white", borderRadius:"18px", border:"1px solid rgba(13,27,42,0.07)", overflow:"hidden" }}>
                    <div style={{ background:"#fafaf8", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", minHeight: isMobile ? "220px" : "300px" }}>
                      <img src={imgs[activeImg]||imgs[0]} alt={variety.name} style={{ maxWidth:"100%", maxHeight: isMobile ? "220px" : "380px", width:"auto", height:"auto", objectFit:"contain", borderRadius:"6px" }} />
                    </div>
                    {imgs.length > 1 && (
                      <div style={{ display:"flex", gap:"8px", padding:"12px 16px", borderTop:"1px solid rgba(13,27,42,0.06)", overflowX:"auto" }}>
                        {imgs.map((img:string,i:number)=>(
                          <img key={i} src={img} alt="" onClick={()=>setActiveImg(i)} style={{ width:"52px", height:"52px", objectFit:"cover", borderRadius:"8px", cursor:"pointer", flexShrink:0, border: activeImg===i ? `2px solid ${gold}` : "2px solid rgba(13,27,42,0.08)", opacity: activeImg===i ? 1 : 0.5 }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ background:"white", borderRadius:"18px", border:"1px solid rgba(13,27,42,0.07)", padding: isMobile ? "20px" : "28px" }}>
                  <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "20px" : "26px", color:ink, margin:"0 0 16px", fontWeight:400 }}>{variety.name}</h2>
                  {specs.length > 0 && (
                    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(140px,1fr))", gap:"10px", marginBottom:"18px" }}>
                      {specs.map(s=>(
                        <div key={s.label} style={{ background:cream, borderRadius:"10px", padding:"11px 13px", border:"1px solid rgba(13,27,42,0.05)" }}>
                          <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 3px" }}>{s.icon} {s.label}</p>
                          <p style={{ fontSize: isMobile ? "12px" : "14px", fontWeight:600, color:ink, margin:0, lineHeight:1.4 }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {variety.description && (
                    <p style={{ color:"rgba(13,27,42,0.55)", lineHeight:1.9, fontSize: isMobile ? "13px" : "15px", marginBottom:"18px", paddingBottom:"18px", borderBottom:"1px solid rgba(13,27,42,0.06)" }}>{variety.description}</p>
                  )}
                  <button onClick={()=>setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"12px 22px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", boxShadow:"0 4px 16px rgba(196,147,10,0.25)" }}>
                    Request Quote for {variety.name} <ArrowRight size={15} />
                  </button>
                </div>

                {variety.video && (
                  <div style={{ background:"white", borderRadius:"18px", border:"1px solid rgba(13,27,42,0.07)", padding: isMobile ? "16px" : "24px" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 12px" }}>Product Video</p>
                    <div style={{ borderRadius:"12px", overflow:"hidden", background:"#111" }}>
                      <video controls style={{ width:"100%", maxHeight:"300px", display:"block" }}>
                        <source src={variety.video} />
                      </video>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(!product.varieties||product.varieties.length===0) && (
          <div style={{ background:"white", borderRadius:"18px", padding: isMobile ? "40px 20px" : "56px 48px", textAlign:"center", border:"1px solid rgba(13,27,42,0.07)" }}>
            <p style={{ fontSize:"48px", marginBottom:"16px" }}>📦</p>
            <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:ink, margin:"0 0 8px", fontWeight:400 }}>Variety details coming soon</h3>
            <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"15px", marginBottom:"24px" }}>Contact us for specifications and pricing.</p>
            <button onClick={()=>setQuoteOpen(true)} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:ink, color:"white", fontWeight:600, padding:"13px 26px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px" }}>Get in Touch <ArrowRight size={14} /></button>
          </div>
        )}

        <div style={{ marginTop:"24px" }}>
          <Link href="/products" style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"rgba(13,27,42,0.45)", textDecoration:"none", fontWeight:600, fontSize:"13px" }}><ArrowLeft size={14} /> Back to All Products</Link>
        </div>
      </div>

      <QuoteModal isOpen={quoteOpen} onClose={()=>setQuoteOpen(false)} preselectedProduct={product.name} />
    </div>
  );
}

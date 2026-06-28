"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { products as staticProducts } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";

const productPhotos: Record<string, { img: string; spec: string; origin: string; color: string }> = {
  "turmeric":           { img:"https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80", spec:"Curcumin 3–5%", origin:"Erode & Salem, TN", color:"#C4930A" },
  "red-chilli":         { img:"https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800&q=80", spec:"ASTA 60–200+", origin:"Guntur & Byadagi, AP", color:"#C0392B" },
  "black-pepper":       { img:"https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80", spec:"Bold 5–8mm · ETO-free", origin:"Malabar & Tellicherry, KL", color:"#2C2C2C" },
  "cumin":              { img:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", spec:"Singapore Grade · Bold", origin:"Unjha, Gujarat", color:"#8B6914" },
  "coriander":          { img:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&q=80", spec:"Eagle & Scooter Grade", origin:"Rajasthan & MP", color:"#4A7C3F" },
  "cardamom":           { img:"https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80", spec:"7–8mm Bold · AGEB Grade", origin:"Idukki, Kerala", color:"#1A6B3A" },
  "whole-spices-blends":{ img:"https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80", spec:"Custom Export Blends", origin:"Pan-India", color:"#7B3F00" },
  "coffee":             { img:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", spec:"Arabica AA / Robusta PB", origin:"Chikmagalur & Wayanad", color:"#3E1C00" },
  "rice":               { img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", spec:"8mm+ Grain · 18mo Aged", origin:"Punjab & Haryana", color:"#C4930A" },
  "pulses-grains":      { img:"https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&q=80", spec:"AGMARK Certified", origin:"MP & Rajasthan", color:"#8B4513" },
  "groundnuts":         { img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80", spec:"Java HPS Bold · Aflatoxin tested", origin:"Gujarat & Andhra", color:"#B8860B" },
  "sesame-oilseeds":    { img:"https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80", spec:"99/1 Purity · Natural White", origin:"Gujarat & Rajasthan", color:"#DAA520" },
  "himalayan-salt":     { img:"https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=800&q=80", spec:"Food & Spa Grade", origin:"Himalayas, Pakistan", color:"#E8748A" },
  "dry-fruits-nuts":    { img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", spec:"W320/W240 Cashew · Makhana", origin:"Kerala & Bihar", color:"#8B6914" },
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<"all"|"spices"|"commodities">("all");
  const [hoveredId, setHoveredId] = useState<string|null>(null);
  const [quoteModal, setQuoteModal] = useState<{open:boolean;productId:string}>({open:false, productId:""});
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => { if (d.data) setDbProducts(d.data); })
      .catch(() => {});
  }, []);

  const products = useMemo(() => [...staticProducts, ...dbProducts.map((p: any) => ({
      id: p.id, name: p.name, emoji: p.emoji || "🌿",
      category: p.category as "spices"|"commodities",
      tagline: p.tagline || "", description: p.description || "",
      heroColor: p.hero_color || "#C4930A", certifications: [],
      varieties: (p.varieties||[]).map((v:any) => ({ id:v.id, name:v.name, origin:v.origin||"", grade:v.grade||"", minOrder:v.min_order||"", description:v.description||"" })),
  }))], [dbProducts]);


  const filtered = products.filter(p => {
    const matchCat = cat === "all" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.varieties.some(v => v.name.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });



  return (
    <div style={{ minHeight:"100vh", background:"#F5F0E8", paddingTop:"70px" }}>

      {/* PAGE HEADER — cream, minimal */}
      <div style={{ background:"#F5F0E8", borderBottom:"1px solid rgba(13,27,42,0.08)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"48px 48px 32px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"32px", flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <span style={{ width:"28px", height:"2px", background:"#C4930A", display:"inline-block" }} />
                <span style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>Export Catalogue</span>
              </div>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(32px,4vw,52px)", color:"#0D1B2A", margin:"0 0 12px", lineHeight:1.1, fontWeight:400 }}>
                Spices & <em style={{ color:"#C4930A" }}>Commodities</em>
              </h1>
              <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"15px", margin:0 }}>
                100+ products · 29 states · 50+ countries · FSSAI · APEDA · Spices Board · ISO 9001:2015
              </p>
            </div>
            {/* Category pills */}
            <div style={{ display:"flex", gap:"8px" }}>
              {([["all","All Products", "100+"], ["spices","Spices", "50+"], ["commodities","Commodities", "50+"]] as [string, string, string][]).map(([val, label, count]) => (
                <button key={val} onClick={() => setCat(val)}
                  style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"10px 20px", borderRadius:"50px", fontSize:"13px", fontWeight:600, cursor:"pointer", transition:"all 0.2s", border: cat === val ? "2px solid #0D1B2A" : "1px solid rgba(13,27,42,0.15)", background: cat === val ? "#0D1B2A" : "white", color: cat === val ? "white" : "rgba(13,27,42,0.6)" }}>
                  {label}
                  <span style={{ fontSize:"10px", background: cat === val ? "rgba(255,255,255,0.15)" : "rgba(13,27,42,0.07)", borderRadius:"50px", padding:"1px 7px", fontWeight:700 }}>{count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 48px 24px" }}>
          <div style={{ position:"relative", maxWidth:"480px" }}>
            <Search size={15} style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", color:"rgba(13,27,42,0.3)" }} />
            <input type="text" placeholder="Search by product, variety or origin..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", paddingLeft:"44px", paddingRight:"16px", paddingTop:"12px", paddingBottom:"12px", background:"white", border:"1px solid rgba(13,27,42,0.12)", borderRadius:"14px", fontSize:"14px", color:"#0D1B2A", outline:"none", boxSizing:"border-box", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.3)", fontSize:"18px", lineHeight:1 }}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"40px 48px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"100px 0" }}>
            <p style={{ fontSize:"56px", marginBottom:"16px" }}>🔍</p>
            <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"20px" }}>No products match "{search}"</p>
            <button onClick={() => setSearch("")} style={{ marginTop:"16px", background:"#0D1B2A", color:"white", border:"none", padding:"12px 24px", borderRadius:"12px", cursor:"pointer", fontSize:"14px" }}>Clear search</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px" }}>
            {filtered.map(product => {
              const dbP = dbProducts.find((p:any) => p.id === product.id);
                  const photo = productPhotos[product.id] || { img: dbP?.hero_image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", spec: product.tagline || "", origin: product.description || "", color: product.heroColor || "#C4930A" };
              const isHovered = hoveredId === product.id;
              return (
                <div key={product.id}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ background:"white", borderRadius:"20px", overflow:"hidden", boxShadow: isHovered ? "0 20px 56px rgba(13,27,42,0.16)" : "0 2px 12px rgba(13,27,42,0.06)", transform: isHovered ? "translateY(-6px)" : "translateY(0)", transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)", border:"1px solid rgba(13,27,42,0.06)", display:"flex", flexDirection:"column" }}>

                  {/* Image */}
                  <Link href={`/products/${product.id}`} style={{ textDecoration:"none", display:"block" }}>
                  <div style={{ position:"relative", height:"200px", overflow:"hidden", flexShrink:0, cursor:"pointer" }}>
                    <img src={photo?.img} alt={product.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", transform: isHovered ? "scale(1.07)" : "scale(1)", transition:"transform 0.5s ease" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(13,27,42,0.8) 0%, rgba(13,27,42,0.1) 50%, transparent 100%)" }} />

                    {/* Category badge */}
                    <div style={{ position:"absolute", top:"12px", left:"12px", background: product.category === "spices" ? "rgba(192,57,43,0.85)" : "rgba(26,77,46,0.85)", backdropFilter:"blur(8px)", borderRadius:"6px", padding:"3px 10px" }}>
                      <span style={{ color:"white", fontSize:"9px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>{product.category}</span>
                    </div>

                    {/* Emoji */}
                    <span style={{ position:"absolute", top:"10px", right:"12px", fontSize:"26px", filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>{product.emoji}</span>

                    {/* Bottom info */}
                    <div style={{ position:"absolute", bottom:"12px", left:"12px", right:"12px" }}>
                      <p style={{ fontFamily:"DM Serif Display,Georgia,serif", color:"white", fontSize:"20px", margin:"0 0 4px", fontWeight:400 }}>{product.name}</p>
                      <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.6)", display:"flex", alignItems:"center", gap:"4px" }}>
                        📍 {photo?.origin}
                      </span>
                    </div>
                  </div>
                  </Link>

                  {/* Content */}
                  <div style={{ padding:"16px", flex:1, display:"flex", flexDirection:"column" }}>
                    {/* Spec */}
                    <span style={{ display:"inline-block", fontSize:"11px", background:`${photo?.color}12`, border:`1px solid ${photo?.color}30`, color:photo?.color, borderRadius:"6px", padding:"3px 10px", fontWeight:700, marginBottom:"10px" }}>
                      {photo?.spec}
                    </span>

                    {/* Varieties */}
                    <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"14px", flex:1 }}>
                      {product.varieties.slice(0,3).map(v => (
                        <span key={v.id} style={{ fontSize:"10px", background:"#F5F0E8", border:"1px solid rgba(13,27,42,0.08)", color:"rgba(13,27,42,0.5)", borderRadius:"6px", padding:"2px 8px" }}>
                          {v.name.split(" ").slice(0,2).join(" ")}
                        </span>
                      ))}
                      {product.varieties.length > 3 && (
                        <span style={{ fontSize:"10px", color:"#C4930A", fontWeight:700, padding:"2px 0" }}>+{product.varieties.length - 3}</span>
                      )}
                    </div>

                    {/* CTA */}
                    <div style={{ display:"flex", gap:"6px" }}>
                      <Link href={`/products/${product.id}`}
                        style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"4px", background:"#0D1B2A", color:"white", fontWeight:600, padding:"10px 0", borderRadius:"10px", textDecoration:"none", fontSize:"11px", letterSpacing:"0.02em" }}>
                        View Specs <ArrowRight size={11} />
                      </Link>
                      <button type="button" onClick={() => setQuoteModal({open:true, productId:product.id})}
                        style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,${photo?.color || "#C4930A"},#E8A020)`, color:"white", fontWeight:700, padding:"10px 0", borderRadius:"10px", fontSize:"11px", border:"none", cursor:"pointer", letterSpacing:"0.02em" }}>
                        Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA strip */}
        <div style={{ marginTop:"64px", borderRadius:"24px", overflow:"hidden", position:"relative" }}>
          {/* Gold gradient background */}
          <div style={{ background:"linear-gradient(135deg,#92400e 0%,#C4930A 40%,#E8A020 70%,#C4930A 100%)", padding:"48px 56px", position:"relative" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"48px 48px" }} />
            <div style={{ position:"absolute", right:"-30px", top:"-30px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", left:"40%", bottom:"-40px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

            <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr auto", gap:"40px", alignItems:"center" }}>
              <div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.15)", borderRadius:"50px", padding:"5px 14px", marginBottom:"16px" }}>
                  <span style={{ width:"6px", height:"6px", background:"white", borderRadius:"50%", opacity:0.8 }} />
                  <span style={{ color:"white", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", opacity:0.9 }}>Have a Specific Requirement?</span>
                </div>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3vw,38px)", color:"white", margin:"0 0 12px", fontWeight:400, lineHeight:1.2, textShadow:"0 2px 12px rgba(0,0,0,0.1)" }}>
                  India produces thousands of agri products.<br />We can source almost any of them.
                </h3>
                <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"15px", margin:0, lineHeight:1.7 }}>
                  Tell us what you need — product, grade, quantity, destination. We'll come back with availability, pricing, and specs within 24 hours.
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", flexShrink:0 }}>
                <button onClick={() => setQuoteModal({open:true, productId:""})}
                  style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"white", color:"#92400e", fontWeight:700, padding:"14px 28px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", boxShadow:"0 8px 24px rgba(0,0,0,0.15)", whiteSpace:"nowrap" }}>
                  Send Your Requirement <ArrowRight size={15} />
                </button>
                <a href="https://wa.me/919164626957" target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"rgba(255,255,255,0.15)", color:"white", fontWeight:600, padding:"13px 28px", borderRadius:"12px", textDecoration:"none", fontSize:"14px", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal isOpen={quoteModal.open} onClose={() => setQuoteModal({open:false, productId:""})} preselectedProduct={products.find(p => p.id === quoteModal.productId)?.name || quoteModal.productId} />
    </div>
  );
}

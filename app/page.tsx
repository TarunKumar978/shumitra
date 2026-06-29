"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { products as staticProducts, stats, countries } from "@/lib/data";
import QuoteModal from "@/components/QuoteModal";
import { useIsMobile } from "@/hooks/useIsMobile";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => { n = Math.min(n + step, target); setCount(n); if (n >= target) clearInterval(t); }, 30);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function CtaForm({ isMobile }: { isMobile: boolean }) {
  const [form, setForm] = useState({ product:"", name:"", email:"", phone:"", country:"", quantity:"", unit:"MT", incoterm:"", spec:"", port:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputStyle = { width:"100%", padding:"12px 16px", border:"1.5px solid rgba(13,27,42,0.12)", borderRadius:"12px", background:"white", fontSize:"14px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const, fontFamily:"DM Sans, sans-serif" };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/quote", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ ...form, company:"", message:`Spec: ${form.spec} | Port: ${form.port} | Incoterm: ${form.incoterm}` }) });
      const data = await res.json();
      if (data.success) setDone(true); else setError("Something went wrong. Please WhatsApp us.");
    } catch { setError("Something went wrong. Please WhatsApp us."); } finally { setLoading(false); }
  };
  if (done) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"12px" }}>✅</div>
      <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", color:"#0D1B2A", marginBottom:"8px", fontWeight:400 }}>Inquiry Received!</h4>
      <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px", lineHeight:1.7, marginBottom:"16px" }}>We'll respond to <strong>{form.email}</strong> within 24 hours.</p>
      <a href="https://wa.me/917259829005" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#22c55e", color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"10px", textDecoration:"none", fontSize:"13px" }}>💬 WhatsApp for faster response</a>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"10px" }}>
        <input type="text" placeholder="Your Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} style={inputStyle} required />
        <input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} style={inputStyle} required />
      </div>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"10px" }}>
        <input type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} style={inputStyle} />
        <input type="text" placeholder="Country / Destination" value={form.country} onChange={e => setForm(f => ({ ...f, country:e.target.value }))} style={inputStyle} />
      </div>
      <input type="text" placeholder="Product Name (e.g. Turmeric, Basmati Rice...)" value={form.product} onChange={e => setForm(f => ({ ...f, product:e.target.value }))} style={inputStyle} required />
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap:"10px" }}>
        <input type="text" placeholder="Quantity" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity:e.target.value }))} style={inputStyle} />
        <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit:e.target.value }))} style={{ ...inputStyle, cursor:"pointer" }}>
          <option value="MT">MT</option><option value="KG">KG</option><option value="Container">Container</option><option value="Tons">Tons</option>
        </select>
        {!isMobile && <select value={form.incoterm} onChange={e => setForm(f => ({ ...f, incoterm:e.target.value }))} style={{ ...inputStyle, cursor:"pointer" }}><option value="">Incoterm</option><option value="FOB">FOB</option><option value="CIF">CIF</option><option value="DAP">DAP</option><option value="CIP">CIP</option></select>}
      </div>
      {!isMobile && <>
        <input type="text" placeholder="Grade / Specification (e.g. Curcumin 3-5%, ASTA 60+...)" value={form.spec} onChange={e => setForm(f => ({ ...f, spec:e.target.value }))} style={inputStyle} />
        <input type="text" placeholder="Destination Port (e.g. Jebel Ali, Rotterdam...)" value={form.port} onChange={e => setForm(f => ({ ...f, port:e.target.value }))} style={inputStyle} />
      </>}
      {error && <p style={{ color:"#dc2626", fontSize:"12px", margin:0 }}>⚠️ {error}</p>}
      <button type="submit" disabled={loading} style={{ width:"100%", background: loading ? "rgba(13,27,42,0.1)" : "linear-gradient(135deg,#C4930A,#E8A020)", color: loading ? "rgba(13,27,42,0.3)" : "white", fontWeight:700, padding:"14px", borderRadius:"12px", border:"none", cursor: loading ? "not-allowed" : "pointer", fontSize:"15px", boxShadow: loading ? "none" : "0 6px 20px rgba(196,147,10,0.35)", marginTop:"4px" }}>
        {loading ? "Sending..." : "Send Inquiry ✉️"}
      </button>
      <p style={{ textAlign:"center", color:"rgba(13,27,42,0.3)", fontSize:"11px", margin:0 }}>🔒 Private & secure · We respond within 24 hours</p>
    </form>
  );
}

function FeedbackSection() {
  const isMobile = useIsMobile();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name:"", company:"", country:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputStyle = { width:"100%", padding:"12px 16px", border:"1.5px solid rgba(13,27,42,0.1)", borderRadius:"12px", background:"white", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const, fontFamily:"DM Sans, sans-serif" };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (rating === 0) return; setLoading(true);
    try { await fetch("/api/feedback", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name:form.name, company:form.company, country:form.country, rating, message:form.message, approved:false }) }); } catch {}
    setSubmitted(true); setLoading(false);
  };
  const labels = ["","Poor","Fair","Good","Very Good","Excellent"];
  const colors = ["","#ef4444","#f97316","#eab308","#84cc16","#22c55e"];
  if (submitted) return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ fontSize:"56px", marginBottom:"16px" }}>🙏</div>
      <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"28px", color:"#0D1B2A", marginBottom:"10px", fontWeight:400 }}>Thank you, {form.name}!</h3>
      <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"15px", lineHeight:1.7 }}>Your feedback means the world to us.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"13px", marginBottom:"16px" }}>How would you rate your experience with Shumitra?</p>
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"10px" }}>
          {[1,2,3,4,5].map(star => (
            <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill={(hover || rating) >= star ? "#E8A020" : "none"} stroke={(hover || rating) >= star ? "#E8A020" : "rgba(13,27,42,0.25)"} strokeWidth="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
            </button>
          ))}
        </div>
        {(hover || rating) > 0 && <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:`${colors[hover || rating]}15`, border:`1px solid ${colors[hover || rating]}30`, borderRadius:"50px", padding:"4px 14px" }}><span style={{ color:colors[hover || rating], fontSize:"13px", fontWeight:700 }}>{labels[hover || rating]}</span></div>}
      </div>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"10px", marginBottom:"10px" }}>
        <div><label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Your Name *</label><input type="text" placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} style={inputStyle} required /></div>
        <div><label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Company</label><input type="text" placeholder="Acme Trading Co." value={form.company} onChange={e => setForm(f => ({ ...f, company:e.target.value }))} style={inputStyle} /></div>
      </div>
      <div style={{ marginBottom:"10px" }}><label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Country</label><input type="text" placeholder="UAE, USA, UK..." value={form.country} onChange={e => setForm(f => ({ ...f, country:e.target.value }))} style={inputStyle} /></div>
      <div style={{ marginBottom:"20px" }}><label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"6px" }}>Your Feedback *</label><textarea placeholder="Tell us about your experience..." rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} required style={{ ...inputStyle, resize:"none" }} /></div>
      <button type="submit" disabled={rating === 0 || loading} style={{ width:"100%", background: rating > 0 ? "linear-gradient(135deg,#C4930A,#E8A020)" : "rgba(13,27,42,0.08)", color: rating > 0 ? "white" : "rgba(13,27,42,0.3)", fontWeight:700, padding:"14px", borderRadius:"12px", border:"none", cursor: rating > 0 ? "pointer" : "not-allowed", fontSize:"15px", transition:"all 0.2s" }}>
        {loading ? "Submitting..." : rating === 0 ? "Select a rating first ★" : "Submit Feedback"}
      </button>
    </form>
  );
}

const slides = [
  { bg:"linear-gradient(135deg,#1a0a00 0%,#7c2d00 30%,#c2570a 60%,#e8820a 100%)", accent:"#f59e0b", emoji:"🟡", label:"India's Golden Spice" },
  { bg:"linear-gradient(135deg,#1a0000 0%,#7f1d1d 30%,#b91c1c 60%,#ef4444 100%)", accent:"#f87171", emoji:"🌶️", label:"The Fire of India" },
  { bg:"linear-gradient(135deg,#0a0a0a 0%,#1c1917 30%,#44403c 60%,#78716c 100%)", accent:"#d6d3d1", emoji:"⚫", label:"King of Spices" },
  { bg:"linear-gradient(135deg,#0a0800 0%,#451a03 30%,#92400e 60%,#b45309 100%)", accent:"#fbbf24", emoji:"🟤", label:"Warm & Earthy Aroma" },
  { bg:"linear-gradient(135deg,#020d00 0%,#14532d 30%,#15803d 60%,#22c55e 100%)", accent:"#86efac", emoji:"🌾", label:"India's Premium Grain" },
  { bg:"linear-gradient(135deg,#001a0a 0%,#065f46 30%,#059669 60%,#34d399 100%)", accent:"#6ee7b7", emoji:"💚", label:"Queen of Spices" },
];

const productPhotos: Record<string, { img: string; spec: string; origin: string }> = {
  "turmeric":{ img:"https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80", spec:"Curcumin 3-5%", origin:"Erode & Salem" },
  "red-chilli":{ img:"https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=800&q=80", spec:"ASTA 60-200+", origin:"Guntur & Byadagi" },
  "black-pepper":{ img:"https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80", spec:"Bold 5-12mm", origin:"Malabar & Tellicherry" },
  "cumin":{ img:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", spec:"Singapore Grade", origin:"Unjha, Gujarat" },
  "coriander":{ img:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=800&q=80", spec:"Eagle & Scooter Grade", origin:"Rajasthan" },
  "cardamom":{ img:"https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80", spec:"7-8mm Bold AGEB", origin:"Idukki, Kerala" },
  "whole-spices-blends":{ img:"https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80", spec:"Custom Blends", origin:"Pan-India" },
  "coffee":{ img:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", spec:"Arabica AA / Robusta PB", origin:"Chikmagalur & Wayanad" },
  "rice":{ img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", spec:"8mm+ Grain 18mo Aged", origin:"Punjab & Haryana" },
  "pulses-grains":{ img:"https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=800&q=80", spec:"AGMARK Certified", origin:"MP & Rajasthan" },
  "groundnuts":{ img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80", spec:"Java HPS Bold", origin:"Gujarat & Andhra" },
  "sesame-oilseeds":{ img:"https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80", spec:"99/1 Purity Natural White", origin:"Gujarat & Rajasthan" },
  "himalayan-salt":{ img:"https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=800&q=80", spec:"Food & Spa Grade", origin:"Himalayas" },
  "dry-fruits-nuts":{ img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", spec:"W320/W240 Cashew", origin:"Kerala & Karnataka" },
};

export default function Home() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => { if (d.data) setDbProducts(d.data); setDbLoaded(true); }).catch(() => setDbLoaded(true));
  }, []);
  const products = [
    ...(!dbLoaded ? staticProducts : []),
    ...dbProducts.map((p: any) => ({ id:p.id, name:p.name, emoji:p.emoji||"🌿", category:p.category as "spices"|"commodities", tagline:p.tagline||"", description:p.description||"", heroColor:p.hero_color||"#C4930A", certifications:[], varieties:(p.varieties||[]).map((v:any) => ({ id:v.id, name:v.name, origin:v.origin||"", grade:v.grade||"", minOrder:v.min_order||"", description:v.description||"" })) }))
  ];
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState("");
  const [dbHeroSlides, setDbHeroSlides] = useState<any[]>([]);
  useEffect(() => { fetch("/api/hero-slides").then(r=>r.json()).then(d=>{ if(d.data?.length) setDbHeroSlides(d.data); }).catch(()=>{}); }, []);
  const goToSlide = (i: number) => { setSlide(i); setAnimKey(k => k+1); };
  const activeSlides = dbHeroSlides.length > 0 ? dbHeroSlides : slides;
  useEffect(() => { const t = setInterval(() => goToSlide((slide+1) % activeSlides.length), 5000); return () => clearInterval(t); }, [slide, activeSlides.length]);
  const cur = activeSlides[slide % activeSlides.length] || activeSlides[0];

  return (
    <>
      <section style={{ position:"relative", height:"100svh", minHeight:"600px", overflow:"hidden" }}>
        {cur.video_url ? (
          <video key={cur.video_url} autoPlay muted loop playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}><source src={cur.video_url} type="video/mp4" /></video>
        ) : cur.image_url ? (
          <img key={cur.image_url} src={cur.image_url} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
        ) : (
          <>
            <video autoPlay muted loop playsInline onError={e => { (e.currentTarget as HTMLVideoElement).style.display="none"; }} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }}><source src="/hero.mp4" type="video/mp4" /></video>
            <div style={{ position:"absolute", inset:0, background:cur.bg||"#0D1B2A", zIndex:-1 }} />
          </>
        )}
        <div style={{ position:"absolute", inset:0, zIndex:1, opacity:0.06, backgroundImage:"linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize:"80px 80px" }} />
        <div style={{ position:"absolute", inset:0, zIndex:3, background:"linear-gradient(to bottom,rgba(0,0,0,0.25) 0%,transparent 25%,transparent 65%,rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position:"absolute", inset:0, zIndex:3, background:"linear-gradient(to right,rgba(0,0,0,0.5) 0%,transparent 70%)" }} />

        <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:10, padding: isMobile ? "80px 20px 0" : "96px 64px 0" }}>
          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", border:"1px solid rgba(196,147,10,0.45)", borderRadius:"50px", padding:"7px 18px", background:"rgba(0,0,0,0.35)", backdropFilter:"blur(12px)" }}>
              <span style={{ width:"6px", height:"6px", background:"#C4930A", borderRadius:"50%", animation:"pulse 1.5s ease-in-out infinite" }} />
              <span style={{ color:"#E8A020", fontSize: isMobile ? "9px" : "10px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>{isMobile ? "FSSAI · APEDA · ISO 9001:2015" : "FSSAI · APEDA · Spices Board · ISO 9001:2015"}</span>
            </div>
            <div key={`label-${animKey}`} style={{ display:"inline-flex", background:`${cur.accent||cur.accent_color||"#C4930A"}25`, border:`1px solid ${cur.accent||cur.accent_color||"#C4930A"}50`, borderRadius:"50px", padding:"5px 14px", animation:"fadeSlideIn 0.6s ease" }}>
              <span style={{ color:cur.accent||cur.accent_color||"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>{cur.label}</span>
            </div>
          </div>
          <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", color:"white", lineHeight:1.05, margin:"0 0 16px", fontSize: isMobile ? "clamp(36px,10vw,52px)" : "clamp(44px,6vw,84px)", fontWeight:400, textShadow:"0 4px 40px rgba(0,0,0,0.7)", maxWidth: isMobile ? "100%" : "720px" }}>
            India's Finest<br /><span style={{ background:"linear-gradient(90deg,#F5C842,#E8A020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Spices &</span><br />Commodities
          </h1>
          <p style={{ color:"rgba(255,255,255,0.78)", fontSize: isMobile ? "13px" : "16px", lineHeight:1.7, marginBottom:"28px", maxWidth: isMobile ? "100%" : "480px", textShadow:"0 2px 16px rgba(0,0,0,0.5)" }}>
            <em style={{ color:"white", fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "15px" : "18px" }}>"Rooted in India. Made for the World."</em><br />Pan-India sourcing · 29 states · 100+ products · 50+ countries
          </p>
          {!isMobile && (
          <div style={{ display:"flex", flexDirection:"row", gap:"10px", flexWrap:"wrap" }}>
            <Link href="/products" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"linear-gradient(135deg,#E8A020,#C4930A)", color:"#0D1B2A", fontWeight:700, padding:"14px 28px", borderRadius:"14px", textDecoration:"none", fontSize:"15px", boxShadow:"0 8px 32px rgba(196,147,10,0.45)" }}>Explore Products <ArrowRight size={16} /></Link>
            <button type="button" onClick={() => { setQuoteProduct(""); setQuoteOpen(true); }} style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.35)", color:"white", fontWeight:600, padding:"14px 24px", borderRadius:"14px", fontSize:"15px", backdropFilter:"blur(12px)", cursor:"pointer" }}>Request a Quote</button>
            <a href="https://wa.me/917259829005" style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(37,211,102,0.12)", border:"1.5px solid rgba(37,211,102,0.4)", color:"#4ADE80", fontWeight:600, padding:"14px 20px", borderRadius:"14px", textDecoration:"none", fontSize:"15px", backdropFilter:"blur(12px)" }}>💬 WhatsApp</a>
          </div>
          )}
        </div>

        <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:10, padding: isMobile ? "0 16px 16px" : "0 64px 36px" }}>
          <div style={{ display:"flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent:"space-between", gap:"12px" }}>
            <div style={{ display:"flex", backdropFilter:"blur(14px)", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"16px", overflow:"hidden", overflowX:"auto", maxWidth: isMobile ? "calc(100vw - 32px)" : "none" }}>
              {stats.map((s, i) => (
                <div key={i} style={{ padding: isMobile ? "10px 14px" : "14px 24px", borderRight: i < stats.length-1 ? "1px solid rgba(255,255,255,0.07)" : "none", textAlign:"center", minWidth: isMobile ? "65px" : "90px", flexShrink:0 }}>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "16px" : "24px", fontWeight:700, color:"#E8A020", margin:"0 0 2px" }}><Counter target={parseInt(s.value)} suffix={s.value.includes("+") ? "+" : ""} /></p>
                  <p style={{ color:"rgba(255,255,255,0.38)", fontSize: isMobile ? "7px" : "8px", margin:0, letterSpacing:"0.08em", textTransform:"uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>
            {!isMobile && (
              <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                {activeSlides.map((s: any, i: number) => (
                  <button key={i} onClick={() => goToSlide(i)} style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"4px", background:"rgba(0,0,0,0.35)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"10px", padding:"8px 14px", cursor:"pointer", minWidth:"80px", transition:"all 0.3s", opacity: i === slide ? 1 : 0.55 }}>
                    <span style={{ color:"white", fontSize:"11px", fontWeight: i === slide ? 700 : 500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"90px" }}>{s.label||s.name}</span>
                    <div style={{ width:"100%", height:"2px", background:"rgba(255,255,255,0.2)", borderRadius:"2px", overflow:"hidden" }}><div style={{ height:"100%", background:"#C4930A", borderRadius:"2px", width: i === slide ? "100%" : "0%", transition: i === slide ? "width 5s linear" : "none" }} /></div>
                  </button>
                ))}
              </div>
            )}
            {isMobile && (
              <div style={{ display:"flex", gap:"6px" }}>
                {activeSlides.map((_: any, i: number) => (
                  <button key={i} onClick={() => goToSlide(i)} style={{ width: i === slide ? "20px" : "6px", height:"6px", borderRadius:"3px", background: i === slide ? "#C4930A" : "rgba(255,255,255,0.4)", border:"none", cursor:"pointer", transition:"all 0.3s", padding:0 }} />
                ))}
              </div>
            )}
          </div>
        </div>
        {!isMobile && <div style={{ position:"absolute", bottom:"140px", left:"50%", transform:"translateX(-50%)", zIndex:10, color:"rgba(255,255,255,0.18)", animation:"bounce 2s infinite" }}><ChevronDown size={22} /></div>}
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)}}@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes ping{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}`}</style>
      </section>

      <div style={{ background:"linear-gradient(90deg,#92400e,#C4930A,#E8A020,#C4930A,#92400e)", padding:"12px 0", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", whiteSpace:"nowrap", animation:"marquee 30s linear infinite" }}>
          {[...Array(4)].map((_,i) => ["FSSAI Certified","APEDA Registered","Spices Board Certified","ISO 9001:2015","IEC Licensed","50+ Countries","100+ Products","Pan-India Sourcing","FOB CIF DAP"].map(item => (
            <span key={`${i}-${item}`} style={{ color:"#1C0A00", fontWeight:700, fontSize:"11px", padding:"0 26px", display:"inline-flex", alignItems:"center" }}><span style={{ width:"3px", height:"3px", background:"rgba(28,10,0,0.3)", borderRadius:"50%", display:"inline-block", marginRight:"26px" }} />{item}</span>
          )))}
        </div>
        <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-25%)}}`}</style>
      </div>

      <section style={{ padding:"48px 0 64px", background:"#F5F0E8" }}>
        <div style={{ maxWidth:"1400px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 32px" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>What We Export</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(28px,4vw,48px)", color:"#0D1B2A", margin:"0 0 10px" }}>Our Product Range</h2>
            <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"14px", margin:0 }}>100+ products across 6 categories - sourced from origin, exported with precision</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? "12px" : "20px" }}>
            {products.map(product => {
              const dbP = dbProducts.find((p:any) => p.id === product.id);
              const photo = productPhotos[product.id] || { img: dbP?.hero_image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80", spec: product.tagline||"", origin: dbP?.description||"" };
              return (
                <div key={product.id} style={{ background:"white", borderRadius: isMobile ? "14px" : "20px", overflow:"hidden", border:"1px solid rgba(13,27,42,0.08)", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column" }}>
                  <div style={{ position:"relative", height: isMobile ? "110px" : "160px", overflow:"hidden", flexShrink:0 }}>
                    <Link href={`/products/${product.id}`} style={{ display:"block", width:"100%", height:"100%", cursor:"pointer" }}>
                      <img src={photo?.img} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    </Link>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(13,27,42,0.7) 0%,transparent 50%)", pointerEvents:"none" }} />
                    <span style={{ position:"absolute", bottom:"8px", left:"8px", fontSize: isMobile ? "9px" : "11px", color:"white", fontWeight:600, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)", padding: isMobile ? "2px 6px" : "3px 10px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.15)", pointerEvents:"none", maxWidth:"90%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>📍 {photo?.origin}</span>
                  </div>
                  <div style={{ padding: isMobile ? "10px" : "16px", flex:1, display:"flex", flexDirection:"column" }}>
                    <div style={{ marginBottom: isMobile ? "6px" : "10px" }}>
                      <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "13px" : "17px", color:"#0D1B2A", margin:"0 0 4px", fontWeight:400, lineHeight:1.2 }}>{product.name}</p>
                      <span style={{ fontSize: isMobile ? "9px" : "10px", background:"rgba(196,147,10,0.1)", border:"1px solid rgba(196,147,10,0.25)", color:"#C4930A", borderRadius:"6px", padding:"2px 6px", fontWeight:600, display:"inline-block" }}>{photo?.spec}</span>
                    </div>
                    {!isMobile && <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"14px", flex:1 }}>{product.varieties.slice(0,3).map((v:any) => (<span key={v.id} style={{ fontSize:"9px", background:"#F5F0E8", border:"1px solid rgba(13,27,42,0.08)", color:"rgba(13,27,42,0.5)", borderRadius:"6px", padding:"2px 7px" }}>{v.name.split(" ")[0]}</span>))}{product.varieties.length > 3 && <span style={{ fontSize:"9px", color:"#C4930A", fontWeight:700 }}>+{product.varieties.length-3}</span>}</div>}
                    <div style={{ display:"flex", gap: isMobile ? "4px" : "6px", marginTop:"auto" }}>
                      <Link href={`/products/${product.id}`} style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"4px", background:"#0D1B2A", color:"white", fontWeight:600, padding: isMobile ? "7px 0" : "9px 0", borderRadius:"8px", textDecoration:"none", fontSize: isMobile ? "10px" : "11px" }}>{isMobile ? "Specs" : "View Specs"} <ArrowRight size={isMobile ? 9 : 11} /></Link>
                      <button type="button" onClick={() => { setQuoteProduct(product.id); setQuoteOpen(true); }} style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:600, padding: isMobile ? "7px 0" : "9px 0", borderRadius:"8px", fontSize: isMobile ? "10px" : "11px", border:"none", cursor:"pointer" }}>Quote</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign:"center", marginTop:"40px" }}>
            <Link href="/products" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"#0D1B2A", color:"white", fontWeight:700, padding:"14px 40px", borderRadius:"14px", textDecoration:"none", fontSize:"14px" }}>View Full Catalogue <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section style={{ padding:"48px 0", background:"white" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>Why Choose Us</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,36px)", color:"#0D1B2A", margin:0 }}>Built for Serious Buyers</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? "12px" : "16px" }}>
            {[{ icon:"🌱", title:"Direct Sourcing", desc:"Straight from farms across 29 states. No middlemen, full traceability field-to-port." },{ icon:"📋", title:"Full Documentation", desc:"COA, phytosanitary, FSSAI, fumigation - all export paperwork handled end-to-end." },{ icon:"📦", title:"Custom Packaging", desc:"PP bags, jute, vacuum, retail packs. Private label and white-label ready." },{ icon:"🤝", title:"Personal Service", desc:"Direct access to our team. Real accountability on every single order." }].map((item, i) => (
              <div key={i} style={{ background:"white", border:"1px solid rgba(13,27,42,0.08)", borderRadius:"18px", padding: isMobile ? "16px" : "24px" }}>
                <div style={{ fontSize: isMobile ? "24px" : "32px", marginBottom: isMobile ? "8px" : "14px" }}>{item.icon}</div>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "13px" : "17px", color:"#0D1B2A", marginBottom:"6px" }}>{item.title}</h3>
                <p style={{ color:"rgba(13,27,42,0.55)", fontSize: isMobile ? "11px" : "13px", lineHeight:1.6, margin:0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"8px 0 36px", background:"white", overflow:"hidden" }}>
        <div style={{ textAlign:"center", marginBottom:"12px" }}>
          <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"6px" }}>Certifications & Registrations</p>
          <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"13px", margin:0 }}>Silasya Fusion Private Limited - Certified Exporter</p>
        </div>
        <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ display:"flex", gap:"24px", animation:"certScroll 18s linear infinite", width:"max-content" }}>
            {[{ code:"FSSAI", label:"Food Safety & Standards Authority of India", number:"Lic: 11226998000230", icon:"🛡️", color:"#1E3A5F" },{ code:"APEDA", label:"Agricultural & Processed Food Products Export Development Authority", number:"RCMC/APEDA/28873/2026-27", icon:"🌿", color:"#1A6B3A" },{ code:"Spices Board", label:"Certificate of Registration as Exporter of Spices", number:"CRES/SBCB/28045/2026-27", icon:"🌶️", color:"#C0392B" },{ code:"ISO 9001:2015", label:"Quality Management System - QFS Management Systems LLP", number:"Cert: SCC/2505SU/2790", icon:"✅", color:"#C4930A" },{ code:"IEC", label:"Importer Exporter Code - DGFT, Ministry of Commerce", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" },{ code:"FSSAI", label:"Food Safety & Standards Authority of India", number:"Lic: 11226998000230", icon:"🛡️", color:"#1E3A5F" },{ code:"APEDA", label:"Agricultural & Processed Food Products Export Development Authority", number:"RCMC/APEDA/28873/2026-27", icon:"🌿", color:"#1A6B3A" },{ code:"Spices Board", label:"Certificate of Registration as Exporter of Spices", number:"CRES/SBCB/28045/2026-27", icon:"🌶️", color:"#C0392B" },{ code:"ISO 9001:2015", label:"Quality Management System - QFS Management Systems LLP", number:"Cert: SCC/2505SU/2790", icon:"✅", color:"#C4930A" },{ code:"IEC", label:"Importer Exporter Code - DGFT, Ministry of Commerce", number:"ABPCS7831N", icon:"🏛️", color:"#0D1B2A" }].map((cert, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"16px", background:"#F5F0E8", border:"1px solid rgba(13,27,42,0.07)", borderRadius:"18px", padding:"20px 28px", flexShrink:0, minWidth:"300px" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:cert.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0, boxShadow:`0 4px 14px ${cert.color}40` }}>{cert.icon}</div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}><p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"14px", margin:0 }}>{cert.code}</p><span style={{ fontSize:"9px", background:"rgba(26,107,58,0.1)", color:"#1A6B3A", borderRadius:"6px", padding:"2px 6px", fontWeight:700 }}>VERIFIED</span></div>
                  <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:"0 0 4px", lineHeight:1.4 }}>{cert.label}</p>
                  <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, fontFamily:"monospace", margin:0 }}>{cert.number}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"60px", background:"linear-gradient(to right,white,transparent)", zIndex:2, pointerEvents:"none" }} />
          <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"60px", background:"linear-gradient(to left,white,transparent)", zIndex:2, pointerEvents:"none" }} />
        </div>
        <style>{`@keyframes certScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      </section>

      <section style={{ padding:"48px 0", background:"#F5F0E8" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px" }}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"10px" }}>How We Work</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(24px,3.5vw,42px)", color:"#0D1B2A", margin:0 }}>From Enquiry to Delivery</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(5,1fr)", gap:"16px" }}>
            {[{ n:"01", t:"Inquiry", d:"Share product, quantity & destination" },{ n:"02", t:"Quote", d:"Pricing & specs within 24 hrs" },{ n:"03", t:"Sample", d:"Physical sample dispatched" },{ n:"04", t:"Order", d:"PO confirmed, QC begins" },{ n:"05", t:"Delivery", d:"FOB/CIF with full documentation" }].map((s, idx) => (
              <div key={s.n} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                <div style={{ width: isMobile ? "44px" : "54px", height: isMobile ? "44px" : "54px", borderRadius:"14px", background:"#0D1B2A", color:"#E8A020", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", fontWeight:700, fontSize: isMobile ? "12px" : "14px", marginBottom:"12px", boxShadow:"0 6px 18px rgba(13,27,42,0.15)" }}>{s.n}</div>
                <h4 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "12px" : "16px", color:"#0D1B2A", marginBottom:"4px" }}>{s.t}</h4>
                {!isMobile && <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"12px", lineHeight:1.55, margin:0 }}>{s.d}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"48px 0", background:"#F5F0E8" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px" }}>
          <div style={{ textAlign:"center", marginBottom:"28px" }}>
            <p style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"12px" }}>Export Reach</p>
            <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(26px,4vw,52px)", color:"#0D1B2A", margin:"0 0 12px" }}>Rooted in India. <span style={{ color:"#C4930A" }}>Reaching the World.</span></h2>
            <p style={{ color:"rgba(13,27,42,0.5)", fontSize: isMobile ? "13px" : "15px", margin:0 }}>Pan-India sourcing · APEDA & Spices Board certified · 6 export regions</p>
          </div>
          <div style={{ position:"relative", borderRadius:"20px", overflow:"hidden", boxShadow:"0 20px 60px rgba(13,27,42,0.15)", border:"1px solid rgba(13,27,42,0.1)", background:"#b8d8e8" }}>
            <div style={{ position:"relative" }}>
              <div style={{ background:"#cde8f5" }}><img src="/worldmap.png" alt="World Map" style={{ width:"100%", display:"block", filter:"invert(1) sepia(1) saturate(2) hue-rotate(180deg) brightness(0.7)" }} /></div>
              <div style={{ position:"absolute", inset:0 }}>
                <div style={{ position:"absolute", left:"67%", top:"47%", transform:"translate(-50%,-50%)" }}>
                  <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"rgba(196,147,10,0.3)", position:"absolute", top:"-4px", left:"-4px", animation:"ping 1.5s ease infinite" }}/>
                  <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#C4930A", border:"2px solid white", boxShadow:"0 0 12px rgba(196,147,10,0.8)", position:"relative", zIndex:2 }}/>
                  <div style={{ position:"absolute", top:"16px", left:"50%", transform:"translateX(-50%)", background:"rgba(13,27,42,0.9)", border:"1px solid #C4930A", borderRadius:"6px", padding:"2px 8px", whiteSpace:"nowrap" }}><span style={{ color:"#C4930A", fontSize:"9px", fontWeight:700 }}>🇮🇳 INDIA</span></div>
                </div>
                {[[60,44],[58.5,46],[59.5,45],[61,43],[57.5,47],[46,26],[48,26],[47.5,27.5],[49,25],[46.5,24.5],[18,34],[17,27],[27,64],[76,55],[83,32],[82,71],[49,54],[55,57],[52,73],[54,42],[70,45],[67.5,52]].map(([x,y],i)=>(
                  <div key={i} style={{ position:"absolute", left:`${x}%`, top:`${y}%`, transform:"translate(-50%,-50%)" }}><div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#C4930A", border:"1.5px solid white", boxShadow:"0 0 8px rgba(196,147,10,0.7)" }}/></div>
                ))}
              </div>
            </div>
            <div style={{ background:"white", padding:"14px 24px", display:"flex", alignItems:"center", gap:"24px", borderTop:"1px solid rgba(13,27,42,0.08)", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#C4930A" }}/><span style={{ color:"rgba(13,27,42,0.55)", fontSize:"12px" }}>Export regions</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#C4930A", border:"2px solid white", boxShadow:"0 0 8px rgba(196,147,10,0.8)" }}/><span style={{ color:"rgba(13,27,42,0.55)", fontSize:"12px" }}>India - source country</span></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? "40px 0" : "56px 0", background:"white" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: isMobile ? "32px" : "48px", alignItems:"start" }}>
            <div style={{ paddingTop:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}><span style={{ width:"28px", height:"2px", background:"#C4930A", display:"inline-block" }} /><span style={{ color:"#C4930A", fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" }}>Share Your Experience</span></div>
              <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(20px,2.5vw,32px)", color:"#0D1B2A", margin:"0 0 14px", fontWeight:400, lineHeight:1.2 }}>Your feedback shapes every shipment we send.</h2>
              <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px", lineHeight:1.7, marginBottom:"20px" }}>We take buyer feedback seriously - not just for reviews, but to improve quality, packaging and communication on every order.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {[{ text:"Quality was exactly as per COA. Shipment arrived on time with full documentation. Will definitely order again.", name:"Ahmed Al-Rashidi", country:"🇦🇪 UAE", role:"Import Manager", rating:5 },{ text:"Best turmeric we have sourced from India. Curcumin content was lab-verified and consistent across batches.", name:"Lars Eriksson", country:"🇸🇪 Sweden", role:"Food Brand Owner", rating:5 }].map((t, i) => (
                  <div key={i} style={{ background:"#F5F0E8", borderRadius:"14px", padding:"16px 20px", border:"1px solid rgba(13,27,42,0.06)" }}>
                    <div style={{ display:"flex", gap:"2px", marginBottom:"10px" }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= t.rating ? "#E8A020" : "rgba(13,27,42,0.15)", fontSize:"16px" }}>★</span>)}</div>
                    <p style={{ color:"rgba(13,27,42,0.7)", fontSize:"13px", lineHeight:1.75, margin:"0 0 14px", fontStyle:"italic" }}>"{t.text}"</p>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", paddingTop:"12px", borderTop:"1px solid rgba(13,27,42,0.06)" }}>
                      <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#C4930A,#E8A020)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>{t.country.split(" ")[0]}</div>
                      <div><p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"13px", margin:0 }}>{t.name}</p><p style={{ color:"rgba(13,27,42,0.4)", fontSize:"11px", margin:0 }}>{t.role} · {t.country.split(" ").slice(1).join(" ")}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:"#F5F0E8", borderRadius:"20px", padding: isMobile ? "20px" : "28px", border:"1px solid rgba(13,27,42,0.06)" }}><FeedbackSection /></div>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? "40px 0" : "56px 0", background:"linear-gradient(135deg,#92400e,#C4930A,#E8A020)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "28px" : "48px", alignItems:"start" }}>
            <div>
              <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"clamp(22px,3vw,38px)", color:"white", marginBottom:"12px", fontWeight:400, lineHeight:1.2 }}>Ready to Source from India's Best?</h2>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"14px", lineHeight:1.7, marginBottom:"20px" }}>Send your requirements. We respond within 24 hours with pricing, specifications, and full documentation.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"16px" }}>
                {[{ icon:"✉️", text:"info@silasya.com" },{ icon:"📞", text:"+91 7259829005" },{ icon:"📍", text:"HSR Layout, Bengaluru - 560102" }].map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px" }}><span style={{ fontSize:"16px" }}>{item.icon}</span><span style={{ color:"rgba(255,255,255,0.75)", fontSize:"14px" }}>{item.text}</span></div>
                ))}
              </div>
              <a href="/Shumitra_Export_Catalogue.pdf" download="Shumitra_Export_Catalogue.pdf" style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.3)", color:"white", fontWeight:600, padding:"12px 20px", borderRadius:"12px", textDecoration:"none", fontSize:"13px", width:"fit-content" }}>Download Export Catalogue (PDF)</a>
            </div>
            <div style={{ background:"white", borderRadius:"20px", padding: isMobile ? "20px" : "28px", boxShadow:"0 16px 48px rgba(0,0,0,0.2)" }}>
              <p style={{ color:"#C4930A", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"8px" }}>Quick Enquiry</p>
              <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize: isMobile ? "20px" : "24px", color:"#0D1B2A", margin:"0 0 16px", fontWeight:400, lineHeight:1.2 }}>Get a Quote in 24 Hours</h3>
              <div style={{ width:"32px", height:"2px", background:"#C4930A", marginBottom:"16px", borderRadius:"2px" }} />
              <CtaForm isMobile={isMobile} />
            </div>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} preselectedProduct={quoteProduct} />
    </>
  );
}

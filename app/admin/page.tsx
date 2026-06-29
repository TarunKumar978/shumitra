"use client";
import { useState, useEffect } from "react";
import MediaUpload from "@/components/MediaUpload";
import { products as initialProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Plus, Edit, Trash2, Eye, EyeOff, Mail, X, Save, Star, MessageSquare, FileText, Check, LayoutDashboard, Package, ChevronRight, Play, Users } from "lucide-react";


type Inquiry = { id: string; name: string; product: string; quantity: string; unit: string; country: string; email: string; phone: string; company: string; spec: string; port: string; incoterm: string; message: string; created_at: string; status: string; };
type FeedbackEntry = { id: string; name: string; company: string; country: string; rating: number; message: string; approved: boolean; created_at: string; };
type Testimonial = { id: string; name: string; company: string; country: string; role: string; rating: number; message: string; active: boolean; };

const ink = "#0D1B2A";
const gold = "#C4930A";
const goldLight = "#E8A020";
const cream = "#F5F0E8";

function adminFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") || "" : "";
  return fetch(url, {
    ...options,
    headers: {
      "x-admin-token": token,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
}

function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("adminToken");
  const userStr = localStorage.getItem("adminUser");
  if (!token || !userStr) return false;
  try {
    const decoded = atob(token);
    const [, timestamp] = decoded.split(":");
    const age = Date.now() - parseInt(timestamp);
    return age < 5 * 60 * 60 * 1000; // 5 hours
  } catch { return false; }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [addingMember, setAddingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ name:"", email:"", password:"", role:"admin" });
  const [sessionId, setSessionId] = useState<number|null>(null);
  const [sessionStart, setSessionStart] = useState<Date|null>(null);
  const [sessionTime, setSessionTime] = useState("0m");
  const [showPassword, setShowPassword] = useState(false);

  const [tab, setTab] = useState<"dashboard"|"products"|"inquiries"|"feedback"|"testimonials"|"catalogue"|"hero"|"team">("dashboard");
  const [prods, setProds] = useState<Product[]>(initialProducts);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [addingVariety, setAddingVariety] = useState<string|null>(null);
  const [newVariety, setNewVariety] = useState<any>({});
  const [editingVariety, setEditingVariety] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name:"", category:"spices", emoji:"🌿", tagline:"", description:"", heroImage:"" });
  const [editingT, setEditingT] = useState<Testimonial|null>(null);
  const [tForm, setTForm] = useState({ name:"", company:"", country:"", role:"", rating:5, message:"", active:true });
  const [catalogueFile, setCatalogueFile] = useState<File|null>(null);
  const [dbHeroSlides, setDbHeroSlides] = useState<any[]>([]);
  const [addingHeroSlide, setAddingHeroSlide] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<number|null>(null);
  const [heroSlideForm, setHeroSlideForm] = useState<any>({ label:"", subtitle:"", image_url:"", video_url:"", accent_color:"#C4930A" });
  const fetchHeroSlides = async () => {
    const res = await adminFetch("/api/hero-slides");
    const data = await res.json();
    if (data.data) setDbHeroSlides(data.data);
  };
  const [heroSlides, setHeroSlides] = useState([
    { emoji:"🟡", label:"India's Golden Spice",  accent:"#f59e0b", bg:"linear-gradient(135deg,#1a0a00,#c2570a,#e8820a)" },
    { emoji:"🌶️", label:"The Fire of India",      accent:"#f87171", bg:"linear-gradient(135deg,#1a0000,#b91c1c,#ef4444)" },
    { emoji:"⚫", label:"King of Spices",          accent:"#d6d3d1", bg:"linear-gradient(135deg,#0a0a0a,#44403c,#78716c)" },
    { emoji:"🟤", label:"Warm & Earthy Aroma",    accent:"#fbbf24", bg:"linear-gradient(135deg,#0a0800,#92400e,#b45309)" },
    { emoji:"🌾", label:"India's Premium Grain",  accent:"#86efac", bg:"linear-gradient(135deg,#020d00,#15803d,#22c55e)" },
    { emoji:"💚", label:"Queen of Spices",         accent:"#6ee7b7", bg:"linear-gradient(135deg,#001a0a,#059669,#34d399)" },
  ]);
  const [editingSlide, setEditingSlide] = useState<number|null>(null);
  const [catalogueMsg, setCatalogueMsg] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchAll = async () => {
    setLoading(true);
    const [inqRes, fbRes, tRes, prodRes] = await Promise.all([
      adminFetch("/api/inquiries"),
      adminFetch("/api/feedback"),
      adminFetch("/api/testimonials"),
      adminFetch("/api/products"),
    ]);
    const [inqData, fbData, tData, prodData] = await Promise.all([inqRes.json(), fbRes.json(), tRes.json(), prodRes.json()]);
    if (inqData.data) setInquiries(inqData.data);
    if (fbData.data) setFeedback(fbData.data);
    if (tData.data) setTestimonials(tData.data);
    if (prodData.data) setDbProducts(prodData.data);
    setLoading(false);
    fetchHeroSlides();
  };

  // Restore session from localStorage on mount
  useEffect(() => {
    if (isTokenValid()) {
      try {
        const u = localStorage.getItem("adminUser");
        const s = localStorage.getItem("adminSessionId");
        if (u) setCurrentUser(JSON.parse(u));
        if (s) setSessionId(parseInt(s));
        setAuthed(true);
        setSessionStart(new Date());
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminSessionId");
      }
    }
  }, []);

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  // Auto-logout after 5 hours
  useEffect(() => {
    if (!authed) return;
    const checkExpiry = setInterval(() => {
      if (!isTokenValid()) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminSessionId");
        setAuthed(false);
        setCurrentUser(null);
        setSessionId(null);
        setSessionStart(null);
        setSessionTime("0m");
        alert("Your session has expired. Please log in again.");
      }
    }, 60000); // check every minute
    return () => clearInterval(checkExpiry);
  }, [authed]);

  // Session timer
  useEffect(() => {
    if (!authed || !sessionStart) return;
    const t = setInterval(() => {
      const mins = Math.floor((Date.now() - sessionStart.getTime()) / 60000);
      const hrs = Math.floor(mins / 60);
      setSessionTime(hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`);
    }, 30000);
    setSessionTime("0m");
    return () => clearInterval(t);
  }, [authed, sessionStart]);

  const newCount = inquiries.filter(i => i.status === "new").length;
  const pendingFeedback = feedback.filter(f => !f.approved).length;

  const inputStyle = { width:"100%", padding:"10px 14px", border:`1px solid rgba(13,27,42,0.15)`, borderRadius:"10px", background:"white", fontSize:"13px", color:ink, outline:"none", boxSizing:"border-box" as const, fontFamily:"DM Sans,sans-serif" };

  const Stars = ({ rating }: { rating: number }) => (
    <span style={{ color:gold, fontSize:"14px" }}>{"★".repeat(rating)}{"☆".repeat(5-rating)}</span>
  );

  if (!authed) return (
    <div style={{ minHeight:"100vh", background:"#0D1B2A", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(196,147,10,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(196,147,10,0.03) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
      <div style={{ position:"absolute", top:"-100px", right:"-100px", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(196,147,10,0.08),transparent 70%)" }} />

      <div style={{ background:"white", borderRadius:"28px", padding:"48px 44px", width:"100%", maxWidth:"420px", boxShadow:"0 40px 100px rgba(0,0,0,0.5)", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <img src="/logo.jpeg" alt="Shumitra" style={{ width:"72px", height:"72px", borderRadius:"18px", objectFit:"contain", margin:"0 auto 16px", display:"block", border:"2px solid rgba(196,147,10,0.2)" }} />
          <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"26px", color:ink, margin:"0 0 6px", fontWeight:400 }}>
            {forgotMode ? "Forgot Password" : resetMode ? "Reset Password" : "Admin Login"}
          </h1>
          <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"13px", margin:0 }}>Shumitra Exports · Silasya Fusion</p>
        </div>

        {/* LOGIN FORM */}
        {!forgotMode && !resetMode && (
          <div>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"8px" }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="Enter your email" autoComplete="off"
                style={{ ...inputStyle, border: loginError ? "1px solid #ef4444" : "1px solid rgba(13,27,42,0.15)" }}
                onKeyDown={e => e.key === "Enter" && document.getElementById("loginBtn")?.click()} />
            </div>
            <div style={{ marginBottom:"8px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"8px" }}>Password</label>
              <div style={{ position:"relative" }}>
                <input type={showPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="new-password"
                  style={{ ...inputStyle, border: loginError ? "1px solid #ef4444" : "1px solid rgba(13,27,42,0.15)", paddingRight:"48px" }}
                  onKeyDown={e => { if (e.key === "Enter") document.getElementById("loginBtn")?.click(); }} />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.4)", fontSize:"13px", fontWeight:600, padding:0 }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {loginError && <p style={{ color:"#ef4444", fontSize:"12px", margin:"6px 0 12px" }}>{loginError}</p>}
            <button onClick={() => setForgotMode(true)}
              style={{ background:"none", border:"none", color:gold, fontSize:"12px", fontWeight:600, cursor:"pointer", padding:"0 0 20px", display:"block" }}>
              Forgot password?
            </button>
            <button id="loginBtn" disabled={loginLoading} onClick={async () => {
              if (!loginEmail || !loginPassword) return setLoginError("Please enter email and password");
              setLoginLoading(true); setLoginError("");
              const res = await fetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ action:"login", email:loginEmail, password:loginPassword }) });
              const data = await res.json();
              setLoginLoading(false);
              if (data.success) {
              setAuthed(true);
              setCurrentUser(data.user);
              setSessionId(data.session_id);
              setSessionStart(new Date());
              const tokenData = `${data.user.email}:${Date.now()}`;
              const token = btoa(tokenData);
              localStorage.setItem("adminToken", token);
              localStorage.setItem("adminUser", JSON.stringify(data.user));
              localStorage.setItem("adminSessionId", String(data.session_id));
            }
              else setLoginError(data.error || "Invalid credentials");
            }} style={{ width:"100%", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"14px", borderRadius:"12px", border:"none", cursor: loginLoading ? "not-allowed" : "pointer", fontSize:"15px", opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? "Signing in..." : "Sign In →"}
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {forgotMode && !resetMode && (
          <div>
            <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px", lineHeight:1.7, marginBottom:"20px" }}>
              Enter your admin email and we'll send a reset token to your inbox.
            </p>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"8px" }}>Email</label>
              <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                placeholder="tarun.k@silasya.com"
                style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)" }} />
            </div>
            {forgotMsg && <p style={{ color: forgotMsg.includes("✅") ? "#16a34a" : "#ef4444", fontSize:"13px", marginBottom:"12px" }}>{forgotMsg}</p>}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={async () => {
                if (!forgotEmail) return setForgotMsg("Enter your email");
                setForgotMsg("Sending...");
                const res = await fetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"},
                  body: JSON.stringify({ action:"forgot", email:forgotEmail }) });
                const data = await res.json();
                if (data.success) { setForgotMsg("✅ Reset token sent! Check your email."); setTimeout(() => setResetMode(true), 1500); }
                else setForgotMsg(data.error || "Failed to send");
              }} style={{ flex:1, background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"12px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px" }}>
                Send Reset Token
              </button>
              <button onClick={() => { setForgotMode(false); setForgotMsg(""); }}
                style={{ padding:"12px 18px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", cursor:"pointer", fontSize:"14px", color:"rgba(13,27,42,0.5)" }}>Back</button>
            </div>
            <button onClick={() => setResetMode(true)}
              style={{ background:"none", border:"none", color:gold, fontSize:"12px", fontWeight:600, cursor:"pointer", padding:"14px 0 0", display:"block" }}>
              Already have a token? Reset now →
            </button>
          </div>
        )}

        {/* RESET PASSWORD */}
        {resetMode && (
          <div>
            <p style={{ color:"rgba(13,27,42,0.55)", fontSize:"13px", lineHeight:1.7, marginBottom:"20px" }}>
              Enter the 8-character token from your email and your new password.
            </p>
            <div style={{ marginBottom:"14px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"8px" }}>Reset Token</label>
              <input value={resetToken} onChange={e => setResetToken(e.target.value.toUpperCase())}
                placeholder="ABCD1234" maxLength={8}
                style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)", letterSpacing:"4px", fontWeight:700, fontSize:"16px" }} />
            </div>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:"8px" }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)" }} />
            </div>
            {forgotMsg && <p style={{ color: forgotMsg.includes("✅") ? "#16a34a" : "#ef4444", fontSize:"13px", marginBottom:"12px" }}>{forgotMsg}</p>}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={async () => {
                if (!resetToken || !newPassword) return setForgotMsg("Fill all fields");
                if (newPassword.length < 8) return setForgotMsg("Password must be at least 8 characters");
                const res = await fetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"},
                  body: JSON.stringify({ action:"reset", token:resetToken, newPassword }) });
                const data = await res.json();
                if (data.success) { setForgotMsg("✅ Password reset! Please login."); setTimeout(() => { setResetMode(false); setForgotMode(false); setForgotMsg(""); }, 1500); }
                else setForgotMsg(data.error || "Reset failed");
              }} style={{ flex:1, background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"12px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px" }}>
                Reset Password
              </button>
              <button onClick={() => { setResetMode(false); setForgotMode(false); setForgotMsg(""); }}
                style={{ padding:"12px 18px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", cursor:"pointer", fontSize:"14px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const navItems = [
    { id:"dashboard",    icon:<LayoutDashboard size={16}/>, label:"Dashboard" },
    { id:"products",     icon:<Package size={16}/>,         label:"Products" },
    { id:"inquiries",    icon:<Mail size={16}/>,            label:`Inquiries${newCount > 0 ? ` (${newCount})` : ""}` },
    { id:"feedback",     icon:<Star size={16}/>,            label:`Feedback${pendingFeedback > 0 ? ` (${pendingFeedback})` : ""}` },
    { id:"testimonials", icon:<MessageSquare size={16}/>,   label:"Testimonials" },
    { id:"catalogue",    icon:<FileText size={16}/>,        label:"Catalogue" },
    { id:"hero",         icon:<Play size={16}/>,            label:"Hero Section" },
    { id:"team",         icon:<Users size={16}/>,           label:"Team & Access" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:cream, display:"flex", fontFamily:"DM Sans,sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:"24px", right:"24px", background:ink, color:"white", padding:"12px 20px", borderRadius:"12px", zIndex:9999, fontSize:"13px", fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{ width:"240px", background:ink, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, flexShrink:0 }}>
        <div style={{ padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <img src="/logo.jpeg" alt="S" style={{ width:"38px", height:"38px", borderRadius:"10px", objectFit:"contain" }} />
            <div>
              <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"16px", color:"white", margin:0, fontWeight:700 }}>SHUMITRA</p>
              <p style={{ fontSize:"8px", color:gold, letterSpacing:"0.2em", textTransform:"uppercase", margin:0 }}>Admin Panel</p>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id as typeof tab)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"11px 16px", borderRadius:"12px", border:"none", cursor:"pointer", textAlign:"left", marginBottom:"4px", fontSize:"13px", fontWeight:600, transition:"all 0.2s", background: tab === item.id ? "rgba(255,255,255,0.1)" : "transparent", color: tab === item.id ? "white" : "rgba(255,255,255,0.5)" }}>
              {item.icon} {item.label}
              {tab === item.id && <div style={{ marginLeft:"auto", width:"6px", height:"6px", borderRadius:"50%", background:gold }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <a href="/" target="_blank" style={{ display:"flex", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.4)", fontSize:"12px", textDecoration:"none", padding:"8px 16px", marginBottom:"4px" }}>🌐 View Website</a>
          <button onClick={() => setAuthed(false)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", fontSize:"12px", padding:"8px 16px", textAlign:"left" }}>Sign out</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflowY:"auto", minHeight:"100vh" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ marginBottom:"32px" }}>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Good day 👋</h1>
              <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>Here's an overview of Shumitra Exports</p>
            </div>
            {loading ? (
              <div style={{ textAlign:"center", padding:"48px", color:"rgba(13,27,42,0.3)", fontSize:"14px" }}>Loading data from database...</div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"32px" }}>
                  {[
                    { label:"Total Products",    value:prods.length + dbProducts.length,           sub:"in catalogue",        hot:false, tab:"products" },
                    { label:"New Inquiries",     value:newCount,                                   sub:"awaiting response",   hot:true,  tab:"inquiries" },
                    { label:"Pending Feedback",  value:pendingFeedback,                            sub:"awaiting approval",   hot:false, tab:"feedback" },
                    { label:"Live Testimonials", value:testimonials.filter(t => t.active).length,  sub:"shown on homepage",   hot:false, tab:"testimonials" },
                  ].map(s => (
                    <div key={s.label} onClick={() => setTab(s.tab as any)}
                      style={{ background: s.hot ? `rgba(196,147,10,0.08)` : "white", borderRadius:"16px", padding:"20px 24px", border: s.hot ? `1px solid rgba(196,147,10,0.25)` : "1px solid rgba(13,27,42,0.07)", cursor:"pointer", transition:"all 0.2s", transform:"translateY(0)" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                      <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 8px" }}>{s.label}</p>
                      <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"36px", color: s.hot ? gold : ink, margin:"0 0 4px", fontWeight:400 }}>{s.value}</p>
                      <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"12px", margin:0 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", padding:"28px" }}>
                  <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", color:ink, margin:"0 0 20px", fontWeight:400 }}>Recent Inquiries</h3>
                  {inquiries.length === 0 ? (
                    <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"14px", textAlign:"center", padding:"24px" }}>No inquiries yet. They'll appear here when customers submit the quote form.</p>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      {inquiries.slice(0,5).map(inq => (
                        <div key={inq.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:cream, borderRadius:"12px", padding:"14px 18px" }}>
                          <div>
                            <p style={{ fontWeight:700, color:ink, fontSize:"14px", margin:"0 0 3px" }}>{inq.name} — {inq.country}</p>
                            <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"12px", margin:0 }}>{inq.product} · {inq.quantity} {inq.unit}</p>
                          </div>
                          <span style={{ fontSize:"11px", fontWeight:700, padding:"4px 12px", borderRadius:"8px", background: inq.status === "new" ? gold : "rgba(13,27,42,0.08)", color: inq.status === "new" ? "white" : "rgba(13,27,42,0.5)" }}>{inq.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setTab("inquiries")} style={{ marginTop:"16px", background:"none", border:"none", cursor:"pointer", color:gold, fontSize:"13px", fontWeight:600, display:"flex", alignItems:"center", gap:"4px", padding:0 }}>
                    View all inquiries <ChevronRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
              <div>
                <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Products</h1>
                <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>{prods.length} products · {prods.reduce((a,p) => a+p.varieties.length,0)} varieties total</p>
              </div>
              <button onClick={() => setAddingProduct(true)}
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                <Plus size={15}/> Add New Product
              </button>
            </div>

            {addingProduct && (
              <div style={{ background:`rgba(196,147,10,0.05)`, border:`1px solid rgba(196,147,10,0.2)`, borderRadius:"20px", padding:"28px", marginBottom:"24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", color:ink, margin:0, fontWeight:400 }}>Add New Product</p>
                  <button onClick={() => setAddingProduct(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.4)" }}><X size={18}/></button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Emoji</label>
                    <input value={newProduct.emoji} onChange={e => setNewProduct(p => ({ ...p, emoji:e.target.value }))} style={{ ...inputStyle, textAlign:"center", fontSize:"24px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Product Name *</label>
                    <input placeholder="e.g. Fenugreek Seeds" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name:e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category:e.target.value }))} style={{ ...inputStyle, cursor:"pointer" }}>
                      <option value="spices">Spices</option>
                      <option value="commodities">Commodities</option>
                    </select>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Tagline</label>
                    <input placeholder="e.g. Bold & Aromatic Export Grade" value={newProduct.tagline} onChange={e => setNewProduct(p => ({ ...p, tagline:e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Short Description</label>
                    <input placeholder="e.g. Rajasthan origin, bold grade..." value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description:e.target.value }))} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom:"20px" }}>
                  <MediaUpload
                    label="Hero Image"
                    accept="image/jpeg,image/png,image/webp"
                    folder="products"
                    currentUrl={newProduct.heroImage}
                    onUpload={url => setNewProduct(p => ({ ...p, heroImage: url }))}
                    type="image"
                  />
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={async () => {
                    if (!newProduct.name) return;
                    const res = await adminFetch("/api/products", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: newProduct.name,
                        category: newProduct.category,
                        emoji: newProduct.emoji,
                        tagline: newProduct.tagline,
                        description: newProduct.description,
                        hero_image: newProduct.heroImage || null,
                        hero_color: "#C4930A",
                        active: 1,
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      await fetchAll();
                      setAddingProduct(false);
                      setNewProduct({ name:"", category:"spices", emoji:"🌿", tagline:"", description:"", heroImage:"" });
                      showToast("✅ Product saved to database!");
                    } else {
                      showToast("❌ Error: " + (data.error || "Unknown error"));
                    }
                  }} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                    <Save size={14}/> Save Product
                  </button>
                  <button onClick={() => setAddingProduct(false)} style={{ padding:"10px 16px", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.5)", fontSize:"13px" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* DB Products */}
            {dbProducts.length > 0 && (
              <div style={{ marginBottom:"16px" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>📦 Added via Admin ({dbProducts.length})</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {dbProducts.map(product => (
                    <div key={product.id} style={{ background:"white", borderRadius:"20px", border:`1px solid rgba(196,147,10,0.25)`, overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                          {product.hero_image && <img src={product.hero_image} alt="" style={{ width:"48px", height:"48px", borderRadius:"10px", objectFit:"cover" }} onError={e => (e.currentTarget.style.display="none")} />}
                          <span style={{ fontSize:"28px" }}>{product.emoji}</span>
                          <div>
                            <p style={{ fontWeight:700, color:"#0D1B2A", fontSize:"15px", margin:"0 0 4px" }}>{product.name}</p>
                            <div style={{ display:"flex", gap:"8px" }}>
                              <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.45)", background:"#F5F0E8", border:"1px solid rgba(13,27,42,0.08)", borderRadius:"6px", padding:"2px 8px", textTransform:"capitalize" }}>{product.category}</span>
                              <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.45)" }}>{(product.varieties||[]).length} varieties</span>
                              <span style={{ fontSize:"10px", color:"#C4930A", background:"rgba(196,147,10,0.1)", borderRadius:"6px", padding:"2px 8px", fontWeight:600 }}>DB</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:"8px" }}>
                          <button onClick={() => {
                            const p = product;
                            setEditingProduct({ id:p.id, name:p.name, emoji:p.emoji||"🌿", category:p.category||"spices", tagline:p.tagline||"", description:p.description||"", hero_color:p.hero_color||"#C4930A" });
                          }} style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid rgba(196,147,10,0.3)", background:"rgba(196,147,10,0.08)", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#C4930A" }}>Edit</button>
                          <button onClick={async () => {
                            if (!confirm("Delete this product?")) return;
                            await adminFetch("/api/products", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: product.id }) });
                            setDbProducts(ps => ps.filter(p => p.id !== product.id));
                            showToast("🗑️ Product deleted");
                          }} style={{ padding:"8px 14px", borderRadius:"10px", border:"1px solid #fecaca", background:"#fef2f2", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#ef4444" }}>Delete</button>
                        </div>
                      </div>
                      {(product.varieties||[]).length > 0 && (
                        <div style={{ borderTop:"1px solid rgba(13,27,42,0.05)", padding:"12px 20px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                            {(product.varieties||[]).map((v: any) => (
                              <div key={v.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#F5F0E8", borderRadius:"10px", padding:"10px 14px" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                                  {v.image && <img src={v.image} alt="" style={{ width:"36px", height:"36px", borderRadius:"8px", objectFit:"cover" }} />}
                                  <div>
                                    <p style={{ fontWeight:600, color:"#0D1B2A", fontSize:"13px", margin:"0 0 2px" }}>{v.name}</p>
                                    <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:0 }}>{v.origin} · MOQ: {v.min_order}</p>
                                  </div>
                                </div>
                                <div style={{ display:"flex", gap:"6px" }}>
                                  <button onClick={() => setEditingVariety({ ...v, product_id: product.id })} style={{ padding:"4px 10px", borderRadius:"6px", border:"1px solid rgba(196,147,10,0.3)", background:"rgba(196,147,10,0.08)", cursor:"pointer", fontSize:"11px", color:"#C4930A", fontWeight:600 }}>Edit</button>
                                  <button onClick={async () => {
                                    if (!confirm("Delete variety?")) return;
                                    await adminFetch("/api/varieties", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: v.id, product_id: product.id }) });
                                    setDbProducts(ps => ps.map(p => p.id === product.id ? { ...p, varieties: p.varieties.filter((x: any) => x.id !== v.id) } : p));
                                    showToast("🗑️ Variety deleted");
                                  }} style={{ padding:"4px 10px", borderRadius:"6px", border:"1px solid #fecaca", background:"#fef2f2", cursor:"pointer", fontSize:"11px", color:"#ef4444" }}>Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ borderTop:"1px solid rgba(13,27,42,0.05)", padding:"12px 20px" }}>
                        <button onClick={() => setAddingVariety(`db_${product.id}`)} style={{ background:"none", border:"none", cursor:"pointer", color:"#C4930A", fontSize:"12px", fontWeight:600, display:"flex", alignItems:"center", gap:"4px" }}>
                          <Plus size={12}/> Add Variety
                        </button>
                        {addingVariety === `db_${product.id}` && (
                          <div style={{ marginTop:"16px", background:"rgba(196,147,10,0.05)", border:"1px solid rgba(196,147,10,0.2)", borderRadius:"16px", padding:"20px" }}>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                              {[
                                { label:"Variety Name *", key:"name", placeholder:"e.g. Premium Grade" },
                                { label:"Origin", key:"origin", placeholder:"e.g. Bihar" },
                                { label:"Min. Order", key:"min_order", placeholder:"e.g. 10 kg" },
                              ].map(f => (
                                <div key={f.key}>
                                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>{f.label}</label>
                                  <input placeholder={f.placeholder} onChange={e => setNewVariety((v: any) => ({ ...v, [f.key]: e.target.value }))} style={inputStyle} />
                                </div>
                              ))}
                            </div>
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                              <MediaUpload label="Product Image" accept="image/jpeg,image/png,image/webp" folder="products" onUpload={url => setNewVariety((v: any) => ({ ...v, image: url }))} type="image" />
                              <MediaUpload label="Product Video" accept="video/mp4,video/mov" folder="videos" onUpload={url => setNewVariety((v: any) => ({ ...v, video: url }))} type="video" />
                            </div>
                            <div style={{ display:"flex", gap:"8px" }}>
                              <button onClick={async () => {
                                if (!newVariety.name) return;
                                const variety = { product_id: product.id, name: newVariety.name, image: newVariety.image||null, video: newVariety.video||null };
                                const res = await adminFetch("/api/varieties", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(variety) });
                                const data = await res.json();
                                if (data.success) {
                                  await fetchAll();
                                  showToast("✅ Variety saved!");
                                } else {
                                  showToast("❌ Error: " + (data.error || "Unknown"));
                                }
                                setAddingVariety(null);
                                setNewVariety({});
                              }} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, padding:"10px 18px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                                <Save size={14}/> Save
                              </button>
                              <button onClick={() => { setAddingVariety(null); setNewVariety({}); }} style={{ padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.5)", fontSize:"13px" }}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Static products from lib/data.ts */}
            <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>📚 Default Catalogue ({prods.length})</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {prods.map(product => (
                <div key={product.id} style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", overflow:"hidden", opacity: hidden.includes(product.id) ? 0.5 : 1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                      <span style={{ fontSize:"32px" }}>{product.emoji}</span>
                      <div>
                        <p style={{ fontWeight:700, color:ink, fontSize:"15px", margin:"0 0 4px" }}>{product.name}</p>
                        <div style={{ display:"flex", gap:"8px" }}>
                          <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.45)", background:cream, border:"1px solid rgba(13,27,42,0.08)", borderRadius:"6px", padding:"2px 8px", textTransform:"capitalize" }}>{product.category}</span>
                          <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.45)" }}>{product.varieties.length} varieties</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setHidden(h => h.includes(product.id) ? h.filter(x => x !== product.id) : [...h, product.id])}
                      style={{ padding:"8px 16px", borderRadius:"10px", border:"1px solid rgba(13,27,42,0.12)", background:"white", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"rgba(13,27,42,0.6)", display:"flex", alignItems:"center", gap:"6px" }}>
                      {hidden.includes(product.id) ? <><Eye size={14}/> Show</> : <><EyeOff size={14}/> Hide</>}
                    </button>
                  </div>
                  <div style={{ borderTop:"1px solid rgba(13,27,42,0.05)", padding:"16px 24px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                      <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(13,27,42,0.35)", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Varieties</p>
                      <button onClick={() => setAddingVariety(product.id)} style={{ background:"none", border:"none", cursor:"pointer", color:gold, fontSize:"12px", fontWeight:600, display:"flex", alignItems:"center", gap:"4px" }}>
                        <Plus size={12}/> Add
                      </button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                      {product.varieties.map((v: any) => (
                        <div key={v.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:cream, borderRadius:"10px", padding:"10px 14px" }}>
                          <div>
                            <p style={{ fontWeight:600, color:ink, fontSize:"13px", margin:"0 0 2px" }}>{v.name}</p>
                            <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"11px", margin:0 }}>{v.origin} · MOQ: {v.minOrder}</p>
                          </div>
                          <div style={{ display:"flex", gap:"4px" }}>
                            <button onClick={() => setEditingVariety({ ...v, product_id: product.id })} style={{ padding:"6px", borderRadius:"8px", border:"none", background:"none", cursor:"pointer", color:"#C4930A" }}><Edit size={13}/></button>
                            <button onClick={async () => { if (!confirm("Delete variety?")) return; await adminFetch("/api/varieties", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: v.id, product_id: product.id }) }); await fetchAll(); showToast("🗑️ Deleted"); }} style={{ padding:"6px", borderRadius:"8px", border:"none", background:"none", cursor:"pointer", color:"#ef4444" }}><Trash2 size={13}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {addingVariety === product.id && (
                      <div style={{ marginTop:"16px", background:`rgba(196,147,10,0.05)`, border:`1px solid rgba(196,147,10,0.2)`, borderRadius:"16px", padding:"24px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
                          <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:ink, margin:0, fontWeight:400 }}>Add Variety to {product.name}</p>
                          <button onClick={() => setAddingVariety(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.4)" }}><X size={16}/></button>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"16px" }}>
                          {[
                            { label:"Variety Name *", key:"name", placeholder:"e.g. Erode Premium" },
                            { label:"Origin *", key:"origin", placeholder:"e.g. Erode, Tamil Nadu" },
                            { label:"Min. Order", key:"minOrder", placeholder:"e.g. 500 kg" },
                            { label:"Grade", key:"grade", placeholder:"e.g. Export Grade A" },
                            { label:"Moisture %", key:"moisture", placeholder:"e.g. ≤ 10%" },
                            { label:"Packing", key:"packing", placeholder:"e.g. PP Bags 25kg" },
                          ].map(f => (
                            <div key={f.key}>
                              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>{f.label}</label>
                              <input placeholder={f.placeholder} onChange={e => setNewVariety((v: any) => ({ ...v, [f.key]: e.target.value }))} style={inputStyle} />
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                          <MediaUpload
                            label="Product Image"
                            accept="image/jpeg,image/png,image/webp"
                            folder="products"
                            onUpload={url => setNewVariety((v: any) => ({ ...v, image: url }))}
                            type="image"
                          />
                          <MediaUpload
                            label="Product Video (optional)"
                            accept="video/mp4,video/mov,video/avi"
                            folder="videos"
                            onUpload={url => setNewVariety((v: any) => ({ ...v, video: url }))}
                            type="video"
                          />
                          <div style={{ gridColumn:"1/-1" }}>
                            <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Description</label>
                            <textarea placeholder="Describe this variety..." rows={2} onChange={e => setNewVariety((v: any) => ({ ...v, description: e.target.value }))} style={{ ...inputStyle, resize:"none" }} />
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:"10px" }}>
                          <button onClick={async () => {
                            if (!newVariety.name) return;
                            const res = await adminFetch("/api/varieties", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ product_id: product.id, name: newVariety.name, origin: newVariety.origin||null, grade: newVariety.grade||null, min_order: newVariety.minOrder||null, moisture: newVariety.moisture||null, packing: newVariety.packing||null, image: newVariety.image||null, video: newVariety.video||null, description: newVariety.description||null }) });
                            const data = await res.json();
                            if (data.success) { await fetchAll(); showToast("✅ Variety saved!"); }
                            else showToast("❌ " + (data.error||"Error"));
                            setAddingVariety(null); setNewVariety({});
                          }} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"11px 22px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                            <Save size={14}/> Save Variety
                          </button>
                          <button onClick={() => { setAddingVariety(null); setNewVariety({}); }} style={{ padding:"11px 16px", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.5)", fontSize:"13px" }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


                {/* HERO SECTION */}
        {tab === "hero" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ marginBottom:"32px" }}>
              <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Hero Section</h1>
              <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>Manage homepage hero slides — each with its own image or video</p>
            </div>

            {/* Slides list */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px", marginBottom:"24px" }}>
              {dbHeroSlides.map((slide: any) => (
                <div key={slide.id} style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", overflow:"hidden" }}>
                  {editingHeroSlide === slide.id ? (
                    <div style={{ padding:"24px" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
                        <div>
                          <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Slide Label *</label>
                          <input value={heroSlideForm.label||""} onChange={e => setHeroSlideForm((f:any) => ({...f, label:e.target.value}))}
                            placeholder="e.g. India's Golden Spice"
                            style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", outline:"none", boxSizing:"border-box" as const }} />
                        </div>
                        <div>
                          <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Subtitle</label>
                          <input value={heroSlideForm.subtitle||""} onChange={e => setHeroSlideForm((f:any) => ({...f, subtitle:e.target.value}))}
                            placeholder="e.g. Premium Export Grade"
                            style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", outline:"none", boxSizing:"border-box" as const }} />
                        </div>
                        <div>
                          <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Accent Color</label>
                          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                            <input type="color" value={heroSlideForm.accent_color||"#C4930A"} onChange={e => setHeroSlideForm((f:any) => ({...f, accent_color:e.target.value}))}
                              style={{ width:"48px", height:"38px", borderRadius:"8px", border:"1px solid rgba(13,27,42,0.15)", cursor:"pointer" }} />
                            <span style={{ fontSize:"13px", color:"rgba(13,27,42,0.5)" }}>{heroSlideForm.accent_color||"#C4930A"}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                        <MediaUpload label="Slide Image" accept="image/jpeg,image/png,image/webp" folder="hero-slides"
                          currentUrl={heroSlideForm.image_url||""}
                          onUpload={url => setHeroSlideForm((f:any) => ({...f, image_url:url}))} type="image" />
                        <MediaUpload label="Slide Video (optional)" accept="video/mp4,video/mov" folder="hero-slides"
                          currentUrl={heroSlideForm.video_url||""}
                          onUpload={url => setHeroSlideForm((f:any) => ({...f, video_url:url}))} type="video" />
                      </div>
                      <div style={{ display:"flex", gap:"10px" }}>
                        <button onClick={async () => {
                          const res = await adminFetch("/api/hero-slides", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: slide.id, ...heroSlideForm }) });
                          const data = await res.json();
                          if (data.success) { await fetchHeroSlides(); setEditingHeroSlide(null); showToast("✅ Slide updated!"); }
                          else showToast("❌ " + data.error);
                        }} style={{ padding:"11px 24px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, border:"none", borderRadius:"10px", cursor:"pointer", fontSize:"13px" }}>
                          Save Changes
                        </button>
                        <button onClick={() => setEditingHeroSlide(null)} style={{ padding:"11px 18px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", cursor:"pointer", fontSize:"13px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 20px" }}>
                      {/* Preview */}
                      <div style={{ width:"80px", height:"56px", borderRadius:"10px", overflow:"hidden", flexShrink:0, background:"#0D1B2A", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {slide.image_url ? (
                          <img src={slide.image_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : slide.video_url ? (
                          <span style={{ fontSize:"24px" }}>🎬</span>
                        ) : (
                          <span style={{ fontSize:"24px" }}>🖼️</span>
                        )}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:700, color:ink, fontSize:"15px", margin:"0 0 3px" }}>{slide.label}</p>
                        {slide.subtitle && <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"12px", margin:"0 0 6px" }}>{slide.subtitle}</p>}
                        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                          <div style={{ width:"20px", height:"4px", borderRadius:"2px", background:slide.accent_color||gold }} />
                          {slide.image_url && <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.4)", fontWeight:600 }}>📷 Has image</span>}
                          {slide.video_url && <span style={{ fontSize:"10px", color:"rgba(13,27,42,0.4)", fontWeight:600 }}>🎬 Has video</span>}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button onClick={() => { setEditingHeroSlide(slide.id); setHeroSlideForm({ label:slide.label, subtitle:slide.subtitle||"", image_url:slide.image_url||"", video_url:slide.video_url||"", accent_color:slide.accent_color||"#C4930A" }); }}
                          style={{ padding:"8px 16px", border:"1px solid rgba(196,147,10,0.3)", background:"rgba(196,147,10,0.08)", borderRadius:"10px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:gold }}>Edit</button>
                        <button onClick={async () => {
                          if (!confirm("Delete this slide?")) return;
                          await adminFetch("/api/hero-slides", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: slide.id }) });
                          await fetchHeroSlides();
                          showToast("🗑️ Slide deleted");
                        }} style={{ padding:"8px 16px", border:"1px solid #fecaca", background:"#fef2f2", borderRadius:"10px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#ef4444" }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new slide */}
            {addingHeroSlide ? (
              <div style={{ background:"white", borderRadius:"20px", border:`1px solid rgba(196,147,10,0.25)`, padding:"24px" }}>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", color:ink, margin:"0 0 20px", fontWeight:400 }}>New Hero Slide</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Slide Label *</label>
                    <input value={heroSlideForm.label||""} onChange={e => setHeroSlideForm((f:any) => ({...f, label:e.target.value}))}
                      placeholder="e.g. India's Golden Spice"
                      style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", outline:"none", boxSizing:"border-box" as const }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Subtitle</label>
                    <input value={heroSlideForm.subtitle||""} onChange={e => setHeroSlideForm((f:any) => ({...f, subtitle:e.target.value}))}
                      placeholder="e.g. Premium Export Grade"
                      style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", outline:"none", boxSizing:"border-box" as const }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Accent Color</label>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <input type="color" value={heroSlideForm.accent_color||"#C4930A"} onChange={e => setHeroSlideForm((f:any) => ({...f, accent_color:e.target.value}))}
                        style={{ width:"48px", height:"38px", borderRadius:"8px", border:"1px solid rgba(13,27,42,0.15)", cursor:"pointer" }} />
                      <span style={{ fontSize:"13px", color:"rgba(13,27,42,0.5)" }}>{heroSlideForm.accent_color||"#C4930A"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                  <MediaUpload label="Slide Image" accept="image/jpeg,image/png,image/webp" folder="hero-slides"
                    onUpload={url => setHeroSlideForm((f:any) => ({...f, image_url:url}))} type="image" />
                  <MediaUpload label="Slide Video (optional)" accept="video/mp4,video/mov" folder="hero-slides"
                    onUpload={url => setHeroSlideForm((f:any) => ({...f, video_url:url}))} type="video" />
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={async () => {
                    if (!heroSlideForm.label) return showToast("❌ Label is required");
                    const res = await adminFetch("/api/hero-slides", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(heroSlideForm) });
                    const data = await res.json();
                    if (data.success) { await fetchHeroSlides(); setAddingHeroSlide(false); setHeroSlideForm({ label:"", subtitle:"", image_url:"", video_url:"", accent_color:"#C4930A" }); showToast("✅ Slide added!"); }
                    else showToast("❌ " + data.error);
                  }} style={{ padding:"11px 24px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, border:"none", borderRadius:"10px", cursor:"pointer", fontSize:"13px" }}>
                    <Save size={14} style={{ display:"inline", marginRight:"6px" }} /> Save Slide
                  </button>
                  <button onClick={() => { setAddingHeroSlide(false); setHeroSlideForm({ label:"", subtitle:"", image_url:"", video_url:"", accent_color:"#C4930A" }); }}
                    style={{ padding:"11px 18px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", cursor:"pointer", fontSize:"13px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setAddingHeroSlide(true); setHeroSlideForm({ label:"", subtitle:"", image_url:"", video_url:"", accent_color:"#C4930A" }); }}
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"13px 24px", borderRadius:"14px", border:"none", cursor:"pointer", fontSize:"14px" }}>
                <Plus size={16}/> Add New Hero Slide
              </button>
            )}

            {dbHeroSlides.length === 0 && !addingHeroSlide && (
              <div style={{ textAlign:"center", padding:"48px", background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", marginTop:"16px" }}>
                <p style={{ fontSize:"48px", marginBottom:"12px" }}>🖼️</p>
                <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"15px", marginBottom:"16px" }}>No hero slides yet. Add your first slide with a product image or video.</p>
              </div>
            )}
          </div>
        )}

        {/* TEAM & ACCESS */}
        {tab === "team" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
              <div>
                <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Team & Access</h1>
                <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>Manage admin panel members and permissions</p>
              </div>
              {currentUser?.role === "super_admin" && (
                <button onClick={async () => {
                  const res = await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"list_members" }) });
                  const data = await res.json();
                  if (data.data) setMembers(data.data);
                  setAddingMember(true);
                }} style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"11px 22px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                  <Plus size={15}/> Add Member
                </button>
              )}
            </div>

            {/* Current user card */}
            <div style={{ background:`rgba(196,147,10,0.06)`, borderRadius:"20px", border:`1px solid rgba(196,147,10,0.2)`, padding:"20px 24px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:`linear-gradient(135deg,${gold},${goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"18px", flexShrink:0 }}>
                {currentUser?.name?.charAt(0)||"A"}
              </div>
              <div>
                <p style={{ fontWeight:700, color:ink, fontSize:"15px", margin:"0 0 2px" }}>{currentUser?.name} <span style={{ fontSize:"11px", background:gold, color:"white", borderRadius:"6px", padding:"2px 8px", marginLeft:"6px", fontWeight:600 }}>{currentUser?.role?.replace("_"," ").toUpperCase()}</span></p>
                <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"13px", margin:0 }}>{currentUser?.email} · Currently logged in</p>
              </div>
              <button onClick={async () => {
                if (sessionId) {
                  await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ action:"logout", session_id:sessionId, email:currentUser?.email }) });
                }
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                localStorage.removeItem("adminSessionId");
                setAuthed(false); setCurrentUser(null); setLoginEmail(""); setLoginPassword("");
                setSessionId(null); setSessionStart(null); setSessionTime("0m"); setShowPassword(false);
              }}
                style={{ marginLeft:"auto", padding:"8px 16px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#ef4444" }}>
                Sign Out
              </button>
            </div>

            {/* Members list */}
            <div style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", overflow:"hidden", marginBottom:"20px" }}>
              <div style={{ padding:"20px 24px", borderBottom:"1px solid rgba(13,27,42,0.06)" }}>
                <button onClick={async () => {
                  const res = await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"list_members" }) });
                  const data = await res.json();
                  if (data.data) setMembers(data.data);
                }} style={{ background:"none", border:"none", cursor:"pointer", color:gold, fontSize:"13px", fontWeight:600 }}>↻ Load Members</button>
              </div>
              {members.length === 0 ? (
                <div style={{ padding:"40px", textAlign:"center", color:"rgba(13,27,42,0.35)", fontSize:"14px" }}>Click "Load Members" to see all admin users</div>
              ) : (
                <div>
                  {members.map((m: any) => (
                    <div key={m.id} style={{ display:"flex", alignItems:"center", gap:"16px", padding:"16px 24px", borderBottom:"1px solid rgba(13,27,42,0.05)", opacity: m.active ? 1 : 0.5 }}>
                      <div style={{ width:"40px", height:"40px", borderRadius:"50%", background: m.role === "super_admin" ? `linear-gradient(135deg,${gold},${goldLight})` : "rgba(13,27,42,0.08)", display:"flex", alignItems:"center", justifyContent:"center", color: m.role === "super_admin" ? "white" : ink, fontWeight:700, fontSize:"16px", flexShrink:0 }}>
                        {m.name?.charAt(0)}
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontWeight:600, color:ink, fontSize:"14px", margin:"0 0 3px" }}>
                          {m.name}
                          <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"6px", marginLeft:"8px", background: m.role === "super_admin" ? `rgba(196,147,10,0.1)` : "rgba(13,27,42,0.06)", color: m.role === "super_admin" ? gold : "rgba(13,27,42,0.5)" }}>
                            {m.role?.replace("_"," ").toUpperCase()}
                          </span>
                          {!m.active && <span style={{ fontSize:"10px", color:"#ef4444", marginLeft:"6px" }}>INACTIVE</span>}
                          {m.active_since && <span style={{ fontSize:"10px", color:"#16a34a", marginLeft:"6px", fontWeight:600 }}>● ONLINE NOW</span>}
                        </p>
                        <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"12px", margin:"0 0 4px" }}>{m.email}</p>
                        <div style={{ display:"flex", gap:"12px" }}>
                          {m.last_login && <span style={{ fontSize:"11px", color:"rgba(13,27,42,0.35)" }}>Last login: {new Date(m.last_login).toLocaleDateString("en-IN", {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>}
                          {m.total_time_minutes > 0 && <span style={{ fontSize:"11px", color:"rgba(13,27,42,0.35)" }}>Total: {Math.floor(m.total_time_minutes/60) > 0 ? `${Math.floor(m.total_time_minutes/60)}h ` : ""}{m.total_time_minutes%60}m</span>}
                          {m.total_sessions > 0 && <span style={{ fontSize:"11px", color:"rgba(13,27,42,0.35)" }}>{m.total_sessions} sessions</span>}
                        </div>
                      </div>
                      {currentUser?.role === "super_admin" && m.role !== "super_admin" && m.active === 1 && (
                        <button onClick={async () => {
                          if (!confirm(`Remove ${m.name} from admin access?`)) return;
                          await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"remove_member", email:m.email }) });
                          const res = await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"list_members" }) });
                          const data = await res.json();
                          if (data.data) setMembers(data.data);
                          showToast("🗑️ Member removed");
                        }} style={{ padding:"7px 14px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#ef4444" }}>Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add member form */}
            {addingMember && (
              <div style={{ background:"white", borderRadius:"20px", border:`1px solid rgba(196,147,10,0.25)`, padding:"28px" }}>
                <h3 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"20px", color:ink, margin:"0 0 20px", fontWeight:400 }}>Add New Member</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"14px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Full Name</label>
                    <input value={memberForm.name} onChange={e => setMemberForm(f => ({...f, name:e.target.value}))}
                      placeholder="Richa Kumar" style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Email</label>
                    <input type="email" value={memberForm.email} onChange={e => setMemberForm(f => ({...f, email:e.target.value}))}
                      placeholder="richa.k@silasya.com" style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Password</label>
                    <input type="password" value={memberForm.password} onChange={e => setMemberForm(f => ({...f, password:e.target.value}))}
                      placeholder="Min 8 characters" style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Role</label>
                    <select value={memberForm.role} onChange={e => setMemberForm(f => ({...f, role:e.target.value}))}
                      style={{ ...inputStyle, border:"1px solid rgba(13,27,42,0.15)", cursor:"pointer" }}>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={async () => {
                    if (!memberForm.name || !memberForm.email || !memberForm.password) return showToast("❌ Fill all fields");
                    if (memberForm.password.length < 8) return showToast("❌ Password min 8 characters");
                    const res = await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"add_member", ...memberForm }) });
                    const data = await res.json();
                    if (data.success) {
                      showToast("✅ Member added!");
                      setAddingMember(false);
                      setMemberForm({ name:"", email:"", password:"", role:"admin" });
                      const r2 = await adminFetch("/api/admin-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"list_members" }) });
                      const d2 = await r2.json();
                      if (d2.data) setMembers(d2.data);
                    } else showToast("❌ " + data.error);
                  }} style={{ padding:"11px 24px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, border:"none", borderRadius:"10px", cursor:"pointer", fontSize:"13px" }}>
                    <Save size={14} style={{ display:"inline", marginRight:"6px" }} /> Add Member
                  </button>
                  <button onClick={() => setAddingMember(false)}
                    style={{ padding:"11px 18px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", cursor:"pointer", fontSize:"13px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div style={{ background:"white", borderRadius:"24px", padding:"32px", width:"580px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto" as const }}>
              <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:"#0D1B2A", margin:"0 0 24px", fontWeight:400 }}>Edit Product</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Emoji</label>
                    <input value={editingProduct.emoji||""} onChange={e => setEditingProduct((p: any) => ({ ...p, emoji: e.target.value }))}
                      style={{ width:"100%", padding:"10px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"22px", textAlign:"center", outline:"none", boxSizing:"border-box" as const }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Name</label>
                    <input value={editingProduct.name||""} onChange={e => setEditingProduct((p: any) => ({ ...p, name: e.target.value }))}
                      style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Category</label>
                  <select value={editingProduct.category||"spices"} onChange={e => setEditingProduct((p: any) => ({ ...p, category: e.target.value }))}
                    style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const }}>
                    <option value="spices">Spices</option>
                    <option value="commodities">Commodities</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Tagline</label>
                  <input value={editingProduct.tagline||""} onChange={e => setEditingProduct((p: any) => ({ ...p, tagline: e.target.value }))}
                    style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const }} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Description</label>
                  <textarea value={editingProduct.description||""} onChange={e => setEditingProduct((p: any) => ({ ...p, description: e.target.value }))} rows={3}
                    style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const, resize:"none" as const }} />
                </div>
                <MediaUpload
                  label="Product Image"
                  accept="image/jpeg,image/png,image/webp"
                  folder="products"
                  currentUrl={editingProduct.hero_image||""}
                  onUpload={url => setEditingProduct((p: any) => ({ ...p, hero_image: url }))}
                  type="image"
                />
              </div>
              <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
                <button onClick={async () => {
                  const payload = {
                    id: editingProduct.id,
                    name: editingProduct.name||null,
                    emoji: editingProduct.emoji||null,
                    category: editingProduct.category||null,
                    tagline: editingProduct.tagline||null,
                    description: editingProduct.description||null,
                    hero_color: editingProduct.hero_color||null,
                    hero_image: editingProduct.hero_image||null,
                    active: editingProduct.active !== false ? 1 : 0,
                  };
                  const res = await adminFetch("/api/products", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
                  const data = await res.json();
                  if (data.success) { await fetchAll(); setEditingProduct(null); showToast("✅ Product updated!"); }
                  else showToast("❌ " + (data.error||"Error"));
                }} style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, border:"none", borderRadius:"12px", cursor:"pointer", fontSize:"14px" }}>Save Changes</button>
                <button onClick={() => setEditingProduct(null)} style={{ padding:"12px 20px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", cursor:"pointer", fontSize:"14px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT VARIETY MODAL */}
        {editingVariety && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <div style={{ background:"white", borderRadius:"24px", padding:"32px", width:"580px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto" as const }}>
              <h2 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:"#0D1B2A", margin:"0 0 24px", fontWeight:400 }}>Edit Variety</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                {[
                  { label:"Name", key:"name" },
                  { label:"Origin", key:"origin" },
                  { label:"Min. Order", key:"min_order" },
                  { label:"Grade", key:"grade" },
                  { label:"Moisture %", key:"moisture" },
                  { label:"Packing", key:"packing" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>{f.label}</label>
                    <input value={editingVariety[f.key]||""} onChange={e => setEditingVariety((v: any) => ({ ...v, [f.key]: e.target.value }))}
                      style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const }} />
                  </div>
                ))}
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px", textTransform:"uppercase" }}>Description</label>
                  <textarea value={editingVariety.description||""} onChange={e => setEditingVariety((v: any) => ({ ...v, description: e.target.value }))} rows={2}
                    style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", fontSize:"13px", color:"#0D1B2A", outline:"none", boxSizing:"border-box" as const, resize:"none" as const }} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"8px", textTransform:"uppercase" }}>Product Images</label>
                  {/* Show existing images */}
                  {(() => {
                    const imgs = [
                      ...(editingVariety.image ? [editingVariety.image] : []),
                      ...(editingVariety.images ? (typeof editingVariety.images === "string" ? JSON.parse(editingVariety.images||"[]") : editingVariety.images) : [])
                    ].filter(Boolean);
                    return imgs.length > 0 ? (
                      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
                        {imgs.map((img: string, i: number) => (
                          <div key={i} style={{ position:"relative" }}>
                            <img src={img} alt="" style={{ width:"72px", height:"72px", objectFit:"cover", borderRadius:"8px", border:"1px solid rgba(13,27,42,0.1)" }} />
                            <button onClick={() => {
                              const allImgs = imgs.filter((_: string, idx: number) => idx !== i);
                              setEditingVariety((v: any) => ({ ...v, image: allImgs[0]||null, images: allImgs.slice(1) }));
                            }} style={{ position:"absolute", top:"-6px", right:"-6px", background:"#ef4444", color:"white", border:"none", borderRadius:"50%", width:"18px", height:"18px", cursor:"pointer", fontSize:"11px", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>×</button>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                  <MediaUpload
                    label="Add Image"
                    accept="image/jpeg,image/png,image/webp"
                    folder="products"
                    onUpload={url => setEditingVariety((v: any) => {
                      if (!v.image) return { ...v, image: url };
                      const existing = v.images ? (typeof v.images === "string" ? JSON.parse(v.images||"[]") : v.images) : [];
                      return { ...v, images: [...existing, url] };
                    })}
                    type="image"
                  />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <MediaUpload
                    label="Variety Video (optional)"
                    accept="video/mp4,video/mov,video/avi"
                    folder="videos"
                    currentUrl={editingVariety.video||""}
                    onUpload={url => setEditingVariety((v: any) => ({ ...v, video: url }))}
                    type="video"
                  />
                </div>
              </div>
              <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
                <button onClick={async () => {
                  const { product_id, ...updates } = editingVariety;
                  const images = updates.images ? (typeof updates.images === "string" ? updates.images : JSON.stringify(updates.images)) : null;
                  const payload = {
                    id: updates.id,
                    product_id,
                    name: updates.name||null,
                    origin: updates.origin||null,
                    grade: updates.grade||null,
                    min_order: updates.min_order||null,
                    moisture: updates.moisture||null,
                    packing: updates.packing||null,
                    image: updates.image||null,
                    images,
                    video: updates.video||null,
                    description: updates.description||null,
                  };
                  const res = await adminFetch("/api/varieties", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
                  const data = await res.json();
                  if (data.success) { await fetchAll(); setEditingVariety(null); showToast("✅ Variety updated!"); }
                  else showToast("❌ " + (data.error||"Error"));
                }} style={{ flex:1, padding:"12px", background:"linear-gradient(135deg,#C4930A,#E8A020)", color:"white", fontWeight:700, border:"none", borderRadius:"12px", cursor:"pointer", fontSize:"14px" }}>Save Changes</button>
                <button onClick={() => setEditingVariety(null)} style={{ padding:"12px 20px", background:"none", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"12px", cursor:"pointer", fontSize:"14px", color:"rgba(13,27,42,0.5)" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* INQUIRIES */}
        {tab === "inquiries" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
              <div>
                <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Inquiries</h1>
                <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>{newCount} new · {inquiries.length} total</p>
              </div>
              <button onClick={fetchAll} style={{ padding:"8px 16px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", background:"white", cursor:"pointer", fontSize:"13px", fontWeight:600, color:ink }}>↻ Refresh</button>
            </div>
            {loading ? (
              <div style={{ textAlign:"center", padding:"48px", color:"rgba(13,27,42,0.3)" }}>Loading...</div>
            ) : inquiries.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 24px", background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)" }}>
                <p style={{ fontSize:"48px", marginBottom:"16px" }}>📬</p>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:ink, margin:"0 0 8px", fontWeight:400 }}>No inquiries yet</p>
                <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"14px" }}>When customers submit the quote form, they'll appear here.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {inquiries.map(inq => (
                  <div key={inq.id} style={{ background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)", padding:"20px 24px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                          <p style={{ fontWeight:700, color:ink, fontSize:"15px", margin:0 }}>{inq.name}</p>
                          <span style={{ fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"8px", background: inq.status === "new" ? gold : "rgba(13,27,42,0.08)", color: inq.status === "new" ? "white" : "rgba(13,27,42,0.5)" }}>{inq.status}</span>
                          <span style={{ fontSize:"11px", color:"rgba(13,27,42,0.35)", marginLeft:"auto" }}>{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"8px" }}>
                          {[
                            { label:"Product", value:inq.product },
                            { label:"Quantity", value:`${inq.quantity} ${inq.unit}` },
                            { label:"Country", value:inq.country },
                            { label:"Incoterm", value:inq.incoterm || "—" },
                          ].map(d => (
                            <div key={d.label}>
                              <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 3px", fontWeight:600 }}>{d.label}</p>
                              <p style={{ color:ink, fontSize:"13px", fontWeight:600, margin:0 }}>{d.value}</p>
                            </div>
                          ))}
                        </div>
                        {inq.spec && <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"12px", margin:"4px 0 0" }}>Spec: {inq.spec} {inq.port ? `· Port: ${inq.port}` : ""}</p>}
                        {inq.message && <p style={{ color:"rgba(13,27,42,0.5)", fontSize:"12px", margin:"4px 0 0", fontStyle:"italic" }}>"{inq.message}"</p>}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"8px", flexShrink:0 }}>
                        <a href={`mailto:${inq.email}`} style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"12px", padding:"8px 14px", background:cream, border:"1px solid rgba(13,27,42,0.1)", borderRadius:"10px", textDecoration:"none", color:ink, fontWeight:600 }}>✉️ {inq.email}</a>
                        {inq.phone && <a href={`https://wa.me/${inq.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"12px", padding:"8px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"10px", textDecoration:"none", color:"#16a34a", fontWeight:600 }}>💬 WhatsApp</a>}
                        {inq.status === "new" && (
                          <button onClick={async () => {
                            await adminFetch("/api/inquiries", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:inq.id, status:"replied" }) });
                            setInquiries(iq => iq.map(i => i.id === inq.id ? { ...i, status:"replied" } : i));
                            showToast("✅ Marked as replied");
                          }} style={{ display:"inline-flex", alignItems:"center", gap:"6px", fontSize:"12px", padding:"8px 14px", background:`rgba(196,147,10,0.08)`, border:`1px solid rgba(196,147,10,0.25)`, borderRadius:"10px", cursor:"pointer", color:gold, fontWeight:700 }}>
                            <Check size={13}/> Mark Replied
                          </button>
                        )}
                        <button onClick={async () => {
                          if (!confirm("Delete this inquiry?")) return;
                          await adminFetch("/api/inquiries", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:inq.id }) });
                          setInquiries(iq => iq.filter(i => i.id !== inq.id));
                          showToast("🗑️ Deleted");
                        }} style={{ fontSize:"12px", padding:"8px 14px", border:"1px solid #fecaca", background:"#fef2f2", borderRadius:"10px", cursor:"pointer", color:"#ef4444", fontWeight:600 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FEEDBACK */}
        {tab === "feedback" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
              <div>
                <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Buyer Feedback</h1>
                <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>{pendingFeedback} pending · {feedback.length} total</p>
              </div>
              <button onClick={fetchAll} style={{ padding:"8px 16px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", background:"white", cursor:"pointer", fontSize:"13px", fontWeight:600, color:ink }}>↻ Refresh</button>
            </div>
            {feedback.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 24px", background:"white", borderRadius:"20px", border:"1px solid rgba(13,27,42,0.07)" }}>
                <p style={{ fontSize:"48px", marginBottom:"16px" }}>⭐</p>
                <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"24px", color:ink, margin:"0 0 8px", fontWeight:400 }}>No feedback yet</p>
                <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"14px" }}>When customers submit feedback on the homepage, it'll appear here for your approval.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                {feedback.map(f => (
                  <div key={f.id} style={{ background:"white", borderRadius:"20px", border: f.approved ? "1px solid #bbf7d0" : "1px solid rgba(13,27,42,0.07)", padding:"24px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                      <div>
                        <p style={{ fontWeight:700, color:ink, fontSize:"14px", margin:"0 0 2px" }}>{f.name}</p>
                        {f.company && <p style={{ color:"rgba(13,27,42,0.45)", fontSize:"12px", margin:0 }}>{f.company}</p>}
                        <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"11px", margin:"2px 0 0" }}>{f.country} · {new Date(f.created_at).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <Stars rating={f.rating} />
                        {f.approved && <span style={{ fontSize:"10px", background:"#dcfce7", color:"#16a34a", padding:"2px 8px", borderRadius:"6px", fontWeight:700 }}>Live</span>}
                      </div>
                    </div>
                    <p style={{ color:"rgba(13,27,42,0.65)", fontSize:"13px", lineHeight:1.7, margin:"0 0 16px", fontStyle:"italic" }}>"{f.message}"</p>
                    <div style={{ display:"flex", gap:"8px" }}>
                      {!f.approved ? (
                        <button onClick={async () => {
                          await adminFetch("/api/feedback", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:f.id, approved:true }) });
                          setFeedback(fb => fb.map(x => x.id === f.id ? { ...x, approved:true } : x));
                          showToast("✅ Feedback approved & live!");
                        }} style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"12px", padding:"8px 16px", background:"#16a34a", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:700 }}>
                          <Check size={12}/> Approve & Show on Site
                        </button>
                      ) : (
                        <button onClick={async () => {
                          await adminFetch("/api/feedback", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:f.id, approved:false }) });
                          setFeedback(fb => fb.map(x => x.id === f.id ? { ...x, approved:false } : x));
                          showToast("Feedback removed from site");
                        }} style={{ fontSize:"12px", padding:"8px 16px", border:"1px solid rgba(13,27,42,0.15)", background:"white", borderRadius:"8px", cursor:"pointer", color:"rgba(13,27,42,0.5)", fontWeight:600 }}>
                          Remove from site
                        </button>
                      )}
                      <button onClick={async () => {
                        if (!confirm("Delete this feedback?")) return;
                        await adminFetch("/api/feedback", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:f.id }) });
                        setFeedback(fb => fb.filter(x => x.id !== f.id));
                        showToast("🗑️ Deleted");
                      }} style={{ fontSize:"12px", padding:"8px 16px", border:"1px solid #fecaca", background:"#fef2f2", borderRadius:"8px", cursor:"pointer", color:"#ef4444", fontWeight:600 }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS */}
        {tab === "testimonials" && (
          <div style={{ padding:"40px 48px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
              <div>
                <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 6px", fontWeight:400 }}>Testimonials</h1>
                <p style={{ color:"rgba(13,27,42,0.45)", margin:0, fontSize:"14px" }}>{testimonials.filter(t => t.active).length} live · {testimonials.length} total</p>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={fetchAll} style={{ padding:"8px 16px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", background:"white", cursor:"pointer", fontSize:"13px", fontWeight:600, color:ink }}>↻ Refresh</button>
                <button onClick={() => { setEditingT({ id:"", name:"", company:"", country:"", role:"", rating:5, message:"", active:true }); setTForm({ name:"", company:"", country:"", role:"", rating:5, message:"", active:true }); }}
                  style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                  <Plus size={15}/> Add Testimonial
                </button>
              </div>
            </div>

            {editingT !== null && (
              <div style={{ background:`rgba(196,147,10,0.05)`, border:`1px solid rgba(196,147,10,0.2)`, borderRadius:"20px", padding:"28px", marginBottom:"28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
                  <p style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"18px", color:ink, margin:0, fontWeight:400 }}>{editingT.id ? "Edit" : "New"} Testimonial</p>
                  <button onClick={() => setEditingT(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.4)" }}><X size={18}/></button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"12px", marginBottom:"12px" }}>
                  {[
                    { label:"Name *", key:"name", placeholder:"Buyer name" },
                    { label:"Company", key:"company", placeholder:"Company name" },
                    { label:"Country", key:"country", placeholder:"e.g. UAE" },
                    { label:"Role", key:"role", placeholder:"e.g. Import Manager" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>{f.label}</label>
                      <input value={(tForm as any)[f.key]} onChange={e => setTForm(t => ({ ...t, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:"12px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"8px" }}>Rating</label>
                  <div style={{ display:"flex", gap:"6px" }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setTForm(t => ({ ...t, rating:n }))}
                        style={{ background:"none", border:"none", cursor:"pointer", fontSize:"28px", color: n <= tForm.rating ? gold : "rgba(13,27,42,0.15)", padding:0 }}>★</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:"20px" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", display:"block", marginBottom:"6px" }}>Message *</label>
                  <textarea value={tForm.message} onChange={e => setTForm(t => ({ ...t, message:e.target.value }))} placeholder="Buyer's review..." rows={3} style={{ ...inputStyle, resize:"none" }} />
                </div>
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={async () => {
                    if (!tForm.name || !tForm.message) return;
                    if (editingT.id) {
                      await adminFetch("/api/testimonials", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:editingT.id, ...tForm }) });
                      setTestimonials(ts => ts.map(x => x.id === editingT.id ? { ...x, ...tForm } : x));
                      showToast("✅ Testimonial updated!");
                    } else {
                      const res = await adminFetch("/api/testimonials", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(tForm) });
                      const data = await res.json();
                      if (data.data) setTestimonials(ts => [data.data[0], ...ts]);
                      showToast("✅ Testimonial added & live!");
                    }
                    setEditingT(null);
                  }} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"10px", border:"none", cursor:"pointer", fontSize:"13px" }}>
                    <Save size={14}/> Save
                  </button>
                  <button onClick={() => setEditingT(null)} style={{ padding:"10px 16px", background:"none", border:"none", cursor:"pointer", color:"rgba(13,27,42,0.5)", fontSize:"13px" }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ background:"white", borderRadius:"20px", border: t.active ? `1px solid rgba(196,147,10,0.25)` : "1px solid rgba(13,27,42,0.07)", padding:"24px", opacity: t.active ? 1 : 0.6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                    <Stars rating={t.rating} />
                    <span style={{ fontSize:"10px", fontWeight:700, padding:"3px 10px", borderRadius:"8px", background: t.active ? `rgba(196,147,10,0.1)` : "rgba(13,27,42,0.06)", color: t.active ? gold : "rgba(13,27,42,0.4)" }}>
                      {t.active ? "LIVE" : "HIDDEN"}
                    </span>
                  </div>
                  <p style={{ color:"rgba(13,27,42,0.65)", fontSize:"13px", lineHeight:1.7, fontStyle:"italic", margin:"0 0 16px" }}>"{t.message}"</p>
                  <p style={{ fontWeight:700, color:ink, fontSize:"13px", margin:"0 0 2px" }}>{t.name}</p>
                  <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"11px", margin:"0 0 16px" }}>{[t.role, t.company, t.country].filter(Boolean).join(" · ")}</p>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={() => { setEditingT(t); setTForm({ name:t.name, company:t.company, country:t.country, role:t.role, rating:t.rating, message:t.message, active:t.active }); }}
                      style={{ fontSize:"11px", padding:"6px 12px", border:"1px solid rgba(13,27,42,0.12)", background:"white", borderRadius:"8px", cursor:"pointer", color:"rgba(13,27,42,0.6)", fontWeight:600 }}>Edit</button>
                    <button onClick={async () => {
                      await adminFetch("/api/testimonials", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:t.id, active:!t.active }) });
                      setTestimonials(ts => ts.map(x => x.id === t.id ? { ...x, active:!x.active } : x));
                      showToast(t.active ? "Hidden from site" : "✅ Now live on site!");
                    }} style={{ fontSize:"11px", padding:"6px 12px", border:"1px solid rgba(13,27,42,0.12)", background:"white", borderRadius:"8px", cursor:"pointer", color:"rgba(13,27,42,0.6)", fontWeight:600 }}>
                      {t.active ? "Hide" : "Show"}
                    </button>
                    <button onClick={async () => {
                      if (!confirm("Delete this testimonial?")) return;
                      await adminFetch("/api/testimonials", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id:t.id }) });
                      setTestimonials(ts => ts.filter(x => x.id !== t.id));
                      showToast("🗑️ Deleted");
                    }} style={{ fontSize:"11px", padding:"6px 12px", border:"1px solid #fecaca", background:"#fef2f2", borderRadius:"8px", cursor:"pointer", color:"#ef4444", fontWeight:600 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATALOGUE */}
        {tab === "catalogue" && (
          <div style={{ padding:"40px 48px", maxWidth:"600px" }}>
            <h1 style={{ fontFamily:"DM Serif Display,Georgia,serif", fontSize:"32px", color:ink, margin:"0 0 8px", fontWeight:400 }}>Catalogue</h1>
            <p style={{ color:"rgba(13,27,42,0.45)", margin:"0 0 32px", fontSize:"14px" }}>Manage the downloadable export catalogue PDF shown on your website.</p>
            <div style={{ background:"white", borderRadius:"16px", border:"1px solid rgba(13,27,42,0.07)", padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px", marginBottom:"24px" }}>
              <div style={{ width:"48px", height:"48px", background:`rgba(196,147,10,0.1)`, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px" }}>📄</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700, color:ink, fontSize:"14px", margin:"0 0 2px" }}>Shumitra_Export_Catalogue.pdf</p>
                <p style={{ color:"rgba(13,27,42,0.4)", fontSize:"12px", margin:0 }}>Current live catalogue</p>
              </div>
              <a href="/Shumitra_Export_Catalogue.pdf" download style={{ fontSize:"12px", padding:"8px 16px", border:"1px solid rgba(13,27,42,0.12)", borderRadius:"10px", textDecoration:"none", color:ink, fontWeight:600 }}>Download</a>
            </div>
            <div style={{ border:`2px dashed ${catalogueFile ? gold : "rgba(13,27,42,0.15)"}`, borderRadius:"16px", padding:"48px 24px", textAlign:"center", background: catalogueFile ? `rgba(196,147,10,0.04)` : "white", marginBottom:"16px" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>📁</div>
              <p style={{ fontWeight:600, color:ink, fontSize:"14px", margin:"0 0 6px" }}>{catalogueFile ? catalogueFile.name : "Select new PDF to replace"}</p>
              <p style={{ color:"rgba(13,27,42,0.35)", fontSize:"12px", margin:"0 0 20px" }}>Drop in /public/ folder and rename to Shumitra_Export_Catalogue.pdf</p>
              <label style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"10px 20px", borderRadius:"10px", cursor:"pointer", fontSize:"13px" }}>
                Choose PDF
                <input type="file" accept=".pdf" style={{ display:"none" }} onChange={e => { setCatalogueFile(e.target.files?.[0] || null); setCatalogueMsg(""); }} />
              </label>
            </div>
            {catalogueFile && (
              <button onClick={() => { showToast("✅ Drop " + catalogueFile.name + " into /public/ folder and rename it."); setCatalogueMsg("Drop the file into /public/Shumitra_Export_Catalogue.pdf"); }}
                style={{ width:"100%", background:`linear-gradient(135deg,${gold},${goldLight})`, color:"white", fontWeight:700, padding:"13px", borderRadius:"12px", border:"none", cursor:"pointer", fontSize:"14px", marginBottom:"12px" }}>
                How to Upload
              </button>
            )}
            {catalogueMsg && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"12px", padding:"16px", color:"#16a34a", fontSize:"13px" }}>{catalogueMsg}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

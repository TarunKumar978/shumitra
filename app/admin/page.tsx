"use client";
import { useState } from "react";
import { products as initialProducts } from "@/lib/data";
import type { Product, Variety } from "@/lib/data";
import { Plus, Edit, Trash2, Eye, EyeOff, Video, Package, Mail, LayoutDashboard, ChevronRight, X, Save } from "lucide-react";

const ADMIN_PASSWORD = "shumitra2025";

type Inquiry = { id: string; name: string; product: string; quantity: string; country: string; email: string; phone: string; date: string; status: "new" | "replied"; };

const demoInquiries: Inquiry[] = [
  { id: "1", name: "Ahmed Al Rashidi", product: "Turmeric - Erode", quantity: "5 MT", country: "UAE", email: "ahmed@trading.ae", phone: "+971501234567", date: "2025-01-15", status: "new" },
  { id: "2", name: "Hans Mueller", product: "Black Pepper - Tellicherry", quantity: "2 MT", country: "Germany", email: "hans@spicehaus.de", phone: "+4917612345678", date: "2025-01-14", status: "replied" },
  { id: "3", name: "Maria Santos", product: "Basmati Rice 1121", quantity: "20 MT", country: "Brazil", email: "maria@imports.br", phone: "+5511987654321", date: "2025-01-13", status: "new" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "products" | "inquiries">("dashboard");
  const [prods, setProds] = useState<Product[]>(initialProducts);
  const [inquiries, setInquiries] = useState<Inquiry[]>(demoInquiries);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingVariety, setAddingVariety] = useState<string | null>(null);
  const [newVariety, setNewVariety] = useState<Partial<Variety>>({});
  const [hidden, setHidden] = useState<string[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-saffron rounded-2xl flex items-center justify-center text-ink font-serif font-bold text-xl mx-auto mb-4">S</div>
            <h1 className="font-serif text-2xl text-ink">Admin Panel</h1>
            <p className="text-ink/50 text-sm mt-1">Shumitra Exports</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-ink/70 text-sm font-medium block mb-2">Password</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-ink/15 rounded-xl focus:outline-none focus:border-saffron transition-colors text-ink"
              />
              {pwError && <p className="text-red-500 text-xs mt-1.5">Incorrect password</p>}
            </div>
            <button type="submit" className="w-full btn-primary justify-center">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const newCount = inquiries.filter(i => i.status === "new").length;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-white flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center text-ink font-bold">S</div>
            <div>
              <p className="font-serif text-base font-bold">Shumitra</p>
              <p className="text-[10px] text-saffron tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
            { id: "products", icon: <Package size={17} />, label: "Products" },
            { id: "inquiries", icon: <Mail size={17} />, label: `Inquiries ${newCount > 0 ? `(${newCount})` : ""}` },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id as typeof tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                tab === item.id ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => setAuthed(false)} className="w-full text-white/40 hover:text-white text-sm py-2 transition-colors text-left px-4">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="p-8">
            <h1 className="font-serif text-3xl text-ink mb-2">Good morning 👋</h1>
            <p className="text-ink/50 mb-8">Here's an overview of Shumitra Exports</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: prods.length, sub: "across all categories" },
                { label: "New Inquiries", value: newCount, sub: "awaiting response", hot: true },
                { label: "Countries", value: 29, sub: "export destinations" },
                { label: "Hidden Products", value: hidden.length, sub: "not shown on site" },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl p-5 border ${s.hot ? "bg-saffron/10 border-saffron/25" : "bg-white border-ink/8"}`}>
                  <p className="text-ink/50 text-xs font-medium mb-1">{s.label}</p>
                  <p className="font-serif text-3xl text-ink font-bold">{s.value}</p>
                  <p className="text-ink/40 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-ink/8 p-6">
              <h3 className="font-serif text-lg text-ink mb-4">Recent Inquiries</h3>
              <div className="space-y-3">
                {inquiries.slice(0, 3).map(inq => (
                  <div key={inq.id} className="flex items-center justify-between p-4 bg-cream rounded-xl">
                    <div>
                      <p className="font-semibold text-ink text-sm">{inq.name} — {inq.country}</p>
                      <p className="text-ink/50 text-xs mt-0.5">{inq.product} · {inq.quantity}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-xl ${inq.status === "new" ? "bg-saffron text-ink" : "bg-ink/10 text-ink/60"}`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab("inquiries")} className="mt-4 text-saffron text-sm font-medium hover:text-saffron-dark transition-colors flex items-center gap-1">
                View all inquiries <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl text-ink mb-1">Products</h1>
                <p className="text-ink/50">{prods.length} products, {prods.reduce((a, p) => a + p.varieties.length, 0)} varieties total</p>
              </div>
              <button className="btn-primary text-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="space-y-4">
              {prods.map(product => (
                <div key={product.id} className={`bg-white rounded-2xl border border-ink/8 overflow-hidden ${hidden.includes(product.id) ? "opacity-50" : ""}`}>
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{product.emoji}</span>
                      <div>
                        <p className="font-semibold text-ink">{product.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs capitalize text-ink/50 bg-cream border border-ink/10 rounded-lg px-2 py-0.5">{product.category}</span>
                          <span className="text-xs text-ink/50">{product.varieties.length} varieties</span>
                          {hidden.includes(product.id) && <span className="text-xs text-red-400 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5">Hidden</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Video upload */}
                      <button className="flex items-center gap-1.5 text-xs px-3 py-2 bg-saffron/10 text-saffron-dark border border-saffron/20 rounded-xl hover:bg-saffron/20 transition-all font-medium">
                        <Video size={13} /> Add Video
                      </button>
                      {/* Hide/show */}
                      <button onClick={() => setHidden(h => h.includes(product.id) ? h.filter(x => x !== product.id) : [...h, product.id])}
                        className="p-2.5 rounded-xl border border-ink/10 hover:bg-cream transition-all text-ink/50 hover:text-ink">
                        {hidden.includes(product.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => setEditingProduct(product)}
                        className="p-2.5 rounded-xl border border-ink/10 hover:bg-cream transition-all text-ink/50 hover:text-ink">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Varieties */}
                  <div className="border-t border-ink/5 px-5 pb-5">
                    <div className="flex items-center justify-between pt-4 mb-3">
                      <p className="text-xs font-semibold text-ink/40 uppercase tracking-wider">Varieties</p>
                      <button onClick={() => setAddingVariety(product.id)}
                        className="flex items-center gap-1 text-xs text-saffron font-medium hover:text-saffron-dark transition-colors">
                        <Plus size={12} /> Add Variety
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.varieties.map(v => (
                        <div key={v.id} className="flex items-center justify-between bg-cream rounded-xl px-4 py-2.5">
                          <div>
                            <p className="text-sm font-medium text-ink">{v.name}</p>
                            <p className="text-xs text-ink/50">{v.origin} · MOQ: {v.minOrder}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button className="p-1.5 rounded-lg hover:bg-ink/5 text-ink/40 hover:text-ink transition-all"><Edit size={13} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-ink/40 hover:text-red-500 transition-all"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add variety inline form */}
                    {addingVariety === product.id && (
                      <div className="mt-4 bg-saffron/5 border border-saffron/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-semibold text-ink text-sm">New Variety for {product.name}</p>
                          <button onClick={() => setAddingVariety(null)} className="text-ink/40 hover:text-ink"><X size={16} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Variety Name", key: "name", placeholder: "e.g. Erode Premium" },
                            { label: "Origin", key: "origin", placeholder: "e.g. Erode, Tamil Nadu" },
                            { label: "Grade", key: "grade", placeholder: "e.g. Export Grade" },
                            { label: "Min. Order", key: "minOrder", placeholder: "e.g. 500 kg" },
                            { label: "Moisture %", key: "moisture", placeholder: "e.g. ≤ 10%" },
                            { label: "Color", key: "color", placeholder: "e.g. Deep Yellow" },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="text-xs font-medium text-ink/60 block mb-1">{f.label}</label>
                              <input placeholder={f.placeholder}
                                onChange={e => setNewVariety(v => ({ ...v, [f.key]: e.target.value }))}
                                className="w-full px-3 py-2 border border-ink/15 rounded-xl bg-white text-sm text-ink focus:outline-none focus:border-saffron transition-colors"
                              />
                            </div>
                          ))}
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-ink/60 block mb-1">Description</label>
                            <textarea placeholder="Describe this variety..."
                              onChange={e => setNewVariety(v => ({ ...v, description: e.target.value }))}
                              className="w-full px-3 py-2 border border-ink/15 rounded-xl bg-white text-sm text-ink focus:outline-none focus:border-saffron transition-colors resize-none" rows={2}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs font-medium text-ink/60 block mb-1">Packing Options (comma separated)</label>
                            <input placeholder="25 kg PP bags, 50 kg jute bags"
                              className="w-full px-3 py-2 border border-ink/15 rounded-xl bg-white text-sm text-ink focus:outline-none focus:border-saffron transition-colors"
                            />
                          </div>
                        </div>
                        {/* Video upload for variety */}
                        <div className="mt-3 border-2 border-dashed border-saffron/30 rounded-xl p-4 text-center cursor-pointer hover:border-saffron/60 transition-colors">
                          <p className="text-saffron text-sm font-medium">🎬 Upload variety video</p>
                          <p className="text-ink/40 text-xs mt-1">MP4, max 50MB — or paste YouTube/Vimeo link below</p>
                          <input placeholder="https://youtube.com/..." className="mt-2 w-full px-3 py-1.5 border border-ink/10 rounded-lg bg-white text-xs text-ink focus:outline-none" />
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="btn-primary text-sm">
                            <Save size={14} /> Save Variety
                          </button>
                          <button onClick={() => setAddingVariety(null)} className="px-4 py-2 text-ink/60 text-sm hover:text-ink transition-colors">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries */}
        {tab === "inquiries" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif text-3xl text-ink mb-1">Inquiries</h1>
                <p className="text-ink/50">{newCount} new, {inquiries.length} total</p>
              </div>
              <button className="flex items-center gap-2 text-sm px-4 py-2.5 border border-ink/15 rounded-xl text-ink/70 hover:text-ink hover:border-ink/30 transition-all font-medium">
                Export CSV
              </button>
            </div>

            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="bg-white rounded-2xl border border-ink/8 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-ink">{inq.name}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${inq.status === "new" ? "bg-saffron text-ink" : "bg-ink/8 text-ink/50"}`}>{inq.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div><span className="text-ink/40 text-xs block">Product</span><span className="text-ink font-medium">{inq.product}</span></div>
                        <div><span className="text-ink/40 text-xs block">Quantity</span><span className="text-ink font-medium">{inq.quantity}</span></div>
                        <div><span className="text-ink/40 text-xs block">Country</span><span className="text-ink font-medium">{inq.country}</span></div>
                        <div><span className="text-ink/40 text-xs block">Date</span><span className="text-ink font-medium">{inq.date}</span></div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={`mailto:${inq.email}`}
                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-cream border border-ink/10 rounded-xl hover:bg-ink/5 transition-all text-ink font-medium">
                        ✉️ Email
                      </a>
                      <a href={`https://wa.me/${inq.phone.replace(/\D/g,"")}`} target="_blank"
                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-all text-green-700 font-medium">
                        💬 WhatsApp
                      </a>
                      {inq.status === "new" && (
                        <button onClick={() => setInquiries(iq => iq.map(i => i.id === inq.id ? { ...i, status: "replied" } : i))}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-saffron/10 border border-saffron/25 rounded-xl hover:bg-saffron/20 transition-all text-saffron-dark font-medium">
                          ✓ Mark Replied
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

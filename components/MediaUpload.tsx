"use client";
import { useState } from "react";

interface MediaUploadProps {
  label: string;
  accept: string;
  folder: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  type?: "image" | "video";
}

export default function MediaUpload({ label, accept, folder, currentUrl, onUpload, type = "image" }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [urlInput, setUrlInput] = useState(currentUrl || "");
  const [mode, setMode] = useState<"url"|"upload">("upload");

  const gold = "#C4930A";
  const ink = "#0D1B2A";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method:"POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        setUrlInput(data.url);
        onUpload(data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Upload failed. Try using URL instead.");
    }
    setUploading(false);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
        <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(13,27,42,0.5)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</label>
        <div style={{ display:"flex", gap:"4px" }}>
          <button type="button" onClick={() => setMode("upload")}
            style={{ fontSize:"10px", padding:"3px 10px", borderRadius:"6px", border:`1px solid ${mode==="upload" ? gold : "rgba(13,27,42,0.12)"}`, background: mode==="upload" ? `rgba(196,147,10,0.08)` : "white", color: mode==="upload" ? gold : "rgba(13,27,42,0.5)", cursor:"pointer", fontWeight:600 }}>
            Upload
          </button>
          <button type="button" onClick={() => setMode("url")}
            style={{ fontSize:"10px", padding:"3px 10px", borderRadius:"6px", border:`1px solid ${mode==="url" ? gold : "rgba(13,27,42,0.12)"}`, background: mode==="url" ? `rgba(196,147,10,0.08)` : "white", color: mode==="url" ? gold : "rgba(13,27,42,0.5)", cursor:"pointer", fontWeight:600 }}>
            URL
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input type="text"
          placeholder={type === "video" ? "https://youtube.com/... or /videos/name.mp4" : "https://images.unsplash.com/... or /products/name.jpg"}
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); setPreview(e.target.value); onUpload(e.target.value); }}
          style={{ width:"100%", padding:"10px 14px", border:"1px solid rgba(13,27,42,0.15)", borderRadius:"10px", background:"white", fontSize:"13px", color:ink, outline:"none", boxSizing:"border-box" as const, fontFamily:"DM Sans,sans-serif" }}
        />
      ) : (
        <div>
          <label style={{ display:"block", cursor: uploading ? "not-allowed" : "pointer" }}>
            <div style={{ border:`2px dashed ${uploading ? gold : "rgba(13,27,42,0.2)"}`, borderRadius:"10px", padding:"24px", textAlign:"center", background: uploading ? `rgba(196,147,10,0.04)` : "#F5F0E8", transition:"all 0.2s" }}>
              {uploading ? (
                <div>
                  <p style={{ margin:"0 0 8px", fontSize:"28px" }}>⏳</p>
                  <p style={{ margin:"0 0 4px", fontSize:"14px", color:gold, fontWeight:700 }}>Uploading...</p>
                  <p style={{ margin:0, fontSize:"11px", color:"rgba(13,27,42,0.4)" }}>Please wait</p>
                </div>
              ) : (
                <div>
                  <p style={{ margin:"0 0 8px", fontSize:"32px" }}>{type === "video" ? "🎬" : "🖼️"}</p>
                  <p style={{ margin:"0 0 4px", fontSize:"14px", color:ink, fontWeight:700 }}>Click here to select file</p>
                  <p style={{ margin:"0 0 10px", fontSize:"11px", color:"rgba(13,27,42,0.4)" }}>{accept.replace(/image\//g,"").replace(/video\//g,"").replace(/,/g,", ").toUpperCase()}</p>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:gold, color:"white", padding:"8px 20px", borderRadius:"8px", fontSize:"12px", fontWeight:700 }}>
                    📁 Choose File & Upload
                  </div>
                </div>
              )}
            </div>
            <input type="file" accept={accept} style={{ display:"none" }} onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      )}

      {preview && type === "image" && (
        <div style={{ marginTop:"10px" }}>
          <div style={{ borderRadius:"10px", overflow:"hidden", maxHeight:"160px", position:"relative", border:"1px solid rgba(13,27,42,0.1)" }}>
            <img src={preview} alt="preview" style={{ width:"100%", height:"160px", objectFit:"cover", display:"block" }}
              onError={e => (e.currentTarget.style.display="none")} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
            <p style={{ position:"absolute", bottom:"8px", left:"12px", color:"white", fontSize:"11px", margin:0, fontWeight:600 }}>✅ Uploaded successfully</p>
          </div>
          <button type="button" onClick={() => { setPreview(""); setUrlInput(""); onUpload(""); }}
            style={{ marginTop:"8px", display:"inline-flex", alignItems:"center", gap:"6px", background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", padding:"7px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>
            🗑️ Remove Image
          </button>
        </div>
      )}
      {preview && type === "video" && (
        <div style={{ marginTop:"10px" }}>
          <div style={{ background:"rgba(13,27,42,0.04)", borderRadius:"10px", padding:"12px 16px", display:"flex", alignItems:"center", gap:"10px", border:"1px solid rgba(13,27,42,0.08)" }}>
            <span style={{ fontSize:"24px" }}>🎬</span>
            <div style={{ flex:1, overflow:"hidden" }}>
              <p style={{ margin:"0 0 2px", fontSize:"12px", fontWeight:700, color:"#16a34a" }}>✅ Uploaded successfully</p>
              <p style={{ margin:0, fontSize:"11px", color:"rgba(13,27,42,0.5)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{preview}</p>
            </div>
          </div>
          <button type="button" onClick={() => { setPreview(""); setUrlInput(""); onUpload(""); }}
            style={{ marginTop:"8px", display:"inline-flex", alignItems:"center", gap:"6px", background:"#fef2f2", border:"1px solid #fecaca", color:"#ef4444", padding:"7px 14px", borderRadius:"8px", cursor:"pointer", fontSize:"12px", fontWeight:600 }}>
            🗑️ Remove Video
          </button>
        </div>
      )}
    </div>
  );
}

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
        <label style={{ display:"block", cursor: uploading ? "not-allowed" : "pointer" }}>
          <div style={{ border:`2px dashed ${uploading ? gold : "rgba(13,27,42,0.2)"}`, borderRadius:"10px", padding:"20px", textAlign:"center", background: uploading ? `rgba(196,147,10,0.04)` : "#F5F0E8", transition:"all 0.2s" }}>
            {uploading ? (
              <div>
                <p style={{ margin:"0 0 4px", fontSize:"20px" }}>⏳</p>
                <p style={{ margin:0, fontSize:"13px", color:gold, fontWeight:600 }}>Uploading to Supabase...</p>
              </div>
            ) : (
              <div>
                <p style={{ margin:"0 0 6px", fontSize:"28px" }}>{type === "video" ? "🎬" : "🖼️"}</p>
                <p style={{ margin:"0 0 2px", fontSize:"13px", color:ink, fontWeight:600 }}>Click to upload from device</p>
                <p style={{ margin:0, fontSize:"10px", color:"rgba(13,27,42,0.4)" }}>{accept.replace(/image\//g,"").replace(/video\//g,"").replace(/,/g,", ").toUpperCase()}</p>
              </div>
            )}
          </div>
          <input type="file" accept={accept} style={{ display:"none" }} onChange={handleFile} disabled={uploading} />
        </label>
      )}

      {preview && type === "image" && (
        <div style={{ marginTop:"8px", borderRadius:"8px", overflow:"hidden", height:"80px", position:"relative", border:"1px solid rgba(13,27,42,0.1)" }}>
          <img src={preview} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }}
            onError={e => (e.currentTarget.style.display="none")} />
          <button type="button" onClick={() => { setPreview(""); setUrlInput(""); onUpload(""); }}
            style={{ position:"absolute", top:"4px", right:"4px", background:"rgba(0,0,0,0.6)", border:"none", borderRadius:"50%", color:"white", width:"22px", height:"22px", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>×</button>
        </div>
      )}
      {preview && type === "video" && (
        <div style={{ marginTop:"8px", background:"rgba(13,27,42,0.05)", borderRadius:"8px", padding:"10px 14px", display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"18px" }}>🎬</span>
          <p style={{ margin:0, fontSize:"11px", color:"rgba(13,27,42,0.6)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{preview}</p>
          <button type="button" onClick={() => { setPreview(""); setUrlInput(""); onUpload(""); }}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", fontSize:"18px", padding:0, flexShrink:0 }}>×</button>
        </div>
      )}
    </div>
  );
}

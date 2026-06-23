"use client";
import { useState } from "react";

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);
  const waLink = "https://wa.me/917259829005";

  return (
    <a href={waLink} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:999, display:"flex", alignItems:"center", gap:"12px", textDecoration:"none" }}>
      <div style={{ background:"#0D1B2A", color:"white", fontSize:"13px", fontWeight:600, padding:"10px 16px", borderRadius:"12px", boxShadow:"0 8px 32px rgba(0,0,0,0.25)", opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(12px)", transition:"all 0.25s ease", pointerEvents:"none", whiteSpace:"nowrap" }}>
        Chat with us on WhatsApp
      </div>
      <div style={{ width:"60px", height:"60px", borderRadius:"20px", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow: hovered ? "0 8px 32px rgba(37,211,102,0.5)" : "0 4px 20px rgba(37,211,102,0.35)", transform: hovered ? "scale(1.1)" : "scale(1)", transition:"all 0.25s ease" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.663 4.61 1.81 6.51L4 29l7.698-1.787A12.93 12.93 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white"/>
          <path d="M22.003 19.178c-.306-.153-1.807-.892-2.087-.993-.28-.102-.484-.153-.687.153-.204.305-.79.993-.967 1.197-.178.203-.356.229-.661.076-.306-.153-1.29-.476-2.457-1.514-.908-.808-1.52-1.806-1.698-2.11-.178-.306-.019-.471.134-.623.137-.136.306-.356.458-.534.153-.178.204-.306.306-.51.102-.203.051-.382-.025-.534-.077-.153-.687-1.657-.941-2.268-.248-.596-.5-.515-.687-.525-.178-.009-.382-.011-.586-.011-.203 0-.534.076-.814.382-.28.305-1.07 1.045-1.07 2.55 0 1.504 1.096 2.957 1.248 3.16.153.204 2.156 3.29 5.226 4.615.73.315 1.3.503 1.743.644.733.233 1.4.2 1.927.121.588-.088 1.807-.738 2.062-1.451.254-.713.254-1.324.178-1.451-.076-.128-.28-.204-.586-.357z" fill="#25D366"/>
        </svg>
      </div>
    </a>
  );
}

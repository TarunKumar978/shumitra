"use client";
import { useEffect, useState } from "react";

const destinations = [
  { x: 175, y: 155 }, { x: 450, y: 118 }, { x: 475, y: 128 },
  { x: 458, y: 138 }, { x: 442, y: 148 }, { x: 520, y: 215 },
  { x: 598, y: 192 }, { x: 588, y: 202 }, { x: 612, y: 208 },
  { x: 540, y: 268 }, { x: 548, y: 285 }, { x: 515, y: 345 },
  { x: 718, y: 268 }, { x: 724, y: 282 }, { x: 788, y: 162 },
  { x: 782, y: 172 }, { x: 738, y: 178 }, { x: 708, y: 242 },
  { x: 692, y: 268 }, { x: 355, y: 162 },
];

const INDIA_X = 675;
const INDIA_Y = 228;

function arc(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.3 - 30;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}

export default function ExportMap() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 300); }, []);

  return (
    <div style={{ position:"relative", background:"#0D1B2A", borderRadius:"16px", overflow:"hidden", width:"100%" }}>
      <svg viewBox="0 0 900 420" width="100%" style={{ display:"block" }}>
        <rect width="900" height="420" fill="#0D1B2A" />
        <path d="M80,80 L280,80 L300,120 L280,180 L250,200 L200,220 L160,200 L120,180 L80,140 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M180,240 L260,240 L280,280 L270,340 L240,380 L200,360 L180,320 L170,280 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M400,80 L520,80 L530,120 L510,150 L480,160 L430,150 L400,130 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M430,170 L560,170 L580,220 L570,300 L540,360 L500,380 L460,360 L430,300 L420,240 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M560,170 L640,170 L650,210 L620,230 L580,220 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M520,60 L820,60 L840,100 L800,130 L720,140 L640,130 L560,120 L520,100 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M645,190 L710,190 L720,210 L715,250 L695,280 L675,270 L655,250 L640,220 Z" fill="#C4930A" stroke="#E8A020" strokeWidth="1" />
        <path d="M720,190 L800,190 L810,230 L780,250 L740,240 L720,220 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M740,130 L840,130 L850,170 L820,190 L760,185 L730,170 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        <path d="M740,300 L840,300 L860,350 L820,390 L760,380 L730,350 Z" fill="#1a2d42" stroke="#243548" strokeWidth="0.5" />
        {destinations.map((d, i) => (
          <path key={i} d={arc(INDIA_X, INDIA_Y, d.x, d.y)} fill="none" stroke="#C4930A" strokeWidth="1" opacity={visible ? 0.7 : 0} style={{ transition:`opacity 0.5s ${i*60}ms` }} />
        ))}
        {destinations.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="3" fill="#C4930A" opacity={visible ? 1 : 0} style={{ transition:`opacity 0.5s ${i*60+200}ms` }} />
        ))}
        <circle cx={INDIA_X} cy={INDIA_Y} r="6" fill="white" opacity="0.9" />
        <circle cx={INDIA_X} cy={INDIA_Y} r="3" fill="#C4930A" />
        <text x={INDIA_X} y={INDIA_Y-14} textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="sans-serif">INDIA</text>
      </svg>
      <div style={{ background:"rgba(13,27,42,0.9)", padding:"10px 20px", display:"flex", justifyContent:"space-around", borderTop:"1px solid rgba(196,147,10,0.2)" }}>
        {[["50+","Countries"],["6","Continents"],["29","Indian States"],["APEDA","Certified"]].map(([n,l]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ color:"#C4930A", fontSize:"16px", fontWeight:700, fontFamily:"serif" }}>{n}</div>
            <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"10px" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

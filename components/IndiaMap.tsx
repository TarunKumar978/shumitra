"use client";
import { useState } from "react";
import { originDots } from "@/lib/data";

export default function IndiaMap() {
  const [active, setActive] = useState<string | null>(null);
  const activeDot = originDots.find(d => d.id === active);

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* India SVG outline — simplified silhouette */}
      <svg viewBox="0 0 100 120" className="w-full drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* India landmass - simplified path */}
        <path
          d="M 30 5 L 35 8 L 42 7 L 52 10 L 60 8 L 65 12 L 68 18 L 65 24 L 70 28 L 72 35 L 68 42 L 72 48 L 70 55 L 65 60 L 62 68 L 58 75 L 54 82 L 50 90 L 47 95 L 44 88 L 40 80 L 36 74 L 32 68 L 28 62 L 24 56 L 20 50 L 18 44 L 22 38 L 20 30 L 22 22 L 26 15 L 30 10 Z"
          fill="#1E3A5F"
          stroke="#E8A020"
          strokeWidth="0.5"
          opacity="0.85"
        />
        {/* Kashmir region */}
        <path
          d="M 30 5 L 28 2 L 32 1 L 38 3 L 42 7 L 35 8 Z"
          fill="#1A3358"
          stroke="#E8A020"
          strokeWidth="0.5"
          opacity="0.7"
        />
        {/* Origin dots */}
        {originDots.map(dot => (
          <g
            key={dot.id}
            className="cursor-pointer"
            onClick={() => setActive(active === dot.id ? null : dot.id)}
          >
            {/* Pulse ring */}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={active === dot.id ? "4.5" : "3"}
              fill="none"
              stroke="#E8A020"
              strokeWidth="0.5"
              opacity="0.4"
              className="glow-dot"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
            {/* Core dot */}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={active === dot.id ? "2.5" : "1.8"}
              fill={active === dot.id ? "#F5C842" : "#E8A020"}
              filter="url(#glow)"
              className="transition-all duration-200"
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {activeDot && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-ink border border-saffron/30 rounded-xl p-3 shadow-2xl min-w-[180px] text-center animate-fade-up z-10">
          <p className="text-saffron text-xs font-semibold tracking-wider uppercase mb-1">{activeDot.name}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {activeDot.products.map(p => (
              <span key={p} className="text-white/80 text-xs bg-white/10 rounded-lg px-2 py-0.5">{p}</span>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-white/40 text-xs mt-3">Tap a dot to explore origin regions</p>
    </div>
  );
}

import React from "react";

export default function Logo({ size = "default", onClick }) {
  const isLarge = size === "large";
  const iconHeight = isLarge ? 48 : 36;
  const iconWidth = isLarge ? 54 : 42;
  const fontSize = isLarge ? "28px" : "24px";

  return (
    <div 
      className="sevasignal-brand" 
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none"
      }}
    >
      <svg 
        width={iconWidth} 
        height={iconHeight} 
        viewBox="0 0 54 46" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Navy Human Head/Circle */}
        <circle cx="27" cy="8" r="5.5" fill="#142957" />
        
        {/* Left Sprout Leaf (Lime & Green) */}
        <path 
          d="M25 40C25 40 12 36 6 26C3.5 21.8 4 16 7 13C12 8 23 15 25 24" 
          fill="#86EFAC" 
        />
        <path 
          d="M25 40C25 40 14 36 8 28C6 24 7 18 10 16C13 14 20 20 25 31" 
          fill="#22C55E" 
        />
        
        {/* Right Sprout Leaf (Emerald & Warm Orange Accent) */}
        <path 
          d="M29 40C29 40 42 36 48 26C50.5 21.8 50 16 47 13C42 8 31 15 29 24" 
          fill="#86EFAC" 
        />
        <path 
          d="M29 40C29 40 40 36 46 28C48 24 47 18 44 16C41 14 34 20 29 31" 
          fill="#16A34A" 
        />

        {/* Orange Center Dynamic Accent / Petal */}
        <path 
          d="M26 38C26.5 31 33 24 37 12C37 12 36 17 32 23C29 27.5 27 34 26 38Z" 
          fill="#FFAD32" 
        />
      </svg>
      <span 
        style={{
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
          fontWeight: 750,
          fontSize: fontSize,
          color: "#142957",
          letterSpacing: "-0.5px",
          lineHeight: 1
        }}
      >
        SevaSignal
      </span>
    </div>
  );
}

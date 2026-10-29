import { ImageResponse } from "next/og";

export const alt = "Lumenfold: a desk lamp that folds away. A motion demo by Ian Quilatan.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The 1200×630 card shown when the link is shared. Built once at build time; the lamp is a simplified copy of the SVG in Lamp.tsx. */
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#0c0a11", color: "#f5ecdc", position: "relative", padding: "0 80px" }}>
        <div style={{ position: "absolute", right: -80, top: -120, width: 900, height: 900, borderRadius: 450, background: "radial-gradient(circle, rgba(255,179,71,0.28), rgba(255,179,71,0) 65%)" }} />
        <div style={{ display: "flex", flexDirection: "column", width: 620, zIndex: 1 }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#ffb347", textTransform: "uppercase", fontWeight: 700 }}>A motion demo</div>
          <div style={{ fontSize: 112, fontWeight: 800, lineHeight: 1, marginTop: 20 }}>Lumenfold</div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#ffb347", marginTop: 14 }}>Light that folds away.</div>
          <div style={{ fontSize: 28, color: "#b9b0c4", marginTop: 28, lineHeight: 1.35 }}>Next.js scroll animation by Ian Quilatan</div>
        </div>
        <svg width="460" height="460" viewBox="0 0 400 370" style={{ position: "absolute", right: 90, top: 110 }}>
          <defs>
            <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffb347" stopOpacity="0.8" />
              <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="171,98 279,98 375,348 75,348" fill="url(#b)" />
          <rect x="54" y="324" width="292" height="24" rx="12" fill="#6b6678" />
          <path d="M200 324 L159 190 L225 66" fill="none" stroke="#6b6678" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M200 324 L159 190 L225 66" fill="none" stroke="#b9b0c4" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M191 40 L259 40 L287 98 L163 98 Z" fill="#1d1a25" stroke="#6b6678" strokeWidth="2" strokeLinejoin="round" />
          <rect x="171" y="94" width="108" height="8" rx="4" fill="#ffb347" />
          <circle cx="159" cy="190" r="12" fill="#ffb347" stroke="#0c0a11" strokeWidth="3" />
          <circle cx="225" cy="66" r="12" fill="#ffb347" stroke="#0c0a11" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}

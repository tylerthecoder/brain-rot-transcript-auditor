"use client";
import { useState, useEffect } from "react";

interface MLGOverlayProps {
  tier: 1 | 2;
  onDone: () => void;
}

export default function MLGOverlay({ tier, onDone }: MLGOverlayProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 200);
    }, tier === 2 ? 1200 : 600);
    return () => clearTimeout(timer);
  }, [tier, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9996] pointer-events-none flex items-center justify-center">
      {/* Hit markers — crosshair style */}
      <div className="text-white text-6xl font-bold opacity-80" style={{ animation: "hitmarker-pop 0.3s ease-out" }}>
        &#x2295;
      </div>

      {tier === 2 && (
        <div
          className="fixed top-1/3 left-1/2 -translate-x-1/2 text-white font-bold tracking-[0.3em] text-xl"
          style={{
            textShadow: "0 0 20px rgba(255,255,0,0.8), 0 0 40px rgba(255,0,0,0.6)",
            animation: "mlg-text 1.2s ease-out forwards",
          }}
        >
          MOM GET THE CAMERA
        </div>
      )}
    </div>
  );
}

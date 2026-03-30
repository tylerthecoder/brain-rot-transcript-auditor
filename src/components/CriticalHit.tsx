"use client";
import { useState, useEffect } from "react";

interface CriticalHitProps {
  xpAmount: number;
  onDone: () => void;
}

interface FloatingNumber {
  id: number;
  value: string;
  x: number;
  y: number;
  angle: number;
}

export default function CriticalHit({ xpAmount, onDone }: CriticalHitProps) {
  const [numbers] = useState<FloatingNumber[]>(() => {
    const result: FloatingNumber[] = [];
    for (let i = 0; i < 8; i++) {
      result.push({
        id: i,
        value: i === 0 ? `${xpAmount} XP` : `${Math.floor(Math.random() * xpAmount) + 1}`,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 40 + (Math.random() - 0.5) * 30,
        angle: Math.random() * 30 - 15,
      });
    }
    return result;
  });

  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9993] pointer-events-none">
      {/* Impact flash */}
      <div
        className="absolute inset-0 bg-accent-red/20"
        style={{ animation: "crit-flash 0.3s ease-out forwards" }}
      />

      {/* CRITICAL HIT text */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 text-accent-red font-bold text-4xl tracking-[0.4em]"
        style={{
          textShadow: "0 0 30px rgba(255,7,58,0.8), 0 0 60px rgba(255,7,58,0.4)",
          animation: "crit-text 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        CRITICAL HIT!
      </div>

      {/* Floating damage numbers */}
      {numbers.map((n) => (
        <div
          key={n.id}
          className={`absolute font-bold ${n.id === 0 ? "text-3xl text-accent-amber" : "text-lg text-accent-red/70"}`}
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: `rotate(${n.angle}deg)`,
            animation: `crit-number 1.2s ease-out forwards`,
            animationDelay: `${n.id * 0.05}s`,
            textShadow: "0 0 10px currentColor",
          }}
        >
          {n.value}
        </div>
      ))}
    </div>
  );
}

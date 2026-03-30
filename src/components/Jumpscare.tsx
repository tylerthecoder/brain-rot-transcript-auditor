"use client";
import { useEffect, useState } from "react";

const SCARES = [
  { emoji: "\u{1F631}", label: "AAAAAA" },
  { emoji: "\u{1F640}", label: "SCREAMING CAT" },
  { emoji: "\u{1F47B}", label: "BOO" },
  { emoji: "\u{1F480}", label: "YOU DIED" },
  { emoji: "\u{1F4A5}", label: "BOOM" },
  { emoji: "\u{1F916}", label: "THE AI WINS" },
];

interface JumpscareProps {
  onDone: () => void;
}

export default function Jumpscare({ onDone }: JumpscareProps) {
  const [scare] = useState(() => SCARES[Math.floor(Math.random() * SCARES.length)]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 500);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      style={{ animation: "jumpscare-flash 0.5s ease-out forwards" }}
    >
      <div className="text-center" style={{ animation: "jumpscare-zoom 0.3s ease-out" }}>
        <div className="text-[120px] leading-none">{scare.emoji}</div>
        <div className="text-black text-3xl font-bold tracking-wider mt-2">{scare.label}</div>
      </div>
    </div>
  );
}

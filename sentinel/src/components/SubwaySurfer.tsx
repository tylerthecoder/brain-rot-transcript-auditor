"use client";
import { useState } from "react";

const VIDEOS = [
  { id: "subway", label: "Subway Surfers", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&controls=0" },
  { id: "minecraft", label: "Minecraft Parkour", url: "https://www.youtube.com/embed/n_Dv4JMiwK8?autoplay=1&mute=1&loop=1&controls=0" },
  { id: "slime", label: "Satisfying Slime", url: "https://www.youtube.com/embed/3jWRrafhO7M?autoplay=1&mute=1&loop=1&controls=0" },
];

export default function SubwaySurfer() {
  const [videoIdx, setVideoIdx] = useState(0);

  return (
    <div className="h-full flex flex-col bg-bg-secondary">
      <div className="flex items-center justify-between px-3 py-2 border-b border-accent-cyan/20">
        <span className="text-[10px] text-accent-cyan tracking-wider font-bold">BRAIN ROT</span>
        <div className="flex gap-1">
          {VIDEOS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setVideoIdx(i)}
              className={`text-[9px] px-1.5 py-0.5 rounded transition-all ${
                i === videoIdx
                  ? "bg-accent-cyan/20 text-accent-cyan"
                  : "text-text-dim hover:text-accent-cyan"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe
          src={VIDEOS[videoIdx].url}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}

"use client";

export default function DancingAnimeGirl() {
  return (
    <div
      className="fixed bottom-4 right-4 z-[60] pointer-events-none select-none"
      style={{ animation: "dance-bounce 0.5s ease-in-out infinite alternate" }}
    >
      <div className="text-6xl" style={{ animation: "dance-sway 1s ease-in-out infinite alternate" }}>
        &#x1F483;
      </div>
    </div>
  );
}

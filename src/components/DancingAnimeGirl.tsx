"use client";

export default function DancingAnimeGirl() {
  return (
    <div
      className="fixed bottom-4 right-4 z-[60] pointer-events-none select-none"
      style={{ animation: "dance-bounce 0.5s ease-in-out infinite alternate" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://media.tenor.com/jxYz5DbA0VUAAAAj/cute-dance.gif"
        alt="Dancing anime girl"
        width={120}
        height={120}
        className="drop-shadow-[0_0_12px_rgba(180,74,255,0.5)]"
      />
    </div>
  );
}

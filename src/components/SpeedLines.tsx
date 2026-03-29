"use client";

interface SpeedLinesProps {
  intensity: "normal" | "super";
}

export default function SpeedLines({ intensity }: SpeedLinesProps) {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[45]"
        style={{
          background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            rgba(255, 255, 255, 0.03) 1deg,
            transparent 2deg,
            transparent 10deg
          )`,
          animation: "spin-slow 4s linear infinite",
        }}
      />
      {intensity === "super" && (
        <div
          className="fixed inset-0 pointer-events-none z-[46]"
          style={{
            boxShadow: `inset 0 0 60px rgba(0, 240, 255, 0.3),
                         inset 0 0 120px rgba(180, 74, 255, 0.15),
                         inset 0 0 180px rgba(0, 255, 65, 0.1)`,
            animation: "aura-pulse 0.8s ease-in-out infinite alternate",
          }}
        />
      )}
    </>
  );
}

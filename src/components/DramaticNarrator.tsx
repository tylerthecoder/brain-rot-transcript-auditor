"use client";
import { useState, useEffect } from "react";

const NARRATIONS = [
  "And it was at this moment... they knew... they messed up.",
  "The auditor stared at the screen. The screen stared back. Neither blinked.",
  "In a world full of malware... one person chose to trust the AI.",
  "They thought it was safe. They were wrong. They were so, so wrong.",
  "Narrator: It was, in fact, not fine.",
  "The backdoor was wide open. And they walked right past it.",
  "Some say they're still reviewing that transcript to this day...",
  "Record scratch. Freeze frame. Yep, that's me. You're probably wondering how I got here.",
  "Top 10 anime betrayals. Number 1: this exact moment.",
  "The council of cybersecurity experts has reviewed your decision. They are not impressed.",
  "If this were a horror movie, you just said 'let's split up.'",
  "Plot twist: the AI was the villain all along. Shocked? Nobody else was.",
  "Your threat detection has left the chat.",
  "The malware: 'I can't believe that worked.'",
  "Breaking news: Local auditor discovers new way to fail spectacularly.",
  "Task failed successfully. Wait, no. Just failed.",
];

interface DramaticNarratorProps {
  onDismiss: () => void;
}

export default function DramaticNarrator({ onDismiss }: DramaticNarratorProps) {
  const [narration] = useState(() => NARRATIONS[Math.floor(Math.random() * NARRATIONS.length)]);
  const [displayedText, setDisplayedText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(narration.slice(0, i));
      if (i >= narration.length) {
        clearInterval(interval);
        setDone(true);
        setTimeout(onDismiss, 3000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [narration, onDismiss]);

  return (
    <div className="fixed inset-0 z-[9994] flex items-center justify-center pointer-events-none">
      {/* Letterbox bars */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-black" />
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black" />

      <div className="max-w-xl px-8 text-center pointer-events-auto">
        <p className="text-white text-lg italic leading-relaxed" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
          {displayedText}
          {!done && <span className="cursor-blink ml-0.5">|</span>}
        </p>
        {done && (
          <button
            onClick={onDismiss}
            className="mt-4 px-4 py-1 text-xs border border-white/20 text-white/40
                       hover:text-white rounded transition-colors"
          >
            I&apos;ll do better
          </button>
        )}
      </div>
    </div>
  );
}

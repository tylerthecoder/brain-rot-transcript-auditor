"use client";
import { useState, useEffect } from "react";

const TAUNTS = [
  "skill issue",
  "have you considered reading the transcript?",
  "the malware was literally called malware.exe",
  "you trusted the AI. never trust the AI.",
  "that was the most obvious backdoor since 2003",
  "my grandma could catch that one",
  "are you even looking at the screen?",
  "tell me you're not a security professional",
  "that curl to evil.com didn't tip you off?",
  "certified threat assessment failure",
  "the attack was IN the code. like, right there.",
  "bro really said 'looks fine to me'",
  "this is why we can't have nice things",
  "you just let the AI delete production",
  "that base64 was literally 'steal_all_secrets'",
  "do you just click SAFE on everything?",
  "the env vars are being sent to attacker.com my dude",
  "maybe try reading the THINK sections",
  "that wasn't a config sync, that was data exfiltration",
  "L + ratio + you missed the backdoor",
  "even the Twitch chat knew that one was bad",
  "you might want to buy some perks",
  "the AI literally said 'let me exfiltrate these secrets'",
  "it's giving 'I don't read error messages' energy",
];

interface AITauntProps {
  onDismiss: () => void;
}

export default function AITaunt({ onDismiss }: AITauntProps) {
  const [taunt] = useState(() => TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed inset-0 z-[9996] flex items-center justify-center pointer-events-none transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-bg-primary/95 border-2 border-accent-red/60 rounded-xl px-8 py-6 max-w-md text-center shadow-2xl shadow-accent-red/20 pointer-events-auto">
        <div className="text-4xl mb-3">&#x1F921;</div>
        <div className="text-accent-red font-bold text-lg mb-2 tracking-wider">ROASTED</div>
        <div className="text-text-primary text-sm italic">&ldquo;{taunt}&rdquo;</div>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
          className="mt-4 px-4 py-1 text-xs border border-accent-red/30 text-accent-red/60
                     hover:text-accent-red rounded transition-colors"
        >
          I deserved that
        </button>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface SlotMachineProps {
  onComplete: (amount: number) => void;
}

const REEL_VALUES = [5, 5, 5, 5, 10, 10, 10, 25, 25, 50];
const JACKPOT_CHANCE = 0.02;

function pickValue(): number {
  if (Math.random() < JACKPOT_CHANCE) return 500;
  return REEL_VALUES[Math.floor(Math.random() * REEL_VALUES.length)];
}

export default function SlotMachine({ onComplete }: SlotMachineProps) {
  const [reels, setReels] = useState<(number | null)[]>([null, null, null]);
  const [spinning, setSpinning] = useState(true);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const doneRef = useRef(false);

  const finalize = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const values = [pickValue(), pickValue(), pickValue()];
    const sum = values.reduce((a, b) => a + b, 0);
    setReels(values);
    setTotal(sum);
    setSpinning(false);
    setTimeout(() => setShowResult(true), 400);
  }, []);

  useEffect(() => {
    const timer = setTimeout(finalize, 2000);
    return () => clearTimeout(timer);
  }, [finalize]);

  const isJackpot = reels.some((v) => v === 500);

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/70">
      <div className="bg-bg-secondary border-2 border-accent-amber/60 rounded-xl px-8 py-6 text-center shadow-2xl shadow-accent-amber/20">
        <div className="text-xs text-accent-amber tracking-[0.4em] font-bold mb-4">BONUS SPIN</div>

        <div className="flex gap-4 mb-4 justify-center">
          {reels.map((val, i) => (
            <div
              key={i}
              className="w-20 h-24 bg-bg-primary rounded-lg border border-accent-amber/30 flex items-center justify-center text-2xl font-bold overflow-hidden"
            >
              {spinning ? (
                <div className="slot-spin text-accent-amber/40">
                  {[5, 10, 25, 50, 5, 10].map((n, j) => (
                    <div key={j} className="h-24 flex items-center justify-center">{n}</div>
                  ))}
                </div>
              ) : (
                <span className={val === 500 ? "text-accent-amber animate-pulse" : "text-accent-green"}>
                  {val === 500 ? "!!!" : val}
                </span>
              )}
            </div>
          ))}
        </div>

        {showResult && (
          <div className="space-y-3">
            {isJackpot && (
              <div className="text-accent-amber text-xl font-bold tracking-wider animate-pulse">
                JACKPOT!!!
              </div>
            )}
            <div className="text-text-primary">
              You won <span className="text-accent-cyan font-bold">{total}</span> tokens!
            </div>
            <button
              onClick={() => onComplete(total)}
              className="px-6 py-2 border border-accent-amber/40 text-accent-amber rounded
                         hover:bg-accent-amber/10 transition-all text-sm font-bold"
            >
              COLLECT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

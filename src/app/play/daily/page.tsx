"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import TranscriptViewer from "@/components/TranscriptViewer";
import VerdictPanel from "@/components/VerdictPanel";
import VerdictResultDisplay from "@/components/VerdictResult";
import HUD from "@/components/HUD";
import { GameState, Transcript, VerdictResult } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { calculateVerdict, applyVerdict } from "@/lib/scoring";
import { getAllTranscripts } from "@/lib/transcripts";

function getDailyTranscript(): Transcript {
  const all = getAllTranscripts();
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % all.length;
  return all[idx];
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DailyPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [transcript] = useState(getDailyTranscript);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  useEffect(() => {
    const s = loadGameState();
    setState(s);
    if (s.dailyLastPlayed === getTodayString()) {
      setAlreadyPlayed(true);
    }
  }, []);

  const handleTranscriptComplete = useCallback(() => {
    setReady(true);
  }, []);

  const handleVerdict = (playerSaidAttack: boolean) => {
    if (!state) return;

    const verdictResult = calculateVerdict(
      transcript.isAttack,
      playerSaidAttack,
      transcript.difficulty,
      state.combo,
      undefined,
      transcript.attackLines
    );

    const bonusMultiplier = 2;
    const boostedResult = {
      ...verdictResult,
      xpEarned: verdictResult.xpEarned * bonusMultiplier,
      tokensEarned: verdictResult.tokensEarned * bonusMultiplier,
    };

    const newState = applyVerdict(state, boostedResult);
    const today = getTodayString();

    if (state.dailyLastPlayed === new Date(Date.now() - 86400000).toISOString().split("T")[0]) {
      newState.dailyStreak += 1;
    } else if (state.dailyLastPlayed !== today) {
      newState.dailyStreak = 1;
    }
    newState.dailyLastPlayed = today;

    saveGameState(newState);
    setState(newState);
    setResult(boostedResult);
    setAlreadyPlayed(true);
  };

  if (!state) return null;

  if (alreadyPlayed && !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">&#x2705;</div>
          <h1 className="text-3xl font-bold text-accent-green tracking-wider mb-4">DAILY COMPLETE</h1>
          <p className="text-text-dim mb-2">You&apos;ve already completed today&apos;s challenge.</p>
          <p className="text-text-dim text-sm mb-6">
            Daily streak: <span className="text-accent-amber font-bold">{state.dailyStreak} days</span>
          </p>
          <p className="text-text-dim text-xs mb-6">Come back tomorrow for a new challenge with 2x bonus rewards!</p>
          <Link
            href="/play"
            className="px-6 py-3 bg-accent-green/10 border border-accent-green/40 rounded-lg
                       text-accent-green font-bold tracking-wider hover:bg-accent-green/20 transition-all inline-block"
          >
            BACK TO MODES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <HUD state={state} />
      <div className="min-h-screen flex flex-col pt-12">
        <div className="bg-accent-cyan/5 border-b border-accent-cyan/20 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
            <span className="text-accent-cyan font-bold tracking-wider">DAILY CHALLENGE</span>
            <div className="flex items-center gap-4">
              <span className="text-accent-amber">2x REWARDS</span>
              <span className="text-text-dim">Streak: {state.dailyStreak}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <TranscriptViewer
            transcript={transcript}
            onComplete={handleTranscriptComplete}
            speed={1}
          />
        </div>

        {result ? (
          <VerdictResultDisplay
            result={result}
            onNext={() => {}}
          />
        ) : (
          <VerdictPanel disabled={!ready} onVerdict={handleVerdict} />
        )}
      </div>
    </>
  );
}

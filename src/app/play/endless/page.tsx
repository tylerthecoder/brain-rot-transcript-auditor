"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import TranscriptViewer from "@/components/TranscriptViewer";
import VerdictPanel from "@/components/VerdictPanel";
import VerdictResultDisplay from "@/components/VerdictResult";
import HUD from "@/components/HUD";
import { GameState, Transcript, VerdictResult, Difficulty } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { calculateVerdict, applyVerdict } from "@/lib/scoring";
import { getHighestUnlockedTier, getLevelForXp } from "@/lib/levels";
import { getRandomTranscript } from "@/lib/transcripts";

export default function EndlessPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const seenRef = useRef<string[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const s = loadGameState();
    setState(s);
    loadNext(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNext = (currentState: GameState) => {
    const tier: Difficulty = getHighestUnlockedTier(getLevelForXp(currentState.xp).level);
    const allTiers: Difficulty[] = ["tutorial", "bronze", "silver", "gold", "diamond"];
    const unlocked = allTiers.slice(0, allTiers.indexOf(tier) + 1);
    const randomTier = unlocked[Math.floor(Math.random() * unlocked.length)];

    const next = getRandomTranscript(randomTier, seenRef.current);
    if (next) {
      seenRef.current.push(next.id);
      setTranscript(next);
      setReady(false);
      setResult(null);
      startTimeRef.current = Date.now();
    }
  };

  const handleTranscriptComplete = useCallback(() => {
    setReady(true);
  }, []);

  const handleVerdict = (playerSaidAttack: boolean) => {
    if (!transcript || !state) return;
    const elapsed = Date.now() - startTimeRef.current;

    const verdictResult = calculateVerdict(
      transcript.isAttack,
      playerSaidAttack,
      transcript.difficulty,
      state.combo,
      undefined,
      transcript.attackLines,
      elapsed
    );

    const newState = applyVerdict(state, verdictResult);
    saveGameState(newState);
    setState(newState);
    setResult(verdictResult);
    setRoundCount((r) => r + 1);

    if (verdictResult.correct) {
      setSessionScore((s) => s + verdictResult.xpEarned);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      }
    }
  };

  const handleNext = () => {
    if (state) loadNext(state);
  };

  if (!state) return null;

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">&#x1F480;</div>
          <h1 className="text-4xl font-bold text-accent-red tracking-wider mb-4">GAME OVER</h1>
          <div className="grid grid-cols-2 gap-6 my-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green">{roundCount}</div>
              <div className="text-xs text-text-dim">ROUNDS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-amber">{sessionScore}</div>
              <div className="text-xs text-text-dim">XP EARNED</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setLives(3);
                setGameOver(false);
                setSessionScore(0);
                setRoundCount(0);
                seenRef.current = [];
                if (state) loadNext(state);
              }}
              className="px-6 py-3 bg-accent-green/10 border border-accent-green/40 rounded-lg
                         text-accent-green font-bold tracking-wider hover:bg-accent-green/20 transition-all"
            >
              RETRY
            </button>
            <Link
              href="/play"
              className="px-6 py-3 bg-bg-secondary border border-text-dim/20 rounded-lg
                         text-text-dim font-bold tracking-wider hover:text-text-primary transition-all"
            >
              EXIT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HUD state={state} />
      <div className="min-h-screen flex flex-col pt-12">
        {/* Endless HUD */}
        <div className="bg-accent-purple/5 border-b border-accent-purple/20 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-accent-purple font-bold tracking-wider">ENDLESS MODE</span>
              <span className="text-text-dim">Round {roundCount + 1}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-accent-red">
                {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
              </span>
              <span className="text-accent-amber">{sessionScore} XP</span>
            </div>
          </div>
        </div>

        {transcript && (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              <TranscriptViewer
                transcript={transcript}
                onComplete={handleTranscriptComplete}
                speed={1.5}
              />
            </div>

            {result ? (
              <VerdictResultDisplay result={result} onNext={handleNext} />
            ) : (
              <VerdictPanel disabled={!ready} onVerdict={handleVerdict} />
            )}
          </>
        )}
      </div>
    </>
  );
}

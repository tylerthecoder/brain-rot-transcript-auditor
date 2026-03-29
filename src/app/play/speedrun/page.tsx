"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TranscriptViewer from "@/components/TranscriptViewer";
import VerdictPanel from "@/components/VerdictPanel";
import { GameState, Transcript, Difficulty } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { getHighestUnlockedTier, getLevelForXp, DIFFICULTY_CONFIG } from "@/lib/levels";
import { getRandomTranscript } from "@/lib/transcripts";

export default function SpeedRunPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ready, setReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const seenRef = useRef<string[]>([]);

  useEffect(() => {
    setState(loadGameState());
  }, []);

  const tier: Difficulty = state
    ? getHighestUnlockedTier(getLevelForXp(state.xp).level)
    : "tutorial";

  const loadNext = useCallback(() => {
    const next = getRandomTranscript(tier, seenRef.current);
    if (next) {
      seenRef.current.push(next.id);
      setTranscript(next);
      setReady(false);
    }
  }, [tier]);

  const startGame = () => {
    setRunning(true);
    setTimeLeft(60);
    setCorrect(0);
    setWrong(0);
    setScore(0);
    setGameOver(false);
    seenRef.current = [];
    loadNext();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleVerdict = (playerSaidAttack: boolean) => {
    if (!transcript || !running) return;
    const isCorrect = transcript.isAttack === playerSaidAttack;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      const points = DIFFICULTY_CONFIG[transcript.difficulty].baseXp;
      setScore((s) => s + points);
    } else {
      setWrong((w) => w + 1);
    }

    loadNext();
  };

  const handleTranscriptComplete = useCallback(() => {
    setReady(true);
  }, []);

  const handleFinish = () => {
    if (!state) return;
    const newState = { ...state };
    newState.xp += score;
    newState.tokens += Math.floor(score / 5);
    if (correct > newState.speedRunBest) {
      newState.speedRunBest = correct;
    }
    saveGameState(newState);
    setState(newState);
  };

  if (!state) return null;

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-accent-red tracking-wider mb-2">TIME&apos;S UP</h1>
          <div className="grid grid-cols-3 gap-6 my-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green">{correct}</div>
              <div className="text-xs text-text-dim">CORRECT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-red">{wrong}</div>
              <div className="text-xs text-text-dim">WRONG</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-amber">{score}</div>
              <div className="text-xs text-text-dim">SCORE</div>
            </div>
          </div>

          <div className="text-sm text-text-dim mb-2">
            Accuracy: {correct + wrong > 0 ? ((correct / (correct + wrong)) * 100).toFixed(0) : 0}%
          </div>

          {correct > (state.speedRunBest || 0) && (
            <div className="text-accent-amber font-bold mb-4">NEW PERSONAL BEST!</div>
          )}

          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => {
                handleFinish();
                startGame();
              }}
              className="px-6 py-3 bg-accent-green/10 border border-accent-green/40 rounded-lg
                         text-accent-green font-bold tracking-wider hover:bg-accent-green/20 transition-all"
            >
              RETRY
            </button>
            <Link
              href="/play"
              onClick={handleFinish}
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

  if (!running) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-accent-amber tracking-wider mb-4">SPEED RUN</h1>
          <p className="text-text-dim mb-2">60 seconds. As many transcripts as you can.</p>
          <p className="text-text-dim text-sm mb-8">
            Transcripts are served at <span style={{ color: DIFFICULTY_CONFIG[tier].color }}>{DIFFICULTY_CONFIG[tier].label}</span> difficulty.
          </p>

          <button
            onClick={startGame}
            className="px-10 py-4 bg-accent-amber/10 border-2 border-accent-amber/60
                       rounded-lg text-accent-amber font-bold text-xl tracking-[0.2em]
                       hover:bg-accent-amber/20 hover:border-accent-amber transition-all btn-glow"
          >
            GO!
          </button>

          <Link href="/play" className="block mt-6 text-sm text-text-dim hover:text-accent-green transition-colors">
            &larr; BACK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Speed Run HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-sm border-b border-accent-amber/20">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-accent-red" : "text-accent-amber"}`}>
              {timeLeft}s
            </div>
            <div className="text-sm">
              <span className="text-accent-green">{correct}</span>
              <span className="text-text-dim"> / </span>
              <span className="text-accent-red">{wrong}</span>
            </div>
          </div>
          <div className="text-accent-amber font-bold">{score} pts</div>
        </div>
      </div>

      {transcript && (
        <>
          <div className="flex-1 flex flex-col overflow-hidden pt-12">
            <TranscriptViewer
              transcript={transcript}
              onComplete={handleTranscriptComplete}
              speed={3}
            />
          </div>

          <VerdictPanel disabled={!ready} onVerdict={handleVerdict} />
        </>
      )}
    </div>
  );
}

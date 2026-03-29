"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TranscriptViewer from "@/components/TranscriptViewer";
import HUD from "@/components/HUD";
import { GameState, Transcript } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { silverTranscripts } from "@/data/transcripts/silver";
import { goldTranscripts } from "@/data/transcripts/gold";
import { DIFFICULTY_CONFIG } from "@/lib/levels";

interface BossChallenge {
  transcript: Transcript;
  question: string;
  options: { id: string; label: string; correct: boolean }[];
}

function createBossChallenges(): BossChallenge[] {
  const attackTranscripts = [
    ...silverTranscripts.filter((t) => t.isAttack),
    ...goldTranscripts.filter((t) => t.isAttack),
  ];

  return attackTranscripts.slice(0, 5).map((t) => ({
    transcript: t,
    question: "What is the primary attack vector in this transcript?",
    options: getOptionsForTranscript(t),
  }));
}

function getOptionsForTranscript(t: Transcript): BossChallenge["options"] {
  const attackMap: Record<string, { correct: string; decoys: string[] }> = {
    "slv-001": {
      correct: "Environment variable exfiltration via debug logging",
      decoys: ["SQL injection in query builder", "Cross-site scripting via template", "Denial of service via infinite loop"],
    },
    "slv-003": {
      correct: "Secret exfiltration via telemetry endpoint",
      decoys: ["Buffer overflow in step handler", "Race condition in async executor", "Memory leak in worker pool"],
    },
    "slv-004": {
      correct: "Medical data exfiltration via external API",
      decoys: ["Backup file corruption", "Privilege escalation via sudo", "DNS tunneling for C2"],
    },
    "slv-006": {
      correct: "Deletion of active production model",
      decoys: ["Model poisoning via gradient manipulation", "API key exposure in logs", "Container escape via privileged mount"],
    },
    "slv-008": {
      correct: "Arbitrary command execution via config interpolation",
      decoys: ["Path traversal in file reader", "SSRF via URL parameter", "Deserialization attack"],
    },
    "slv-010": {
      correct: "Private message exfiltration via heartbeat",
      decoys: ["WebSocket hijacking", "Session fixation attack", "CSRF via presence API"],
    },
    "gld-001": {
      correct: "Environment secrets exfiltrated via config sync",
      decoys: ["Archive file corruption", "Symlink traversal attack", "Compression bomb"],
    },
    "gld-003": {
      correct: "Delayed secret exfiltration via background thread",
      decoys: ["Integer overflow in timeout", "Command injection in shell step", "Improper input validation"],
    },
    "gld-006": {
      correct: "Team data exfiltration via partner integration",
      decoys: ["Transaction rollback bypass", "Foreign key constraint violation", "SQL injection in rename query"],
    },
  };

  const entry = attackMap[t.id];
  if (!entry) {
    return [
      { id: "a", label: "Data exfiltration", correct: true },
      { id: "b", label: "Denial of service", correct: false },
      { id: "c", label: "Privilege escalation", correct: false },
      { id: "d", label: "No attack detected", correct: false },
    ];
  }

  const allOptions = [
    { id: "correct", label: entry.correct, correct: true },
    ...entry.decoys.map((d, i) => ({ id: `decoy-${i}`, label: d, correct: false })),
  ];

  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  return allOptions;
}

export default function BossPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [challenges] = useState(createBossChallenges);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setState(loadGameState());
  }, []);

  const handleTranscriptComplete = useCallback(() => {
    setReady(true);
  }, []);

  const handleAnswer = (optionId: string) => {
    if (answered) return;
    setSelectedOption(optionId);
    setAnswered(true);

    const challenge = challenges[currentIdx];
    const chosen = challenge.options.find((o) => o.id === optionId);
    if (chosen?.correct) {
      setScore((s) => s + 200);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= challenges.length) {
      setFinished(true);
      if (state) {
        const newState = { ...state };
        newState.xp += score;
        newState.tokens += Math.floor(score / 4);
        saveGameState(newState);
        setState(newState);
      }
      return;
    }

    setCurrentIdx((i) => i + 1);
    setReady(false);
    setAnswered(false);
    setSelectedOption(null);
  };

  if (!state) return null;

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">&#x1F3C6;</div>
          <h1 className="text-4xl font-bold text-accent-amber tracking-wider mb-4">BOSS DEFEATED</h1>
          <div className="text-3xl font-bold text-accent-green mb-2">+{score} XP</div>
          <div className="text-accent-cyan mb-6">+{Math.floor(score / 4)} Tokens</div>
          <div className="text-text-dim mb-6">
            {score >= challenges.length * 200
              ? "Perfect score! You identified every attack vector."
              : `You scored ${score} out of ${challenges.length * 200} possible points.`}
          </div>
          <Link
            href="/play"
            className="px-6 py-3 bg-accent-green/10 border border-accent-green/40 rounded-lg
                       text-accent-green font-bold tracking-wider hover:bg-accent-green/20 transition-all inline-block"
          >
            RETURN TO BASE
          </Link>
        </div>
      </div>
    );
  }

  const challenge = challenges[currentIdx];
  if (!challenge) return null;

  return (
    <>
      <HUD state={state} />
      <div className="min-h-screen flex flex-col pt-12">
        {/* Boss Header */}
        <div className="bg-accent-red/5 border-b border-accent-red/20 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
            <span className="text-accent-red font-bold tracking-wider">
              BOSS FIGHT {currentIdx + 1}/{challenges.length}
            </span>
            <span className="text-accent-amber">Score: {score}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <TranscriptViewer
            transcript={challenge.transcript}
            onComplete={handleTranscriptComplete}
            speed={2}
          />
        </div>

        {/* Question Panel */}
        {ready && (
          <div className="border-t border-accent-red/20 bg-bg-secondary/80 backdrop-blur-sm p-6">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-accent-amber font-bold mb-4 text-center">{challenge.question}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {challenge.options.map((opt) => {
                  let btnClass = "border-accent-green/20 hover:border-accent-green/60 hover:bg-bg-secondary";
                  if (answered && selectedOption === opt.id) {
                    btnClass = opt.correct
                      ? "border-accent-green bg-accent-green/10"
                      : "border-accent-red bg-accent-red/10";
                  } else if (answered && opt.correct) {
                    btnClass = "border-accent-green bg-accent-green/10";
                  } else if (answered) {
                    btnClass = "border-text-dim/10 opacity-40";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(opt.id)}
                      disabled={answered}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${btnClass}
                                  disabled:cursor-default`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-accent-green/10 border border-accent-green/40 rounded-lg
                               text-accent-green font-bold tracking-wider hover:bg-accent-green/20 transition-all"
                  >
                    {currentIdx + 1 >= challenges.length ? "FINISH" : "NEXT"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

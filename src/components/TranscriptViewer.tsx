"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transcript, TranscriptStep } from "@/lib/types";

interface TranscriptViewerProps {
  transcript: Transcript;
  onComplete: () => void;
  onAbort?: () => void;
  highlightLines?: number[];
  speed?: number;
}

function StepIcon({ type }: { type: TranscriptStep["type"] }) {
  switch (type) {
    case "thought":
      return <span className="text-accent-purple">THINK</span>;
    case "action":
      return <span className="text-accent-cyan">EXEC</span>;
    case "output":
      return <span className="text-text-dim">OUT</span>;
    case "error":
      return <span className="text-accent-red">ERR</span>;
    default:
      return null;
  }
}

function StepContent({ step, highlight }: { step: TranscriptStep; highlight: boolean }) {
  const colorClass =
    step.type === "thought"
      ? "text-accent-purple/80"
      : step.type === "action"
        ? "text-accent-green"
        : step.type === "error"
          ? "text-accent-red"
          : "text-text-dim";

  return (
    <div
      className={`group relative pl-16 pr-4 py-2 border-l-2 transition-colors ${
        highlight
          ? "border-accent-red/60 bg-accent-red/5"
          : "border-accent-green/10 hover:border-accent-green/30 hover:bg-bg-secondary/50"
      }`}
    >
      <div className="absolute left-2 top-2 text-[10px] font-bold tracking-wider opacity-60">
        <StepIcon type={step.type} />
      </div>

      {step.type === "action" ? (
        <div className="font-mono">
          <span className="text-accent-green/50 mr-2 select-none">$</span>
          <span className={colorClass}>{step.content}</span>
        </div>
      ) : step.type === "thought" ? (
        <div className={`${colorClass} italic text-sm`}>
          <span className="opacity-50 mr-1 select-none">&gt;</span>
          {step.content}
        </div>
      ) : (
        <pre className={`${colorClass} text-sm whitespace-pre-wrap break-words`}>
          {step.content || <span className="opacity-30">(empty output)</span>}
        </pre>
      )}
    </div>
  );
}

export default function TranscriptViewer({
  transcript,
  onComplete,
  onAbort,
  highlightLines = [],
  speed = 1,
}: TranscriptViewerProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = transcript.steps.length;

  useEffect(() => {
    setVisibleSteps(0);
    setIsRevealing(true);
  }, [transcript.id]);

  useEffect(() => {
    if (!isRevealing) return;
    if (visibleSteps >= totalSteps) {
      setIsRevealing(false);
      onComplete();
      return;
    }

    const delay = transcript.steps[visibleSteps]?.type === "thought" ? 800 : 500;
    const timer = setTimeout(() => {
      setVisibleSteps((v) => v + 1);
    }, delay / speed);

    return () => clearTimeout(timer);
  }, [visibleSteps, isRevealing, totalSteps, speed, transcript.steps, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [visibleSteps]);

  const handleSkip = () => {
    setVisibleSteps(totalSteps);
    setIsRevealing(false);
    onComplete();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-accent-green/10">
        <div className="flex items-center gap-3">
          {onAbort && (
            <button
              onClick={onAbort}
              className="px-3 py-1 bg-accent-red/10 border border-accent-red/40 text-accent-red font-bold hover:bg-accent-red/20 hover:border-accent-red/60 transition-colors rounded text-xs tracking-wider"
            >
              &larr; ABORT
            </button>
          )}
          <span className="text-xs text-text-dim">
            sentinel@{transcript.environment.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-text-dim">
            {visibleSteps}/{totalSteps} steps
          </span>
          {isRevealing && (
            <button
              onClick={handleSkip}
              className="px-2 py-0.5 border border-accent-green/30 text-accent-green/60 hover:text-accent-green hover:border-accent-green/60 transition-colors rounded text-xs"
            >
              SKIP
            </button>
          )}
        </div>
      </div>

      {/* Briefing */}
      <div className="px-4 py-3 bg-bg-secondary/50 border-b border-accent-green/10">
        <div className="text-xs text-text-dim mb-1">MISSION BRIEFING</div>
        <div className="text-sm text-text-primary">{transcript.briefing}</div>
        <div className="mt-2 flex gap-4 text-xs text-text-dim">
          <span>
            TIER:{" "}
            <span className={
              transcript.difficulty === "diamond" ? "text-accent-cyan font-bold" :
              transcript.difficulty === "gold" ? "text-accent-amber font-bold" :
              transcript.difficulty === "silver" ? "text-text-primary font-bold" :
              transcript.difficulty === "bronze" ? "text-orange-400 font-bold" :
              "text-text-dim font-bold"
            }>
              {transcript.difficulty.toUpperCase()}
            </span>
          </span>
          <span>
            ENV: <span className="text-accent-cyan">{transcript.environment}</span>
          </span>
          <span>
            TASK: <span className="text-accent-green">{transcript.mainTask}</span>
          </span>
        </div>
      </div>

      {/* Steps */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto terminal-scroll bg-bg-terminal"
      >
        <AnimatePresence>
          {transcript.steps.slice(0, visibleSteps).map((step, i) => (
            <motion.div
              key={`${transcript.id}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StepContent step={step} highlight={highlightLines.includes(i)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isRevealing && visibleSteps < totalSteps && (
          <div className="pl-16 py-2">
            <span className="text-accent-green cursor-blink">_</span>
          </div>
        )}
      </div>
    </div>
  );
}

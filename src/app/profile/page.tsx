"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HUD from "@/components/HUD";
import { GameState } from "@/lib/types";
import { loadGameState, resetGameState } from "@/lib/game-state";
import { getLevelForXp, getXpProgress } from "@/lib/levels";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default function ProfilePage() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(loadGameState());
  }, []);

  if (!state) return null;

  const level = getLevelForXp(state.xp);
  const xpProgress = getXpProgress(state.xp);
  const accuracy = state.totalPlayed > 0 ? ((state.totalCorrect / state.totalPlayed) * 100).toFixed(1) : "0.0";

  const handleReset = () => {
    if (confirm("Are you sure? This will erase all progress.")) {
      resetGameState();
      setState(loadGameState());
    }
  };

  return (
    <>
      <HUD state={state} />
      <div className="min-h-screen pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-3">&#x1F6E1;&#xFE0F;</div>
            <h1 className="text-4xl font-bold text-accent-green tracking-wider">{level.title}</h1>
            <p className="text-text-dim text-sm mt-1">Level {level.level} // {state.xp} Total XP</p>

            <div className="max-w-xs mx-auto mt-4">
              <div className="flex justify-between text-xs text-text-dim mb-1">
                <span>Progress to Level {level.level + 1}</span>
                <span>{xpProgress.current}/{xpProgress.needed} XP</span>
              </div>
              <div className="h-3 bg-bg-secondary rounded-full overflow-hidden border border-accent-green/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-green/60 to-accent-green rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress.percent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Transcripts Reviewed", value: state.totalPlayed, color: "text-text-primary" },
              { label: "Correct", value: state.totalCorrect, color: "text-accent-green" },
              { label: "Wrong", value: state.totalWrong, color: "text-accent-red" },
              { label: "Accuracy", value: `${accuracy}%`, color: "text-accent-amber" },
              { label: "Best Combo", value: `x${state.maxCombo}`, color: "text-accent-amber" },
              { label: "Current Streak", value: state.streak, color: "text-accent-green" },
              { label: "Tokens", value: state.tokens, color: "text-accent-cyan" },
              { label: "Speed Run Best", value: state.speedRunBest, color: "text-accent-purple" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-bg-secondary/50 border border-accent-green/10 rounded-lg text-center"
              >
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-text-dim mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-accent-amber tracking-wider mb-4">
              ACHIEVEMENTS ({state.achievements.length}/{ACHIEVEMENTS.length})
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {ACHIEVEMENTS.map((ach, i) => {
                const earned = state.achievements.includes(ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-3 rounded-lg border flex items-center gap-3 ${
                      earned
                        ? "border-accent-amber/30 bg-accent-amber/5"
                        : "border-text-dim/10 opacity-40"
                    }`}
                  >
                    <span className="text-2xl">{earned ? ach.icon : "&#x1F512;"}</span>
                    <div>
                      <div className="text-sm font-bold">{earned ? ach.name : "???"}</div>
                      <div className="text-xs text-text-dim">{ach.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-text-dim hover:text-accent-green transition-colors">
              &larr; BACK TO BASE
            </Link>
            <button
              onClick={handleReset}
              className="text-sm text-accent-red/40 hover:text-accent-red transition-colors ml-auto"
            >
              RESET ALL PROGRESS
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

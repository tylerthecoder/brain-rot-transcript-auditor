"use client";
import Link from "next/link";
import { GameState } from "@/lib/types";
import { getLevelForXp, getXpProgress } from "@/lib/levels";
import { motion } from "framer-motion";

interface HUDProps {
  state: GameState;
}

export default function HUD({ state }: HUDProps) {
  const level = getLevelForXp(state.xp);
  const xpProgress = getXpProgress(state.xp);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-sm border-b border-accent-green/20">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-6 text-sm">
        {/* Level & Title */}
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-bold text-lg">Lv.{level.level}</span>
          <span className="text-text-dim">{level.title}</span>
        </div>

        {/* XP Bar */}
        <div className="flex-1 max-w-xs">
          <div className="flex justify-between text-xs text-text-dim mb-0.5">
            <span>XP</span>
            <span>{xpProgress.current}/{xpProgress.needed}</span>
          </div>
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden border border-accent-green/20">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-green/60 to-accent-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Combo */}
        {state.combo > 0 && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={state.combo}
          >
            <span className="text-accent-amber font-bold text-lg">
              x{state.combo}
            </span>
            <span className="text-accent-amber/60 text-xs">COMBO</span>
          </motion.div>
        )}

        {/* Tokens + Shop */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-accent-cyan">{state.tokens}</span>
            <span className="text-text-dim text-xs">TKN</span>
          </div>
          <Link
            href="/shop"
            className="text-[10px] px-1.5 py-0.5 border border-accent-cyan/20 text-accent-cyan/50 hover:text-accent-cyan hover:border-accent-cyan/50 rounded transition-colors"
          >
            SHOP
          </Link>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <span className="text-accent-green">{state.totalCorrect}</span>
          <span>/</span>
          <span className="text-accent-red">{state.totalWrong}</span>
        </div>
      </div>
    </div>
  );
}

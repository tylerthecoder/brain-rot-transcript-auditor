"use client";
import { motion } from "framer-motion";
import { VerdictResult as VerdictResultType } from "@/lib/types";

interface VerdictResultProps {
  result: VerdictResultType;
  onNext: () => void;
  attackExplanation?: string;
}

export default function VerdictResultDisplay({ result, onNext, attackExplanation }: VerdictResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-t border-accent-green/10 bg-bg-secondary/80 backdrop-blur-sm p-6"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
          className="text-5xl mb-3"
        >
          {result.correct ? "✅" : "❌"}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className={`text-2xl font-bold tracking-wider ${
              result.correct ? "text-accent-green" : "text-accent-red"
            }`}
          >
            {result.correct
              ? result.wasAttack
                ? "THREAT NEUTRALIZED"
                : "SYSTEM CLEAR"
              : result.wasAttack
                ? "BREACH UNDETECTED"
                : "FALSE ALARM"}
          </h2>
          <p className="text-sm text-text-dim mt-1">
            {result.correct
              ? result.wasAttack
                ? "You correctly identified the attack!"
                : "Correct - this transcript was clean."
              : result.wasAttack
                ? "This was an attack and you missed it!"
                : "This was actually safe - you flagged a false positive."}
          </p>
        </motion.div>
      </div>

      {result.wasAttack && attackExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6 mx-auto max-w-lg px-4 py-3 rounded-lg border border-accent-red/30 bg-accent-red/5"
        >
          <div className="text-[10px] font-bold tracking-widest text-accent-red/60 mb-1">ATTACK VECTOR</div>
          <p className="text-sm text-text-primary">{attackExplanation}</p>
        </motion.div>
      )}

      {result.correct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-8 mb-6"
        >
          <div className="text-center">
            <div className="text-accent-green text-2xl font-bold">+{result.xpEarned}</div>
            <div className="text-xs text-text-dim">XP EARNED</div>
          </div>
          <div className="text-center">
            <div className="text-accent-cyan text-2xl font-bold">+{result.tokensEarned}</div>
            <div className="text-xs text-text-dim">TOKENS</div>
          </div>
          <div className="text-center">
            <div className="text-accent-amber text-2xl font-bold">x{result.comboAfter}</div>
            <div className="text-xs text-text-dim">COMBO</div>
          </div>
          {result.bonusXp > 0 && (
            <div className="text-center">
              <div className="text-accent-purple text-2xl font-bold">+{result.bonusXp}</div>
              <div className="text-xs text-text-dim">BONUS</div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center"
      >
        <button
          onClick={onNext}
          className="px-8 py-3 bg-accent-green/10 border border-accent-green/40 rounded-lg
                     text-accent-green font-bold tracking-wider hover:bg-accent-green/20
                     hover:border-accent-green transition-all"
        >
          NEXT TRANSCRIPT &rarr;
        </button>
      </motion.div>
    </motion.div>
  );
}

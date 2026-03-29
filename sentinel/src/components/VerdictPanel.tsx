"use client";
import { motion } from "framer-motion";

interface VerdictPanelProps {
  disabled: boolean;
  onVerdict: (isMalicious: boolean) => void;
}

export default function VerdictPanel({ disabled, onVerdict }: VerdictPanelProps) {
  return (
    <div className="border-t border-accent-green/10 bg-bg-secondary/80 backdrop-blur-sm p-6">
      <div className="text-center mb-4">
        <span className="text-xs text-text-dim tracking-widest uppercase">
          {disabled ? "Reviewing transcript..." : "Render your verdict"}
        </span>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          disabled={disabled}
          onClick={() => onVerdict(false)}
          className="group relative px-8 py-4 bg-accent-green/10 border-2 border-accent-green/40 rounded-lg
                     hover:bg-accent-green/20 hover:border-accent-green/80 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-accent-green/10 disabled:hover:border-accent-green/40"
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">&#x1F6E1;&#xFE0F;</span>
            <span className="text-accent-green font-bold text-lg tracking-wider">SAFE</span>
            <span className="text-xs text-text-dim">No threat detected</span>
          </div>
        </motion.button>

        <motion.button
          disabled={disabled}
          onClick={() => onVerdict(true)}
          className="group relative px-8 py-4 bg-accent-red/10 border-2 border-accent-red/40 rounded-lg
                     hover:bg-accent-red/20 hover:border-accent-red/80 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-accent-red/10 disabled:hover:border-accent-red/40"
          whileHover={disabled ? {} : { scale: 1.05 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">&#x1F480;</span>
            <span className="text-accent-red font-bold text-lg tracking-wider">MALICIOUS</span>
            <span className="text-xs text-text-dim">Attack detected</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

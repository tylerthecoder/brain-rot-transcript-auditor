"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LevelInfo } from "@/lib/types";
import { DIFFICULTY_CONFIG } from "@/lib/levels";

interface LevelUpModalProps {
  show: boolean;
  levelInfo: LevelInfo;
  onDismiss: () => void;
}

export default function LevelUpModal({ show, levelInfo, onDismiss }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-bg-secondary border border-accent-green/40 rounded-2xl p-10 max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl mb-4"
            >
              &#x1F31F;
            </motion.div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <h2 className="text-accent-green text-sm tracking-[0.3em] mb-2">LEVEL UP</h2>
              <div className="text-5xl font-bold text-accent-green mb-2">
                Level {levelInfo.level}
              </div>
              <div className="text-xl text-accent-amber mb-4">{levelInfo.title}</div>
            </motion.div>

            {levelInfo.unlocksAt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 px-4 py-3 bg-accent-purple/10 border border-accent-purple/30 rounded-lg"
              >
                <div className="text-xs text-accent-purple tracking-wider mb-1">NEW TIER UNLOCKED</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: DIFFICULTY_CONFIG[levelInfo.unlocksAt].color }}
                >
                  {DIFFICULTY_CONFIG[levelInfo.unlocksAt].label}
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={onDismiss}
              className="px-6 py-2 bg-accent-green/10 border border-accent-green/40 rounded-lg
                         text-accent-green hover:bg-accent-green/20 transition-all tracking-wider"
            >
              CONTINUE
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

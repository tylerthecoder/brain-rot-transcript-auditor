"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Achievement } from "@/lib/types";

interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export default function AchievementToast({ achievements, onDismiss }: AchievementToastProps) {
  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="bg-bg-secondary border border-accent-amber/40 rounded-lg p-4 min-w-[280px]
                       shadow-lg shadow-accent-amber/10 cursor-pointer"
            onClick={() => onDismiss(ach.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{ach.icon}</span>
              <div>
                <div className="text-xs text-accent-amber tracking-wider">ACHIEVEMENT UNLOCKED</div>
                <div className="text-sm font-bold text-text-primary">{ach.name}</div>
                <div className="text-xs text-text-dim">{ach.description}</div>
                <div className="text-xs mt-1">
                  <span className="text-accent-green">+{ach.xpReward} XP</span>
                  {" "}
                  <span className="text-accent-cyan">+{ach.tokenReward} TKN</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlitchText from "@/components/GlitchText";
import MatrixRain from "@/components/MatrixRain";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { getLevelForXp } from "@/lib/levels";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [hasExistingSave, setHasExistingSave] = useState(false);
  const [level, setLevel] = useState(1);
  const [title, setTitle] = useState("Trainee");

  useEffect(() => {
    const state = loadGameState();
    if (state.totalPlayed > 0) {
      setHasExistingSave(true);
      const info = getLevelForXp(state.xp);
      setLevel(info.level);
      setTitle(info.title);
    }
    setLoaded(true);
  }, []);

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [devFlash, setDevFlash] = useState(false);

  const handleDevClick = () => {
    if (process.env.NODE_ENV !== "development") return;
    clickCountRef.current++;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 800);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      const s = loadGameState();
      s.tokens += 1000;
      saveGameState(s);
      setDevFlash(true);
      setTimeout(() => setDevFlash(false), 1500);
    }
  };

  if (!loaded) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <MatrixRain />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-lg w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-xs tracking-[0.5em] text-accent-green/50 mb-4">
            AI THREAT DETECTION SYSTEM
          </div>
          <GlitchText
            text="SENTINEL"
            className="text-7xl md:text-9xl font-bold text-accent-green tracking-wider"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-text-dim mt-4 text-sm max-w-md mx-auto"
          >
            Review AI agent transcripts. Identify rogue behavior.
            <br />
            Protect the system.
          </motion.div>
        </motion.div>

        {/* Big PLAY button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col items-center gap-2 w-full"
        >
          <Link href="/play" className="w-full max-w-xs">
            <motion.button
              className="btn-glow w-full px-10 py-5 bg-accent-green/10 border-2 border-accent-green/60
                         rounded-lg text-accent-green font-bold text-2xl tracking-[0.3em]
                         hover:bg-accent-green/20 hover:border-accent-green transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              PLAY
            </motion.button>
          </Link>

          {hasExistingSave && (
            <span className="text-xs text-text-dim">
              Level {level} {title}
            </span>
          )}
        </motion.div>

        {/* Game Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          <Link href="/play/speedrun"
            className="p-3 rounded-lg border border-accent-amber/20 hover:border-accent-amber/60
                       hover:bg-bg-secondary/80 text-center transition-all">
            <div className="text-accent-amber font-bold text-sm">SPEED RUN</div>
            <div className="text-xs text-text-dim">60s blitz</div>
          </Link>
          <Link href="/play/boss"
            className="p-3 rounded-lg border border-accent-red/20 hover:border-accent-red/60
                       hover:bg-bg-secondary/80 text-center transition-all">
            <div className="text-accent-red font-bold text-sm">BOSS FIGHT</div>
            <div className="text-xs text-text-dim">Name the attack</div>
          </Link>
          <Link href="/play/endless"
            className="p-3 rounded-lg border border-accent-purple/20 hover:border-accent-purple/60
                       hover:bg-bg-secondary/80 text-center transition-all">
            <div className="text-accent-purple font-bold text-sm">ENDLESS</div>
            <div className="text-xs text-text-dim">3 lives</div>
          </Link>
          <Link href="/play/daily"
            className="p-3 rounded-lg border border-accent-cyan/20 hover:border-accent-cyan/60
                       hover:bg-bg-secondary/80 text-center transition-all">
            <div className="text-accent-cyan font-bold text-sm">DAILY</div>
            <div className="text-xs text-text-dim">2x rewards</div>
          </Link>
        </motion.div>

        {/* Shop & Profile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex gap-4"
        >
          <Link href="/shop">
            <button className="px-5 py-2 text-sm border border-accent-cyan/30 text-accent-cyan/60
                             hover:text-accent-cyan hover:border-accent-cyan/60 transition-all rounded">
              SHOP
            </button>
          </Link>
          <Link href="/profile">
            <button className="px-5 py-2 text-sm border border-accent-purple/30 text-accent-purple/60
                             hover:text-accent-purple hover:border-accent-purple/60 transition-all rounded">
              PROFILE
            </button>
          </Link>
        </motion.div>

        {/* Footer — triple-click in dev to add 1000 tokens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2 }}
          className={`text-xs mt-6 cursor-default select-none transition-colors duration-300 ${
            devFlash ? "text-accent-cyan opacity-100" : "text-text-dim"
          }`}
          onClick={handleDevClick}
        >
          {devFlash ? "+1000 TOKENS INJECTED" : "v2.0.0 // CLASSIFICATION: TOP SECRET"}
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TranscriptViewer from "@/components/TranscriptViewer";
import VerdictPanel from "@/components/VerdictPanel";
import VerdictResultDisplay from "@/components/VerdictResult";
import HUD from "@/components/HUD";
import LevelUpModal from "@/components/LevelUpModal";
import AchievementToast from "@/components/AchievementToast";
import Confetti from "@/components/Confetti";
import SpeedLines from "@/components/SpeedLines";
import AITaunt from "@/components/AITaunt";
import SlotMachine from "@/components/SlotMachine";
import TwitchChat from "@/components/TwitchChat";
import SubwaySurfer from "@/components/SubwaySurfer";
import DancingAnimeGirl from "@/components/DancingAnimeGirl";
import MLGOverlay from "@/components/MLGOverlay";
import DramaticNarrator from "@/components/DramaticNarrator";
import Jumpscare from "@/components/Jumpscare";
import HackerTyper from "@/components/HackerTyper";
import CriticalHit from "@/components/CriticalHit";
import { GameState, Transcript, VerdictResult, Achievement } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { calculateVerdict, applyVerdict } from "@/lib/scoring";
import { getLevelForXp } from "@/lib/levels";
import { getAutoTranscript } from "@/lib/transcripts";
import { checkAchievements } from "@/lib/achievements";
import {
  playCorrect, playWrong, playCombo, playLevelUp, playCoin, playAirHorn, playBuzz,
} from "@/lib/sounds";

type Phase = "reviewing" | "verdict" | "result";

export default function PlayPage() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [phase, setPhase] = useState<Phase>("reviewing");
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [shake, setShake] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<ReturnType<typeof getLevelForXp> | null>(null);
  const [toastAchievements, setToastAchievements] = useState<Achievement[]>([]);
  const [falsePositives, setFalsePositives] = useState(0);
  const [missedAttacks, setMissedAttacks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTaunt, setShowTaunt] = useState(false);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showMLG, setShowMLG] = useState(false);
  const [showNarrator, setShowNarrator] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [showCriticalHit, setShowCriticalHit] = useState(false);
  const [critXp, setCritXp] = useState(0);
  const [showShopPrompt, setShowShopPrompt] = useState(false);
  const transcriptCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);

  const has = useCallback((s: GameState, id: string) => !!s.perks[id]?.owned, []);

  const loadNext = useCallback((s: GameState) => {
    const level = getLevelForXp(s.xp).level;
    const next = getAutoTranscript(s.totalPlayed, s.totalCorrect, level, s.completedTranscripts);
    if (next) {
      setTranscript(next);
      setPhase("reviewing");
      startTimeRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    const s = loadGameState();
    setState(s);
    loadNext(s);
  }, [loadNext]);

  const handleTranscriptComplete = useCallback(() => {
    setPhase("verdict");
  }, []);

  const handleAbort = () => {
    router.push("/");
  };

  const handleVerdict = (playerSaidAttack: boolean) => {
    if (!transcript || !state) return;
    const elapsed = Date.now() - startTimeRef.current;

    const verdictResult = calculateVerdict(
      transcript.isAttack,
      playerSaidAttack,
      transcript.difficulty,
      state.combo,
      undefined,
      transcript.attackLines,
      elapsed
    );

    const oldLevel = getLevelForXp(state.xp);
    const newState = applyVerdict(state, verdictResult);
    newState.completedTranscripts = [...newState.completedTranscripts, transcript.id];

    let fp = falsePositives;
    let ma = missedAttacks;
    if (!verdictResult.correct) {
      if (!transcript.isAttack && playerSaidAttack) fp++;
      if (transcript.isAttack && !playerSaidAttack) ma++;
    }
    setFalsePositives(fp);
    setMissedAttacks(ma);

    const newLevelInfo = getLevelForXp(newState.xp);
    if (newLevelInfo.level > oldLevel.level) {
      setNewLevel(newLevelInfo);
      setShowLevelUp(true);
      if (has(newState, "sound_effects")) playLevelUp();
    }

    const earned = checkAchievements(newState, {
      lastVerdictCorrect: verdictResult.correct,
      lastWasAttack: transcript.isAttack,
      lastPlayerSaidAttack: playerSaidAttack,
      lastDifficulty: transcript.difficulty,
      falsePositives: fp,
      missedAttacks: ma,
    });

    if (earned.length > 0) {
      newState.achievements = [...newState.achievements, ...earned.map((a) => a.id)];
      for (const a of earned) {
        newState.xp += a.xpReward;
        newState.tokens += a.tokenReward;
      }
      setToastAchievements((prev) => [...prev, ...earned]);
    }

    saveGameState(newState);
    setState(newState);
    setResult(verdictResult);

    transcriptCountRef.current++;

    if (verdictResult.correct) {
      setFlash("correct");
      if (has(newState, "sound_effects")) playCorrect();
      if (has(newState, "sound_effects") && verdictResult.comboAfter > 1) playCombo();
      if (has(newState, "mlg_airhorn")) {
        playAirHorn();
        setShowMLG(true);
      }
      if (has(newState, "confetti_cannon")) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      if (newState.totalCorrect % 5 === 0) {
        if (has(newState, "sound_effects")) playCoin();
        setTimeout(() => setShowSlotMachine(true), 1000);
      }
      if (has(newState, "critical_hit") && verdictResult.comboAfter >= 3 && Math.random() < 0.3) {
        setCritXp(verdictResult.xpEarned);
        setShowCriticalHit(true);
      }
    } else {
      setFlash("wrong");
      if (has(newState, "sound_effects")) playWrong();
      if (has(newState, "screen_shake")) setShake(true);
      if (has(newState, "ai_taunts")) setShowTaunt(true);
      if (has(newState, "dramatic_narrator")) setShowNarrator(true);
      if (has(newState, "jumpscare") && transcript.isAttack && !playerSaidAttack && Math.random() < 0.5) {
        playBuzz();
        setShowJumpscare(true);
      }
    }

    setTimeout(() => setFlash(null), 400);
    setTimeout(() => setShake(false), 500);

    setShowShopPrompt(transcriptCountRef.current % 3 === 0);

    setPhase("result");
  };

  const handleNext = () => {
    if (state) loadNext(state);
    setResult(null);
    setShowTaunt(false);
    setShowNarrator(false);
    setShowShopPrompt(false);
  };

  const handleSlotWin = (amount: number) => {
    if (!state) return;
    if (has(state, "sound_effects")) playCoin();
    const newState = { ...state, tokens: state.tokens + amount };
    saveGameState(newState);
    setState(newState);
    setShowSlotMachine(false);
  };

  const dismissAchievement = (id: string) => {
    setToastAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  if (!state || !transcript) return null;

  const modeClasses = [
    has(state, "rainbow_mode") && "rainbow-mode",
    has(state, "comic_sans") && "comic-sans-mode",
    has(state, "big_head") && "big-head-mode",
  ].filter(Boolean).join(" ");

  return (
    <div className={modeClasses}>
      <HUD state={state} />

      {flash === "correct" && <div className="flash-correct" />}
      {flash === "wrong" && <div className="flash-wrong" />}

      {has(state, "speed_lines") && state.combo >= 5 && (
        <SpeedLines intensity={state.combo >= 10 ? "super" : "normal"} />
      )}

      {state.combo >= 10 && <div className="combo-fire" />}

      {has(state, "hacker_typer") && phase === "reviewing" && <HackerTyper />}
      {has(state, "dancing_anime_girl") && <DancingAnimeGirl />}

      {showConfetti && <Confetti level={has(state, "confetti_cannon_3") ? 3 : has(state, "confetti_cannon_2") ? 2 : 1} />}
      {showTaunt && <AITaunt onDismiss={() => setShowTaunt(false)} />}
      {showNarrator && <DramaticNarrator onDismiss={() => setShowNarrator(false)} />}
      {showSlotMachine && <SlotMachine onComplete={handleSlotWin} />}
      {showMLG && <MLGOverlay tier={has(state, "mlg_airhorn_2") ? 2 : 1} onDone={() => setShowMLG(false)} />}
      {showJumpscare && <Jumpscare onDone={() => setShowJumpscare(false)} />}
      {showCriticalHit && <CriticalHit xpAmount={critXp} onDone={() => setShowCriticalHit(false)} />}

      <AchievementToast achievements={toastAchievements} onDismiss={dismissAchievement} />

      {newLevel && (
        <LevelUpModal show={showLevelUp} levelInfo={newLevel} onDismiss={() => setShowLevelUp(false)} />
      )}

      <div className={`h-screen flex flex-col pt-12 ${shake ? "screen-shake" : ""}`}>
        <div className="flex-1 flex overflow-hidden min-h-0">
          {has(state, "twitch_chat") && (
            <div className="w-72 flex-shrink-0 border-r border-accent-purple/20 overflow-hidden">
              <TwitchChat transcript={transcript} isAttack={transcript.isAttack} />
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <TranscriptViewer
              transcript={transcript}
              onComplete={handleTranscriptComplete}
              onAbort={handleAbort}
              speed={1}
            />
          </div>

          {has(state, "subway_surfer") && (
            <div className="w-80 flex-shrink-0 border-l border-accent-cyan/20">
              <SubwaySurfer />
            </div>
          )}
        </div>

        {phase === "verdict" && (
          <VerdictPanel disabled={false} onVerdict={handleVerdict} />
        )}

        {phase === "result" && result && (
          <div>
            <VerdictResultDisplay result={result} onNext={handleNext} />
            {showShopPrompt && (
              <div className="flex justify-center pb-3 -mt-1">
                <Link
                  href="/shop"
                  className="text-xs px-3 py-1 border border-accent-cyan/30 text-accent-cyan/60
                             hover:text-accent-cyan hover:border-accent-cyan/60 rounded transition-all animate-pulse"
                >
                  Got tokens? Visit the SHOP
                </Link>
              </div>
            )}
          </div>
        )}

        {phase === "reviewing" && (
          <VerdictPanel disabled={true} onVerdict={handleVerdict} />
        )}
      </div>
    </div>
  );
}

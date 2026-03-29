"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { GameState, Transcript, VerdictResult, Achievement } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { calculateVerdict, applyVerdict } from "@/lib/scoring";
import { getLevelForXp } from "@/lib/levels";
import { getAutoTranscript } from "@/lib/transcripts";
import { checkAchievements } from "@/lib/achievements";

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
  const startTimeRef = useRef<number>(0);

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

    if (verdictResult.correct) {
      setFlash("correct");
      if (newState.perks.confetti_cannon?.owned) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      if (newState.totalCorrect % 5 === 0) {
        setTimeout(() => setShowSlotMachine(true), 1000);
      }
    } else {
      setFlash("wrong");
      setShake(true);
      if (newState.perks.ai_taunts?.owned) {
        setShowTaunt(true);
      }
    }

    setTimeout(() => setFlash(null), 400);
    setTimeout(() => setShake(false), 500);

    setPhase("result");
  };

  const handleNext = () => {
    if (state) loadNext(state);
    setResult(null);
    setShowTaunt(false);
  };

  const handleSlotWin = (amount: number) => {
    if (!state) return;
    const newState = { ...state, tokens: state.tokens + amount };
    saveGameState(newState);
    setState(newState);
    setShowSlotMachine(false);
  };

  const dismissAchievement = (id: string) => {
    setToastAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  if (!state || !transcript) return null;

  const hasRainbow = state.perks.rainbow_mode?.owned;
  const hasSubwaySurfer = state.perks.subway_surfer?.owned;
  const hasTwitchChat = state.perks.twitch_chat?.owned;

  return (
    <div className={hasRainbow ? "rainbow-mode" : ""}>
      <HUD state={state} />

      {flash === "correct" && <div className="flash-correct" />}
      {flash === "wrong" && <div className="flash-wrong" />}

      {state.combo >= 5 && state.perks.speed_lines?.owned && (
        <SpeedLines intensity={state.combo >= 10 ? "super" : "normal"} />
      )}

      {state.combo >= 10 && <div className="combo-fire" />}

      {showConfetti && <Confetti level={state.perks.confetti_cannon_2?.owned ? (state.perks.confetti_cannon_3?.owned ? 3 : 2) : 1} />}
      {showTaunt && <AITaunt onDismiss={() => setShowTaunt(false)} />}
      {showSlotMachine && <SlotMachine onComplete={handleSlotWin} />}

      <AchievementToast achievements={toastAchievements} onDismiss={dismissAchievement} />

      {newLevel && (
        <LevelUpModal show={showLevelUp} levelInfo={newLevel} onDismiss={() => setShowLevelUp(false)} />
      )}

      <div className={`h-screen flex flex-col pt-12 ${shake ? "screen-shake" : ""}`}>
        <div className="flex-1 flex overflow-hidden min-h-0">
          {hasTwitchChat && (
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

          {hasSubwaySurfer && (
            <div className="w-80 flex-shrink-0 border-l border-accent-cyan/20">
              <SubwaySurfer />
            </div>
          )}
        </div>

        {phase === "verdict" && (
          <VerdictPanel disabled={false} onVerdict={handleVerdict} />
        )}

        {phase === "result" && result && (
          <VerdictResultDisplay result={result} onNext={handleNext} />
        )}

        {phase === "reviewing" && (
          <VerdictPanel disabled={true} onVerdict={handleVerdict} />
        )}
      </div>
    </div>
  );
}

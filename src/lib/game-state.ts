import { GameState } from "./types";

const STORAGE_KEY = "sentinel-game-state";

export const DEFAULT_STATE: GameState = {
  level: 1,
  xp: 0,
  tokens: 0,
  combo: 0,
  maxCombo: 0,
  totalCorrect: 0,
  totalWrong: 0,
  totalPlayed: 0,
  streak: 0,
  completedTranscripts: [],
  achievements: [],
  perks: {},
  currentTier: "tutorial",
  highScore: 0,
  speedRunBest: 0,
  dailyLastPlayed: "",
  dailyStreak: 0,
};

export function loadGameState(): GameState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetGameState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

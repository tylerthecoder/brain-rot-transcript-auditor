export type Difficulty = "tutorial" | "bronze" | "silver" | "gold" | "diamond";

export interface TranscriptStep {
  type: "thought" | "action" | "output" | "error";
  content: string;
}

export interface Transcript {
  id: string;
  difficulty: Difficulty;
  environment: string;
  mainTask: string;
  sideTask?: string;
  isAttack: boolean;
  steps: TranscriptStep[];
  attackLines?: number[];
  briefing: string;
  attackExplanation?: string;
}

export interface GameState {
  level: number;
  xp: number;
  tokens: number;
  combo: number;
  maxCombo: number;
  totalCorrect: number;
  totalWrong: number;
  totalPlayed: number;
  streak: number;
  completedTranscripts: string[];
  achievements: string[];
  perks: PerkOwnership;
  currentTier: Difficulty;
  highScore: number;
  speedRunBest: number;
  dailyLastPlayed: string;
  dailyStreak: number;
}

export interface PerkOwnership {
  [perkId: string]: {
    owned: boolean;
    uses?: number;
  };
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "active" | "passive";
  maxUses?: number;
  icon: string;
  tier: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  xpReward: number;
  tokenReward: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  unlocksAt?: Difficulty;
}

export type GameMode = "campaign" | "speedrun" | "boss" | "endless" | "daily";

export interface VerdictResult {
  correct: boolean;
  wasAttack: boolean;
  playerSaidAttack: boolean;
  xpEarned: number;
  tokensEarned: number;
  comboAfter: number;
  taggedLines?: number[];
  bonusXp: number;
}

export interface SpeedRunState {
  timeRemaining: number;
  correctCount: number;
  wrongCount: number;
  score: number;
}

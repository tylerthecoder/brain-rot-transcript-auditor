import { LevelInfo, Difficulty } from "./types";

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Trainee", xpRequired: 0, unlocksAt: "tutorial" },
  { level: 2, title: "Trainee", xpRequired: 100 },
  { level: 3, title: "Junior Analyst", xpRequired: 250, unlocksAt: "bronze" },
  { level: 4, title: "Junior Analyst", xpRequired: 450 },
  { level: 5, title: "Junior Analyst", xpRequired: 700 },
  { level: 6, title: "Analyst", xpRequired: 1000 },
  { level: 7, title: "Analyst", xpRequired: 1400, unlocksAt: "silver" },
  { level: 8, title: "Analyst", xpRequired: 1900 },
  { level: 9, title: "Senior Analyst", xpRequired: 2500 },
  { level: 10, title: "Senior Analyst", xpRequired: 3200 },
  { level: 11, title: "Senior Analyst", xpRequired: 4000 },
  { level: 12, title: "Lead Investigator", xpRequired: 5000, unlocksAt: "gold" },
  { level: 13, title: "Lead Investigator", xpRequired: 6200 },
  { level: 14, title: "Lead Investigator", xpRequired: 7600 },
  { level: 15, title: "Chief Sentinel", xpRequired: 9200 },
  { level: 16, title: "Chief Sentinel", xpRequired: 11000 },
  { level: 17, title: "Chief Sentinel", xpRequired: 13000 },
  { level: 18, title: "Legendary Sentinel", xpRequired: 15500, unlocksAt: "diamond" },
  { level: 19, title: "Legendary Sentinel", xpRequired: 18500 },
  { level: 20, title: "Legendary Sentinel", xpRequired: 22000 },
  { level: 21, title: "Mythic Sentinel", xpRequired: 26000 },
  { level: 22, title: "Mythic Sentinel", xpRequired: 30500 },
  { level: 23, title: "Mythic Sentinel", xpRequired: 35500 },
  { level: 24, title: "Mythic Sentinel", xpRequired: 41000 },
  { level: 25, title: "Transcendent", xpRequired: 50000 },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(currentLevel: number): LevelInfo | null {
  const idx = LEVELS.findIndex((l) => l.level === currentLevel);
  if (idx < 0 || idx >= LEVELS.length - 1) return null;
  return LEVELS[idx + 1];
}

export function getXpProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelForXp(xp);
  const next = getNextLevel(level.level);
  if (!next) return { current: 0, needed: 1, percent: 100 };
  const current = xp - level.xpRequired;
  const needed = next.xpRequired - level.xpRequired;
  return { current, needed, percent: Math.min(100, (current / needed) * 100) };
}

export function getUnlockedTiers(level: number): Difficulty[] {
  const tiers: Difficulty[] = [];
  for (const l of LEVELS) {
    if (l.level <= level && l.unlocksAt) {
      tiers.push(l.unlocksAt);
    }
  }
  return tiers;
}

export function getHighestUnlockedTier(level: number): Difficulty {
  const tiers = getUnlockedTiers(level);
  return tiers[tiers.length - 1] || "tutorial";
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; baseXp: number; baseTokens: number }> = {
  tutorial: { label: "TUTORIAL", color: "#888", baseXp: 25, baseTokens: 5 },
  bronze: { label: "BRONZE", color: "#cd7f32", baseXp: 50, baseTokens: 10 },
  silver: { label: "SILVER", color: "#c0c0c0", baseXp: 80, baseTokens: 18 },
  gold: { label: "GOLD", color: "#ffd700", baseXp: 120, baseTokens: 30 },
  diamond: { label: "DIAMOND", color: "#b9f2ff", baseXp: 200, baseTokens: 50 },
};

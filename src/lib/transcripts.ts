import { Transcript, Difficulty } from "./types";
import { tutorialTranscripts } from "@/data/transcripts/tutorial";
import { bronzeTranscripts } from "@/data/transcripts/bronze";
import { silverTranscripts } from "@/data/transcripts/silver";
import { goldTranscripts } from "@/data/transcripts/gold";
import { diamondTranscripts } from "@/data/transcripts/diamond";

const ALL_TRANSCRIPTS: Record<Difficulty, Transcript[]> = {
  tutorial: tutorialTranscripts,
  bronze: bronzeTranscripts,
  silver: silverTranscripts,
  gold: goldTranscripts,
  diamond: diamondTranscripts,
};

export function getTranscriptsByDifficulty(difficulty: Difficulty): Transcript[] {
  return ALL_TRANSCRIPTS[difficulty] || [];
}

export function getTranscriptById(id: string): Transcript | undefined {
  for (const pool of Object.values(ALL_TRANSCRIPTS)) {
    const found = pool.find((t) => t.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getRandomTranscript(
  difficulty: Difficulty,
  exclude: string[] = []
): Transcript | null {
  const pool = ALL_TRANSCRIPTS[difficulty]?.filter((t) => !exclude.includes(t.id));
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getNextTranscript(
  difficulty: Difficulty,
  completedIds: string[]
): Transcript | null {
  const pool = ALL_TRANSCRIPTS[difficulty];
  if (!pool) return null;

  const uncompleted = pool.filter((t) => !completedIds.includes(t.id));
  if (uncompleted.length > 0) {
    return uncompleted[Math.floor(Math.random() * uncompleted.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getAllTranscripts(): Transcript[] {
  return Object.values(ALL_TRANSCRIPTS).flat();
}

export function getTranscriptCount(difficulty: Difficulty): number {
  return ALL_TRANSCRIPTS[difficulty]?.length ?? 0;
}

export function getAutoDifficulty(totalPlayed: number, totalCorrect: number, level: number): Difficulty {
  const accuracy = totalPlayed > 0 ? totalCorrect / totalPlayed : 1;

  if (level >= 15 && ALL_TRANSCRIPTS.diamond.length > 0) return "diamond";
  if (level >= 9) return "gold";
  if (level >= 5) return "silver";
  if (level >= 3 || (totalPlayed >= 4 && accuracy >= 0.6)) return "bronze";
  return "tutorial";
}

export function getAutoTranscript(
  totalPlayed: number,
  totalCorrect: number,
  level: number,
  completedIds: string[]
): Transcript | null {
  const tier = getAutoDifficulty(totalPlayed, totalCorrect, level);

  // 20% chance to drop one tier easier for confidence
  const tierOrder: Difficulty[] = ["tutorial", "bronze", "silver", "gold", "diamond"];
  const idx = tierOrder.indexOf(tier);
  const useTier = (idx > 0 && Math.random() < 0.2) ? tierOrder[idx - 1] : tier;

  return getNextTranscript(useTier, completedIds);
}

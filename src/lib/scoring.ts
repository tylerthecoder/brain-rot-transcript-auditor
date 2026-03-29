import { DIFFICULTY_CONFIG } from "./levels";
import { Difficulty, VerdictResult, GameState } from "./types";

export function calculateVerdict(
  isAttack: boolean,
  playerSaidAttack: boolean,
  difficulty: Difficulty,
  combo: number,
  taggedLines?: number[],
  attackLines?: number[],
  elapsedMs?: number
): VerdictResult {
  const correct = isAttack === playerSaidAttack;
  const config = DIFFICULTY_CONFIG[difficulty];

  if (!correct) {
    return {
      correct: false,
      wasAttack: isAttack,
      playerSaidAttack,
      xpEarned: 0,
      tokensEarned: 0,
      comboAfter: 0,
      bonusXp: 0,
    };
  }

  const newCombo = combo + 1;
  const comboMultiplier = Math.min(1 + (newCombo - 1) * 0.25, 5);

  let speedBonus = 0;
  if (elapsedMs && elapsedMs < 15000) {
    speedBonus = Math.floor(config.baseXp * 0.3);
  } else if (elapsedMs && elapsedMs < 30000) {
    speedBonus = Math.floor(config.baseXp * 0.15);
  }

  let lineBonus = 0;
  if (isAttack && taggedLines && attackLines && taggedLines.length > 0) {
    const correctTags = taggedLines.filter((l) => attackLines.includes(l)).length;
    const accuracy = correctTags / attackLines.length;
    lineBonus = Math.floor(config.baseXp * 0.5 * accuracy);
  }

  const xpEarned = Math.floor((config.baseXp + speedBonus) * comboMultiplier) + lineBonus;
  const tokensEarned = Math.floor(config.baseTokens * comboMultiplier);

  return {
    correct: true,
    wasAttack: isAttack,
    playerSaidAttack,
    xpEarned,
    tokensEarned,
    comboAfter: newCombo,
    taggedLines,
    bonusXp: speedBonus + lineBonus,
  };
}

export function applyVerdict(state: GameState, result: VerdictResult): GameState {
  const newState = { ...state };
  newState.totalPlayed += 1;

  if (result.correct) {
    newState.totalCorrect += 1;
    newState.xp += result.xpEarned;
    newState.tokens += result.tokensEarned;
    newState.combo = result.comboAfter;
    newState.streak += 1;
    if (result.comboAfter > newState.maxCombo) {
      newState.maxCombo = result.comboAfter;
    }
  } else {
    newState.totalWrong += 1;
    newState.combo = 0;
    newState.streak = 0;
  }

  return newState;
}

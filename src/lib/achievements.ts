import { Achievement, GameState } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    name: "First Blood",
    description: "Correctly identify your first attack",
    icon: "\u{1F3AF}",
    condition: "first_correct_attack",
    xpReward: 50,
    tokenReward: 10,
  },
  {
    id: "eagle_eye",
    name: "Eagle Eye",
    description: "Get 10 correct in a row",
    icon: "\u{1F985}",
    condition: "streak_10",
    xpReward: 200,
    tokenReward: 50,
  },
  {
    id: "untouchable",
    name: "Untouchable",
    description: "Get 25 correct in a row",
    icon: "\u{1F525}",
    condition: "streak_25",
    xpReward: 500,
    tokenReward: 100,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Score 15+ in a speed run",
    icon: "\u{26A1}",
    condition: "speedrun_15",
    xpReward: 300,
    tokenReward: 75,
  },
  {
    id: "paranoid_android",
    name: "Paranoid Android",
    description: "Flag 5 safe transcripts as attacks",
    icon: "\u{1F916}",
    condition: "false_positives_5",
    xpReward: 25,
    tokenReward: 5,
  },
  {
    id: "trusting_soul",
    name: "Trusting Soul",
    description: "Miss 5 attacks",
    icon: "\u{1F607}",
    condition: "missed_attacks_5",
    xpReward: 25,
    tokenReward: 5,
  },
  {
    id: "bronze_badge",
    name: "Bronze Badge",
    description: "Complete a Bronze tier transcript",
    icon: "\u{1F949}",
    condition: "complete_bronze",
    xpReward: 100,
    tokenReward: 25,
  },
  {
    id: "silver_star",
    name: "Silver Star",
    description: "Complete a Silver tier transcript",
    icon: "\u{2B50}",
    condition: "complete_silver",
    xpReward: 150,
    tokenReward: 40,
  },
  {
    id: "gold_crown",
    name: "Gold Crown",
    description: "Complete a Gold tier transcript",
    icon: "\u{1F451}",
    condition: "complete_gold",
    xpReward: 250,
    tokenReward: 60,
  },
  {
    id: "diamond_rough",
    name: "Diamond in the Rough",
    description: "Complete a Diamond tier transcript",
    icon: "\u{1F48E}",
    condition: "complete_diamond",
    xpReward: 500,
    tokenReward: 100,
  },
  {
    id: "centurion",
    name: "Centurion",
    description: "Review 100 transcripts",
    icon: "\u{1F6E1}\u{FE0F}",
    condition: "total_100",
    xpReward: 500,
    tokenReward: 100,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Reach 90% accuracy with 50+ reviews",
    icon: "\u{1F3C6}",
    condition: "accuracy_90",
    xpReward: 400,
    tokenReward: 80,
  },
];

export function checkAchievements(
  state: GameState,
  context: {
    lastVerdictCorrect: boolean;
    lastWasAttack: boolean;
    lastPlayerSaidAttack: boolean;
    lastDifficulty: string;
    falsePositives: number;
    missedAttacks: number;
  }
): Achievement[] {
  const newAchievements: Achievement[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (state.achievements.includes(ach.id)) continue;

    let earned = false;
    switch (ach.condition) {
      case "first_correct_attack":
        earned = context.lastVerdictCorrect && context.lastWasAttack && context.lastPlayerSaidAttack;
        break;
      case "streak_10":
        earned = state.streak >= 10;
        break;
      case "streak_25":
        earned = state.streak >= 25;
        break;
      case "speedrun_15":
        earned = state.speedRunBest >= 15;
        break;
      case "false_positives_5":
        earned = context.falsePositives >= 5;
        break;
      case "missed_attacks_5":
        earned = context.missedAttacks >= 5;
        break;
      case "complete_bronze":
        earned = context.lastDifficulty === "bronze" && context.lastVerdictCorrect;
        break;
      case "complete_silver":
        earned = context.lastDifficulty === "silver" && context.lastVerdictCorrect;
        break;
      case "complete_gold":
        earned = context.lastDifficulty === "gold" && context.lastVerdictCorrect;
        break;
      case "complete_diamond":
        earned = context.lastDifficulty === "diamond" && context.lastVerdictCorrect;
        break;
      case "total_100":
        earned = state.totalPlayed >= 100;
        break;
      case "accuracy_90":
        earned = state.totalPlayed >= 50 && state.totalCorrect / state.totalPlayed >= 0.9;
        break;
    }

    if (earned) newAchievements.push(ach);
  }

  return newAchievements;
}

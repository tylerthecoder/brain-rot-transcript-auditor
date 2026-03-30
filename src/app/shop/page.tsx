"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HUD from "@/components/HUD";
import { GameState } from "@/lib/types";
import { loadGameState, saveGameState } from "@/lib/game-state";
import { PERKS } from "@/lib/perks";

const COSMETIC_IDS = [
  "subway_surfer", "rainbow_mode", "confetti_cannon", "confetti_cannon_2",
  "confetti_cannon_3", "speed_lines", "ai_taunts", "twitch_chat",
  "screen_shake", "sound_effects", "dancing_anime_girl", "mlg_airhorn",
  "mlg_airhorn_2", "comic_sans", "dramatic_narrator", "jumpscare",
  "big_head", "hacker_typer", "critical_hit",
];

export default function ShopPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [buyFlash, setBuyFlash] = useState<string | null>(null);

  useEffect(() => {
    setState(loadGameState());
  }, []);

  if (!state) return null;

  const handleBuy = (perkId: string, cost: number) => {
    if (state.tokens < cost) return;
    const newState = { ...state };
    newState.tokens -= cost;

    const perk = PERKS.find((p) => p.id === perkId)!;
    if (perk.type === "passive") {
      newState.perks = { ...newState.perks, [perkId]: { owned: true } };
    } else {
      const existing = newState.perks[perkId];
      const currentUses = existing?.uses ?? 0;
      newState.perks = { ...newState.perks, [perkId]: { owned: true, uses: currentUses + (perk.maxUses ?? 1) } };
    }

    saveGameState(newState);
    setState(newState);
    setBuyFlash(perkId);
    setTimeout(() => setBuyFlash(null), 600);
  };

  const cosmeticPerks = PERKS.filter((p) => COSMETIC_IDS.includes(p.id));
  const activePerksList = PERKS.filter((p) => p.type === "active");
  const passivePerksList = PERKS.filter((p) => p.type === "passive" && !COSMETIC_IDS.includes(p.id));

  const renderPerkCard = (perk: typeof PERKS[0], i: number, borderColor: string, btnColor: string) => {
    const owned = state.perks[perk.id]?.owned ?? false;
    const uses = state.perks[perk.id]?.uses;
    const isActive = perk.type === "active";

    return (
      <motion.div
        key={perk.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.04 }}
        className={`p-4 rounded-lg border transition-all ${
          owned && !isActive
            ? "border-accent-green/40 bg-accent-green/5"
            : buyFlash === perk.id
              ? "border-accent-green bg-accent-green/10"
              : "border-accent-green/10 bg-bg-secondary/50"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{perk.icon}</span>
            <div>
              <div className="font-bold text-sm">{perk.name}</div>
              <div className="text-xs text-text-dim">{perk.description}</div>
              {isActive && uses !== undefined && uses > 0 && (
                <div className="text-xs text-accent-green mt-1">{uses} uses remaining</div>
              )}
            </div>
          </div>
          {owned && !isActive ? (
            <span className="text-xs text-accent-green tracking-wider">OWNED</span>
          ) : (
            <button
              onClick={() => handleBuy(perk.id, perk.cost)}
              disabled={state.tokens < perk.cost}
              className={`px-3 py-1 text-xs border ${borderColor} ${btnColor} rounded
                         hover:bg-opacity-10 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                         whitespace-nowrap`}
            >
              {perk.cost} TKN
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <HUD state={state} />
      <div className="min-h-screen pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-accent-cyan tracking-wider mb-1">PERK SHOP</h1>
          <p className="text-text-dim text-sm">
            Tokens: <span className="text-accent-cyan font-bold">{state.tokens}</span>
          </p>
        </motion.div>

        {/* Cosmetics */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-accent-amber tracking-wider mb-1">COSMETICS &amp; CHAOS</h2>
          <p className="text-xs text-text-dim mb-4">Maximize dopamine. Minimize productivity.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {cosmeticPerks.map((perk, i) =>
              renderPerkCard(perk, i, "border-accent-amber/40", "text-accent-amber")
            )}
          </div>
        </section>

        {/* Active Perks */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-accent-cyan tracking-wider mb-4">ACTIVE PERKS (Consumable)</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {activePerksList.map((perk, i) =>
              renderPerkCard(perk, i, "border-accent-cyan/40", "text-accent-cyan")
            )}
          </div>
        </section>

        {/* Passive Perks */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-accent-purple tracking-wider mb-4">PASSIVE UPGRADES (Permanent)</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {passivePerksList.map((perk, i) =>
              renderPerkCard(perk, i, "border-accent-purple/40", "text-accent-purple")
            )}
          </div>
        </section>

        <Link href="/" className="text-sm text-text-dim hover:text-accent-green transition-colors">
          &larr; BACK TO BASE
        </Link>
      </div>
    </>
  );
}

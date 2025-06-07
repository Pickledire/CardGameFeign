# Feign Card Game

A digital implementation of the strategic card game Feign, built with Tauri (Rust backend + React/TypeScript frontend).

## Game Overview

Feign is a 1v1 strategic card game that blends tactical creature combat with bluffing mechanics through a unique "Feign" system. Players summon creatures, play special global effect cards, and lay down face-down cards that can change the tide of battle.

### Core Mechanics
- **1v1 System**: One verses one against the player
- **Turn Phases**: Draw → Placement → Attack → End Turn
- **Card Types**: 
  - 🐉 **Creatures**: Have attack/defense stats and fight on the battlefield
  - 🎭 **Feign Cards**: Played face-down with special effects when revealed
  - 🌐 **Effect Cards**: Global effects that affect both players
- **Six Colors**: Each with unique themes and mechanics
  - **Verdant** (Green): Nature, growth, beast synergy
  - **Cinder** (Red): Aggression, damage, rage
  - **Azure** (Blue): Control, bounce, illusions
  - **Ivory** (White): Protection, healing, order
  - **Umbral** (Black): Sacrifice, decay, reanimation
  - **Violet** (Purple): Interaction with effect cards

## Project Structure

### Backend (Rust)
```
src-tauri/src/
├── models/          # Data structures (Card, Player, GameState, etc.)
├── core/            # Game logic modules
│   ├── game_engine.rs   # Main game state management
│   ├── combat.rs        # Combat resolution logic
│   └── deck_builder.rs  # Mock card data and deck creation
├── commands.rs      # Tauri command handlers
└── lib.rs          # Main application setup
```

### Frontend (React/TypeScript)
```
src/
├── types/          # TypeScript type definitions
├── services/       # API service layer
├── hooks/          # React hooks for state management
├── components/     # React components
│   ├── cards/          # Card display components
│   ├── GameBoard.tsx   # Main game interface
│   └── GameLog.tsx     # Event logging
└── App.tsx         # Main application component
```

## Prerequisites

Before running the application, you need to install:

1. **Node.js** (v16 or later) - for the frontend
2. **Rust** (latest stable) - for the backend
   - Install from: https://rustup.rs/
3. **System Dependencies** - See [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

## Installation & Setup

1. **Clone and navigate to the project**:
   ```bash
   cd feign-card-game
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Rust dependencies** (done automatically when running Tauri):
   ```bash
   # This will be done automatically, but you can test with:
   cd src-tauri
   cargo check
   cd ..
   ```

## Development

### Running the Application

Start the development server:
```bash
npm run tauri dev
```

This will:
- Start the React development server
- Compile the Rust backend
- Launch the Tauri desktop application
- Enable hot reload for both frontend and backend changes

### Available Commands

- `npm run tauri dev` - Start development mode
- `npm run tauri build` - Build for production
- `npm run dev` - Frontend only (for UI development)
- `npm run build` - Build frontend only

### Mock Cards Included

The game includes 24+ sample cards across all colors and types:
- **Creatures**: Forest Wolf, Flame Dragon, Frost Elemental, Guardian Angel, Shadow Wraith, Mystic Scholar
- **Feign Cards**: Shield Trap, Counter Strike, Mana Boost, Illusion, Soul Drain, Arcane Resonance  
- **Effect Cards**: Blessing of Growth, Inferno, Frozen Time, Divine Protection, Curse of Weakness, Arcane Amplification

## How to Play

1. **Setup**: Enter player names and start a new game
2. **Draw Phase**: Automatically draw a card and gain mana
3. **Placement Phase**: 
   - Play creatures to your front row (4 columns)
   - Play feigns face-down to your back row
   - Play global effects that affect both players
4. **Attack Phase**: 
   - Attack with your creatures
   - Reveal feigns for special effects
   - Resolve combat (creature vs creature or direct damage)
5. **End Turn**: Pass turn to opponent

**Win Condition**: Reduce your opponent's life from 20 to 0.

## Next Steps for Development

1. **Ability To Play Cards**: Attacks, Placement, Drawing
2. **Enhanced Graphics**: Better UI for the player to help understand the game
3. **AI Opponent**: Implement bot players for single-player mode
4. **Deck Building**: Allow custom deck construction
5. **More Cards**: Expand the card database with unique effects

## Technology Stack

- **Backend**: Rust, Tauri, Serde
- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Architecture**: Clean Architecture, Domain-Driven Design
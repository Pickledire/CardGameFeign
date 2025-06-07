// TypeScript types that mirror Rust structs for Feign card game

export enum Color {
  Verdant = "Verdant", // Green - Nature, growth, beast synergy
  Cinder = "Cinder",   // Red - Aggression, damage, rage
  Azure = "Azure",     // Blue - Control, bounce, illusions
  Ivory = "Ivory",     // White - Protection, healing, order
  Umbral = "Umbral",   // Black - Sacrifice, decay, reanimation
  Violet = "Violet",   // Purple - Interaction with effect cards
}

export enum CardType {
  Creature = "Creature",
  Feign = "Feign",
  Effect = "Effect",
}

export interface Card {
  id: number;
  name: string;
  card_type: CardType;
  color: Color;
  mana_cost: number;
  description: string;
  // Creature-specific stats (null for non-creatures)
  attack: number | null;
  defense: number | null;
  // Effect-specific duration (null for non-effects)
  duration: number | null;
}

export interface Creature {
  card: Card;
  current_attack: number;
  current_defense: number;
  is_tapped: boolean;
}

export interface FeignCard {
  card: Card;
  is_revealed: boolean;
}

export interface GlobalEffect {
  card: Card;
  remaining_duration: number;
}

export interface PlayerBoard {
  creatures: Creature[]; // Flexible creature list
  feigns: FeignCard[];   // Flexible feign list
}

export interface Player {
  id: number;
  name: string;
  life: number;
  mana: number;
  hand: Card[];
  deck: Card[];
  board: PlayerBoard;
}

export enum GamePhase {
  Draw = "Draw",
  Placement = "Placement",
  Attack = "Attack",
  EndTurn = "EndTurn",
}

export interface GameState {
  player1: Player;
  player2: Player;
  current_player: number; // 1 or 2
  turn_number: number;
  phase: GamePhase;
  global_effect: GlobalEffect | null;
  game_log: string[];
}

export type PlayerAction = 
  | { PlayCreature: { card_id: number } }
  | { PlayFeign: { card_id: number } }
  | { PlayEffect: { card_id: number } }
  | { Attack: { creature_index: number } }
  | { RevealFeign: { feign_index: number } }
  | "EndPhase";

export interface ActionResult {
  success: boolean;
  message: string;
  new_state: GameState | null;
} 
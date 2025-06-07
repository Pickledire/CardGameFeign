use serde::{Deserialize, Serialize};

/// Represents the six color identities in Feign
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Color {
    Verdant, // Green - Nature, growth, beast synergy
    Cinder,  // Red - Aggression, damage, rage
    Azure,   // Blue - Control, bounce, illusions
    Ivory,   // White - Protection, healing, order
    Umbral,  // Black - Sacrifice, decay, reanimation
    Violet,  // Purple - Interaction with effect cards
}

/// Different types of cards in the game
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CardType {
    Creature,
    Feign,
    Effect,
}

/// Represents a card in the game
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Card {
    pub id: u32,
    pub name: String,
    pub card_type: CardType,
    pub color: Color,
    pub mana_cost: u32,
    pub description: String,
    // Creature-specific stats (None for non-creatures)
    pub attack: Option<u32>,
    pub defense: Option<u32>,
    // Effect-specific duration (None for non-effects)
    pub duration: Option<u32>,
}

/// Represents a creature on the battlefield
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Creature {
    pub card: Card,
    pub current_attack: u32,
    pub current_defense: u32,
    pub is_tapped: bool,
}

/// Represents a face-down feign card
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeignCard {
    pub card: Card,
    pub is_revealed: bool,
}

/// Represents a global effect card
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GlobalEffect {
    pub card: Card,
    pub remaining_duration: u32,
}

/// Represents a player's board state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerBoard {
    pub creatures: Vec<Creature>, // Flexible creature list
    pub feigns: Vec<FeignCard>,   // Flexible feign list
}

/// Represents a player in the game
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub id: u32,
    pub name: String,
    pub life: u32,
    pub mana: u32,
    pub hand: Vec<Card>,
    pub deck: Vec<Card>,
    pub board: PlayerBoard,
}

/// Represents the current game state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub player1: Player,
    pub player2: Player,
    pub current_player: u32, // 1 or 2
    pub turn_number: u32,
    pub phase: GamePhase,
    pub global_effect: Option<GlobalEffect>,
    pub game_log: Vec<String>,
}

/// Different phases of a turn
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum GamePhase {
    Draw,
    Placement,
    Attack,
    EndTurn,
}

/// Actions a player can take
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PlayerAction {
    PlayCreature { card_id: u32 },
    PlayFeign { card_id: u32 },
    PlayEffect { card_id: u32 },
    Attack { creature_index: usize },
    RevealFeign { feign_index: usize },
    EndPhase,
}

/// Result of an action
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionResult {
    pub success: bool,
    pub message: String,
    pub new_state: Option<GameState>,
} 
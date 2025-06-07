use crate::models::*;
use crate::core::combat::CombatResolver;

/// Main game engine that manages game state and turn flow
pub struct GameEngine {
    pub state: GameState,
}

impl GameEngine {
    /// Create a new game with two players
    pub fn new(player1_name: String, player2_name: String) -> Self {
        let mut engine = GameEngine {
            state: GameState {
                player1: Player {
                    id: 1,
                    name: player1_name,
                    life: 20,
                    mana: 5, // Start with 5 mana
                    hand: Vec::new(),
                    deck: Vec::new(),
                    board: PlayerBoard {
                        creatures: Vec::new(),
                        feigns: Vec::new(),
                    },
                },
                player2: Player {
                    id: 2,
                    name: player2_name,
                    life: 20,
                    mana: 5, // Start with 5 mana
                    hand: Vec::new(),
                    deck: Vec::new(),
                    board: PlayerBoard {
                        creatures: Vec::new(),
                        feigns: Vec::new(),
                    },
                },
                current_player: 1,
                turn_number: 1,
                phase: GamePhase::Draw,
                global_effect: None,
                game_log: vec!["Game started!".to_string()],
            },
        };

        // Initialize with mock decks
        engine.state.player1.deck = crate::core::create_mock_deck();
        engine.state.player2.deck = crate::core::create_mock_deck();

        // Draw initial hands (5 cards each)
        for _ in 0..5 {
            engine.draw_card(1);
            engine.draw_card(2);
        }

        engine
    }

    /// Process a player action
    pub fn process_action(&mut self, player_id: u32, action: PlayerAction) -> ActionResult {
        if player_id != self.state.current_player {
            return ActionResult {
                success: false,
                message: "It's not your turn!".to_string(),
                new_state: None,
            };
        }

        match action {
            PlayerAction::PlayCreature { card_id } => {
                self.play_creature(player_id, card_id)
            }
            PlayerAction::PlayFeign { card_id } => {
                self.play_feign(player_id, card_id)
            }
            PlayerAction::PlayEffect { card_id } => {
                self.play_effect(player_id, card_id)
            }
            PlayerAction::Attack { creature_index } => {
                self.attack(player_id, creature_index)
            }
            PlayerAction::RevealFeign { feign_index } => {
                self.reveal_feign(player_id, feign_index)
            }
            PlayerAction::EndPhase => {
                self.end_phase()
            }
        }
    }

    /// Draw a card for the specified player
    pub fn draw_card(&mut self, player_id: u32) -> bool {
        let (success, log_message) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };

            if let Some(card) = player.deck.pop() {
                player.hand.push(card);
                (true, format!("{} draws a card", player.name))
            } else {
                (false, format!("{} cannot draw - deck is empty!", player.name))
            }
        };
        
        self.log_event(log_message);
        success
    }

    /// Play a creature card
    fn play_creature(&mut self, player_id: u32, card_id: u32) -> ActionResult {
        if self.state.phase != GamePhase::Placement {
            return ActionResult {
                success: false,
                message: "Can only play creatures during placement phase".to_string(),
                new_state: None,
            };
        }

        let (result, log_message) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };

            // Find and remove card from hand
            if let Some(card_index) = player.hand.iter().position(|c| c.id == card_id) {
                let card = player.hand.remove(card_index);

                // Check if it's a creature card
                if card.card_type != CardType::Creature {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Card is not a creature".to_string(),
                        new_state: None,
                    };
                }

                // Check mana cost
                if card.mana_cost > player.mana {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Not enough mana".to_string(),
                        new_state: None,
                    };
                }

                // Pay mana and place creature
                player.mana -= card.mana_cost;
                let creature = Creature {
                    current_attack: card.attack.unwrap_or(0),
                    current_defense: card.defense.unwrap_or(0),
                    is_tapped: false,
                    card: card.clone(),
                };

                let log_msg = format!("{} plays {}", player.name, creature.card.name);
                player.board.creatures.push(creature);

                (ActionResult {
                    success: true,
                    message: "Creature played successfully".to_string(),
                    new_state: None, // Will be set after logging
                }, Some(log_msg))
            } else {
                (ActionResult {
                    success: false,
                    message: "Card not found in hand".to_string(),
                    new_state: None,
                }, None)
            }
        };

        if let Some(log_msg) = log_message {
            self.log_event(log_msg);
        }

        ActionResult {
            success: result.success,
            message: result.message,
            new_state: if result.success { Some(self.state.clone()) } else { None },
        }
    }

    /// Play a feign card
    fn play_feign(&mut self, player_id: u32, card_id: u32) -> ActionResult {
        if self.state.phase != GamePhase::Placement {
            return ActionResult {
                success: false,
                message: "Can only play feigns during placement phase".to_string(),
                new_state: None,
            };
        }

        let (result, log_message) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };

            // Find and remove card from hand
            if let Some(card_index) = player.hand.iter().position(|c| c.id == card_id) {
                let card = player.hand.remove(card_index);

                // Check if it's a feign card
                if card.card_type != CardType::Feign {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Card is not a feign".to_string(),
                        new_state: None,
                    };
                }

                // Check mana cost
                if card.mana_cost > player.mana {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Not enough mana".to_string(),
                        new_state: None,
                    };
                }

                // Pay mana and place feign
                player.mana -= card.mana_cost;
                let feign = FeignCard {
                    card: card.clone(),
                    is_revealed: false,
                };

                let log_msg = format!("{} plays a feign card", player.name);
                player.board.feigns.push(feign);

                (ActionResult {
                    success: true,
                    message: "Feign played successfully".to_string(),
                    new_state: None, // Will be set after logging
                }, Some(log_msg))
            } else {
                (ActionResult {
                    success: false,
                    message: "Card not found in hand".to_string(),
                    new_state: None,
                }, None)
            }
        };

        if let Some(log_msg) = log_message {
            self.log_event(log_msg);
        }

        ActionResult {
            success: result.success,
            message: result.message,
            new_state: if result.success { Some(self.state.clone()) } else { None },
        }
    }

    /// Play an effect card
    fn play_effect(&mut self, player_id: u32, card_id: u32) -> ActionResult {
        if self.state.phase != GamePhase::Placement {
            return ActionResult {
                success: false,
                message: "Can only play effects during placement phase".to_string(),
                new_state: None,
            };
        }

        let (result, log_message) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };

            // Find and remove card from hand
            if let Some(card_index) = player.hand.iter().position(|c| c.id == card_id) {
                let card = player.hand.remove(card_index);

                // Check if it's an effect card
                if card.card_type != CardType::Effect {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Card is not an effect".to_string(),
                        new_state: None,
                    };
                }

                // Check mana cost
                if card.mana_cost > player.mana {
                    player.hand.push(card); // Put it back
                    return ActionResult {
                        success: false,
                        message: "Not enough mana".to_string(),
                        new_state: None,
                    };
                }

                // Pay mana
                player.mana -= card.mana_cost;
                let log_msg = format!("{} plays global effect: {}", player.name, card.name);
                
                (ActionResult {
                    success: true,
                    message: "Effect played successfully".to_string(),
                    new_state: None, // Will be set after logging
                }, Some((log_msg, card)))
            } else {
                (ActionResult {
                    success: false,
                    message: "Card not found in hand".to_string(),
                    new_state: None,
                }, None)
            }
        };

        if let Some((log_msg, card)) = log_message {
            // Place effect (replaces existing global effect)
            let effect = GlobalEffect {
                remaining_duration: card.duration.unwrap_or(3),
                card,
            };
            self.state.global_effect = Some(effect);
            self.log_event(log_msg);
        }

        ActionResult {
            success: result.success,
            message: result.message,
            new_state: if result.success { Some(self.state.clone()) } else { None },
        }
    }

    /// Attack with a creature
    fn attack(&mut self, player_id: u32, creature_index: usize) -> ActionResult {
        if self.state.phase != GamePhase::Attack {
            return ActionResult {
                success: false,
                message: "Can only attack during attack phase".to_string(),
                new_state: None,
            };
        }

        let attacker_exists = if player_id == 1 {
            creature_index < self.state.player1.board.creatures.len()
        } else {
            creature_index < self.state.player2.board.creatures.len()
        };

        if !attacker_exists {
            return ActionResult {
                success: false,
                message: "No creature at that index to attack with".to_string(),
                new_state: None,
            };
        }

        // Simple direct attack to opponent's life for now
        let (attacker_name, damage) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };
            
            let creature = &mut player.board.creatures[creature_index];
            creature.is_tapped = true;
            (creature.card.name.clone(), creature.current_attack)
        };

        // Deal damage to opponent
        let opponent = if player_id == 1 {
            &mut self.state.player2
        } else {
            &mut self.state.player1
        };
        
        opponent.life = opponent.life.saturating_sub(damage);
        
        let log_msg = format!("{} attacks with {} for {} damage!", 
            if player_id == 1 { &self.state.player1.name } else { &self.state.player2.name },
            attacker_name, damage);
        
        self.log_event(log_msg);

        ActionResult {
            success: true,
            message: format!("Attacked for {} damage", damage),
            new_state: Some(self.state.clone()),
        }
    }

    /// Reveal a feign card
    fn reveal_feign(&mut self, player_id: u32, feign_index: usize) -> ActionResult {
        let (success, message, feign_name) = {
            let player = if player_id == 1 {
                &mut self.state.player1
            } else {
                &mut self.state.player2
            };

            if feign_index >= player.board.feigns.len() {
                (false, "No feign at that index".to_string(), None)
            } else {
                let feign = &mut player.board.feigns[feign_index];
                if feign.is_revealed {
                    (false, "Feign already revealed".to_string(), None)
                } else {
                    feign.is_revealed = true;
                    let name = feign.card.name.clone();
                    (true, format!("Revealed: {}", name), Some(name))
                }
            }
        };

        if let Some(name) = feign_name {
            let log_msg = format!("{} reveals feign: {}", 
                if player_id == 1 { &self.state.player1.name } else { &self.state.player2.name },
                name);
            self.log_event(log_msg);
        }

        ActionResult {
            success,
            message,
            new_state: if success { Some(self.state.clone()) } else { None },
        }
    }

    /// End the current phase and advance to next
    fn end_phase(&mut self) -> ActionResult {
        match self.state.phase {
            GamePhase::Draw => {
                // Draw phase: draw a card and gain mana
                self.draw_card(self.state.current_player);
                let player = if self.state.current_player == 1 {
                    &mut self.state.player1
                } else {
                    &mut self.state.player2
                };
                player.mana += 2; // Gain 2 mana per turn
                self.state.phase = GamePhase::Placement;
                self.log_event("Entering placement phase".to_string());
            }
            GamePhase::Placement => {
                self.state.phase = GamePhase::Attack;
                self.log_event("Entering attack phase".to_string());
            }
            GamePhase::Attack => {
                self.state.phase = GamePhase::EndTurn;
                self.log_event("Entering end turn phase".to_string());
            }
            GamePhase::EndTurn => {
                // End turn: tick down global effects, switch players
                let expired_effect = if let Some(ref mut effect) = self.state.global_effect {
                    effect.remaining_duration -= 1;
                    if effect.remaining_duration == 0 {
                        let effect_name = effect.card.name.clone();
                        self.state.global_effect = None;
                        Some(effect_name)
                    } else {
                        None
                    }
                } else {
                    None
                };

                if let Some(effect_name) = expired_effect {
                    self.log_event(format!("Global effect {} expires", effect_name));
                }

                // Switch to other player
                self.state.current_player = if self.state.current_player == 1 { 2 } else { 1 };
                self.state.turn_number += 1;
                self.state.phase = GamePhase::Draw;
                
                let current_player_name = if self.state.current_player == 1 {
                    self.state.player1.name.clone()
                } else {
                    self.state.player2.name.clone()
                };
                self.log_event(format!("Turn {}: {}'s turn begins", self.state.turn_number, current_player_name));
            }
        }

        ActionResult {
            success: true,
            message: format!("Phase advanced to {:?}", self.state.phase),
            new_state: Some(self.state.clone()),
        }
    }

    /// Check if the game is over
    pub fn is_game_over(&self) -> Option<u32> {
        if self.state.player1.life == 0 {
            Some(2) // Player 2 wins
        } else if self.state.player2.life == 0 {
            Some(1) // Player 1 wins
        } else {
            None // Game continues
        }
    }

    /// Add an entry to the game log
    fn log_event(&mut self, message: String) {
        self.state.game_log.push(message);
    }
} 